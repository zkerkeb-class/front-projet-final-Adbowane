import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, API_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import EditActivityForm from "./EditActivityForm";

interface ActivityListProps {
  onViewDetails: (activity: Activity) => void;
}

const ActivityList = ({ onViewDetails }: ActivityListProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des activités");
      }

      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setActivityToEdit(activity);
  };

  const handleEditSubmit = async (updatedActivity: Activity) => {
    try {
      const response = await fetch(`${API_URL}/api/activities/${updatedActivity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedActivity),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'activité");
      }

      toast({
        title: "Succès",
        description: "L'activité a été mise à jour avec succès.",
      });
      setActivityToEdit(null);
      fetchActivities();
    } catch (err) {
      console.error("Error updating activity:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'activité.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/activities/${activityToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'activité");
      }

      toast({
        title: "Succès",
        description: "L'activité a été supprimée avec succès.",
      });
      setActivityToDelete(null);
      fetchActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [token]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <AlertTriangle size={48} className="text-amber-500 mb-3" />
            <h3 className="text-xl font-medium">Erreur</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <h3 className="text-xl font-medium">Aucune activité trouvée</h3>
            <p className="text-gray-500">Ajoutez une nouvelle activité pour commencer.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des activités</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.titre}</TableCell>
                <TableCell>
                  {new Date(activity.date_debut).toLocaleDateString("fr-FR")} -{" "}
                  {new Date(activity.date_fin).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>{activity.lieu}</TableCell>
                <TableCell>{activity.capacite_max}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(activity)}
                  >
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleEdit(activity)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => setActivityToDelete(activity)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog open={!!activityToDelete} onOpenChange={() => setActivityToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cette activité sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continuer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={!!activityToEdit} onOpenChange={() => setActivityToEdit(null)}>
          {activityToEdit && (
            <EditActivityForm 
              activity={activityToEdit}
              onSubmit={handleEditSubmit}
              onCancel={() => setActivityToEdit(null)}
            />
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ActivityList;
