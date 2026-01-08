
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, UserCheck, UserX } from "lucide-react";
import { getInscriptions, updateInscriptionPresence, Inscription } from "@/lib/api";

interface ActivityParticipantsProps {
  activityId: number;
}

const ActivityParticipants = ({ activityId }: ActivityParticipantsProps) => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchParticipants();
  }, [activityId, token]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      console.log(`Fetching participants for activity ${activityId}`);
      const data = await getInscriptions(token, { activite_id: activityId });
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Participants data received:', data);
      setInscriptions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de charger les participants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePresenceToggle = async (inscriptionId: number, currentPresence: boolean) => {
    setUpdating(inscriptionId);
    try {
      const result = await updateInscriptionPresence(inscriptionId, !currentPresence, token);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Succès",
        description: "Le statut de présence a été mis à jour.",
      });
      
      setInscriptions(prev =>
        prev.map(inscription =>
          inscription.id === inscriptionId
            ? { ...inscription, presence: !currentPresence }
            : inscription
        )
      );
    } catch (err) {
      console.error("Error updating presence:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de présence.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Participants
          <Badge variant="outline">{inscriptions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <AlertTriangle size={48} className="text-amber-500 mb-3" />
            <h3 className="text-xl font-medium">Erreur</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchParticipants} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : inscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun participant inscrit pour cette activité.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date inscription</TableHead>
                <TableHead>Présence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell className="font-medium">
                    {inscription.membre?.nom || "Nom inconnu"}
                  </TableCell>
                  <TableCell>
                    {inscription.membre?.prenom || "Prénom inconnu"}
                  </TableCell>
                  <TableCell>
                    {inscription.membre?.email || "Email inconnu"}
                  </TableCell>
                  <TableCell>
                    {new Date(inscription.date_inscription).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inscription.presence ? "default" : "secondary"}>
                      {inscription.presence ? "Présent" : "Absent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresenceToggle(inscription.id, inscription.presence)}
                      disabled={updating === inscription.id}
                    >
                      {inscription.presence ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Marquer absent
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Marquer présent
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityParticipants;
