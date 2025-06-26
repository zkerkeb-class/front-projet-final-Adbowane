
import React, { useState } from 'react';
import { Activity } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { format, parseISO, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import EventFormDialog from './EventFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface EventListProps {
  activities: Activity[];
  filter: string;
  onRefetch: () => void;
}

const EventList: React.FC<EventListProps> = ({ activities, filter, onRefetch }) => {
  const { toast } = useToast();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  
  const filteredActivities = activities.filter(activity => {
    // Filter by type if filter is set
    if (filter !== 'all' && activity.type_activite !== filter) {
      return false;
    }
    
    // Show only future activities
    return isFuture(parseISO(activity.date_debut));
  });
  
  // Sort activities by date
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    parseISO(a.date_debut).getTime() - parseISO(b.date_debut).getTime()
  );

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };
  
  const handleDelete = async () => {
    if (!activityToDelete?.id) return;
    
    try {
      const response = await fetch(`http://localhost:3003/api/activities/${activityToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès.",
      });
      
      onRefetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement.",
        variant: "destructive"
      });
    } finally {
      setActivityToDelete(null);
    }
  };
  
  const handleEditComplete = () => {
    setEditingActivity(null);
    onRefetch();
    toast({
      title: "Événement modifié",
      description: "L'événement a été modifié avec succès.",
    });
  };
  
  const getEventColor = (activityType?: string) => {
    switch(activityType) {
      case 'reunion': return 'border-blue-500';
      case 'formation': return 'border-green-500';
      case 'loisir': return 'border-purple-500';
      default: return 'border-gray-500';
    }
  };

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun événement à venir correspondant aux critères sélectionnés.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity) => (
        <div 
          key={activity.id} 
          className={`p-4 border-l-4 rounded-md shadow-sm ${getEventColor(activity.type_activite)}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{activity.titre}</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(activity)}>
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setActivityToDelete(activity)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{activity.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Date: </span>
              {format(parseISO(activity.date_debut), 'PPP', { locale: fr })}
            </div>
            <div>
              <span className="font-medium">Heure: </span>
              {format(parseISO(activity.date_debut), 'HH:mm')} - {format(parseISO(activity.date_fin), 'HH:mm')}
            </div>
            <div>
              <span className="font-medium">Lieu: </span>
              {activity.lieu}
            </div>
            <div>
              <span className="font-medium">Capacité: </span>
              {activity.capacite_max} personnes
            </div>
          </div>
        </div>
      ))}
      
      {editingActivity && (
        <EventFormDialog 
          isOpen={Boolean(editingActivity)}
          onOpenChange={() => setEditingActivity(null)}
          onEventAdded={handleEditComplete}
          activity={editingActivity}
        />
      )}
      
      <AlertDialog open={Boolean(activityToDelete)} onOpenChange={(isOpen) => !isOpen && setActivityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventList;
