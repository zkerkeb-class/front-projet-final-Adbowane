
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { addMember } from "@/lib/api";

// Schéma de validation du formulaire
const formSchema = z.object({
  utilisateur_id: z.string().min(1, "L'ID utilisateur est requis"),
  date_adhesion: z.string().min(1, "La date d'adhésion est requise"),
  statut_adhesion: z.enum(["actif", "suspendu", "expiré"], {
    required_error: "Le statut est requis",
  }),
  document_adhesion: z.string().optional(),
});

interface AddMemberFormProps {
  onSuccess: () => void;
}

const AddMemberForm = ({ onSuccess }: AddMemberFormProps) => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentBase64, setDocumentBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utilisateur_id: "",
      date_adhesion: new Date().toISOString().split("T")[0],
      statut_adhesion: "actif",
      document_adhesion: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      
      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setDocumentBase64(base64String);
        form.setValue("document_adhesion", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un membre",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await addMember(
        {
          utilisateur_id: parseInt(values.utilisateur_id),
          date_adhesion: values.date_adhesion,
          statut_adhesion: values.statut_adhesion,
          document_adhesion: values.document_adhesion,
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
          description: "Le membre a été ajouté avec succès",
        });
        form.reset();
        setDocumentFile(null);
        setDocumentBase64(null);
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ajouter un nouveau membre</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="utilisateur_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="ID de l'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date_adhesion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'adhésion</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="statut_adhesion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                        <SelectItem value="expiré">Expiré</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="document_adhesion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document d'adhésion</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    {documentFile && (
                      <p className="text-xs text-gray-500">
                        Fichier: {documentFile.name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="px-0 pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-crm-primary hover:bg-blue-700"
              >
                {isSubmitting ? "En cours..." : "Ajouter le membre"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddMemberForm;
