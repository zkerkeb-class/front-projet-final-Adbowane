
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, UserCheck, UserX } from "lucide-react";
import { getInscriptions, updateInscriptionPresence, Inscription } from "@/lib/api";

interface MemberInscriptionsProps {
  memberId: number;
}

const MemberInscriptions = ({ memberId }: MemberInscriptionsProps) => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchInscriptions();
  }, [memberId, token]);

  const fetchInscriptions = async () => {
    setLoading(true);
    try {
      const data = await getInscriptions(token, { membre_id: memberId });
      if (data.error) {
        throw new Error(data.error);
      }
      setInscriptions(data);
    } catch (error) {
      console.error("Error fetching inscriptions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les inscriptions du membre.",
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de présence.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inscriptions du membre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Inscriptions du membre
          <Badge variant="outline">{inscriptions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune inscription trouvée pour ce membre.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Présence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell className="font-medium">
                    {inscription.activite?.titre || "Activité inconnue"}
                  </TableCell>
                  <TableCell>
                    {inscription.activite?.date_debut 
                      ? new Date(inscription.activite.date_debut).toLocaleDateString("fr-FR")
                      : "Date inconnue"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {inscription.activite?.lieu || "Lieu inconnu"}
                    </div>
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

export default MemberInscriptions;
