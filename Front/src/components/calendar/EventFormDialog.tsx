import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: number;
  nom: string;
  description: string;
  date_debut: string;
  date_fin: string;
  lieu: string;
  type: string;
  statut: string;
}

export interface EventFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdded: () => void;
  selectedDate?: Date;
  activity?: Activity;
}

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  isOpen,
  onOpenChange,
  onEventAdded,
  selectedDate,
  activity,
}) => {
  const [formData, setFormData] = useState({
    nom: activity?.nom || "",
    description: activity?.description || "",
    date_debut: activity?.date_debut || (selectedDate ? selectedDate.toISOString().split('T')[0] : ""),
    date_fin: activity?.date_fin || (selectedDate ? selectedDate.toISOString().split('T')[0] : ""),
    lieu: activity?.lieu || "",
    type: activity?.type || "réunion",
    statut: activity?.statut || "planifiée",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Événement créé",
      description: "L'événement a été ajouté avec succès.",
    });
    onEventAdded();
    onOpenChange(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Modifier l'événement" : "Nouvel événement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'événement</Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_debut">Date de début</Label>
              <Input
                id="date_debut"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_fin">Date de fin</Label>
              <Input
                id="date_fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lieu">Lieu</Label>
            <Input
              id="lieu"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="réunion">Réunion</option>
              <option value="formation">Formation</option>
              <option value="événement">Événement</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {activity ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
