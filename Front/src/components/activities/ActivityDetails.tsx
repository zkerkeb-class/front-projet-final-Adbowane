import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getRegisteredMembers } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface ActivityDetailsProps {
  activity: {
    id: number;
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    lieu: string;
    capacite_max: number;
  };
  onClose: () => void;
}

const ActivityDetails = ({ activity, onClose }: ActivityDetailsProps) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const data = await getRegisteredMembers(activity.id, token);
        if ("error" in data) {
          throw new Error(data.error);
        }
        setParticipants(data);
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

    fetchParticipants();
  }, [activity.id, token, toast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Détails de l'activité</CardTitle>
          <Button variant="outline" onClick={onClose}>
            Retour
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h2 className="text-lg font-bold">{activity.titre}</h2>
          <p className="text-gray-600">{activity.description}</p>
          <p className="mt-2">
            <strong>Date :</strong> {new Date(activity.date_debut).toLocaleString("fr-FR")} -{" "}
            {new Date(activity.date_fin).toLocaleString("fr-FR")}
          </p>
          <p>
            <strong>Lieu :</strong> {activity.lieu}
          </p>
          <p>
            <strong>Capacité maximale :</strong> {activity.capacite_max}
          </p>
        </div>

        <h3 className="text-lg font-medium mb-4">Participants</h3>
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
          </div>
        ) : participants.length === 0 ? (
          <p className="text-gray-500">Aucun participant inscrit pour cette activité.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Présence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.id}</TableCell>
                  <TableCell>{participant.nom}</TableCell>
                  <TableCell>{participant.prenom}</TableCell>
                  <TableCell>{participant.presence ? "Présent" : "Absent"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityDetails;
