import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Member, API_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { createActivity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

// Schéma de validation du formulaire
const formSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  lieu: z.string().min(1, "Le lieu est requis"),
  capacite_max: z.number().min(1, "La capacité doit être au moins 1"),
});

interface ActivityFormProps {
  onSuccess: () => void;
}

const ActivityForm = ({ onSuccess }: ActivityFormProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      lieu: "",
      capacite_max: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une activité",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createActivity(
        {
          titre: values.titre || "",
          description: values.description || "",
          date_debut: values.date_debut || "",
          date_fin: values.date_fin || "",
          lieu: values.lieu || "",
          capacite_max: values.capacite_max || 1,
        },
        token
      );
      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "L'activité a été créée avec succès",
        });
        form.reset();
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'activité",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle activité</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <Input id="titre" {...form.register("titre")} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea id="description" {...form.register("description")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
                Date de début
              </label>
              <Input type="datetime-local" id="date_debut" {...form.register("date_debut")} />
            </div>
            <div>
              <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
                Date de fin
              </label>
              <Input type="datetime-local" id="date_fin" {...form.register("date_fin")} />
            </div>
          </div>
          <div>
            <label htmlFor="lieu" className="block text-sm font-medium text-gray-700">
              Lieu
            </label>
            <Input id="lieu" {...form.register("lieu")} />
          </div>
          <div>
            <label htmlFor="capacite_max" className="block text-sm font-medium text-gray-700">
              Capacité maximale
            </label>
            <Input type="number" id="capacite_max" {...form.register("capacite_max", { valueAsNumber: true })} />
          </div>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Créer l'activité"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
