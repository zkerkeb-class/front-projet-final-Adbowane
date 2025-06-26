import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCotisation, createCotisation, updateCotisation, Cotisation } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  membre_id: z.string().min(1, "Sélectionnez un membre"),
  montant: z.string().refine(val => parseFloat(val) > 0, "Montant positif requis"),
  date_paiement: z.string().min(1, "Date requise"),
  methode_paiement: z.enum(["CB", "Virement", "Espèces"], { required_error: "Méthode requise" }),
  statut_paiement: z.enum(["payé", "en attente"], { required_error: "Statut requis" }),
  commentaire: z.string().optional(),
});

interface CotisationFormProps {
  cotisationId?: number;
  members: { id: number; nom: string; prenom: string }[];
  onSuccess: () => void;
  onCancel: () => void;
}

const CotisationForm = ({ cotisationId, members, onSuccess, onCancel }: CotisationFormProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!cotisationId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membre_id: "",
      montant: "",
      date_paiement: "",
      methode_paiement: "CB",
      statut_paiement: "payé",
      commentaire: "",
    },
  });

  useEffect(() => {
    if (cotisationId) {
      setLoading(true);
      getCotisation(cotisationId, token).then(data => {
        if (data && !data.error) {
          form.reset({
            membre_id: data.membre_id.toString(),
            montant: data.montant,
            date_paiement: data.date_paiement.split("T")[0],
            methode_paiement: data.methode_paiement,
            statut_paiement: data.statut_paiement,
            commentaire: data.commentaire || "",
          });
        }
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [cotisationId, token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      membre_id: parseInt(values.membre_id),
      montant: values.montant,
      date_paiement: values.date_paiement,
      methode_paiement: values.methode_paiement,
      statut_paiement: values.statut_paiement,
      commentaire: values.commentaire,
    };
    setLoading(true);
    let res;
    if (cotisationId) {
      res = await updateCotisation(cotisationId, payload, token);
    } else {
      res = await createCotisation(payload, token);
    }
    setLoading(false);
    if (res && res.error) {
      toast({ title: "Erreur", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: cotisationId ? "Cotisation modifiée." : "Cotisation créée." });
      onSuccess();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cotisationId ? "Modifier la cotisation" : "Nouvelle cotisation"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Membre</label>
            <select
              {...form.register("membre_id")}
              className="border rounded px-2 py-1 w-full"
              disabled={!!cotisationId}
            >
              <option value="">Sélectionner un membre</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.prenom} {m.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant (€)</label>
            <Input type="number" step="0.01" {...form.register("montant")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de paiement</label>
            <Input type="date" {...form.register("date_paiement")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Méthode de paiement</label>
            <Select value={form.watch("methode_paiement")} onValueChange={v => form.setValue("methode_paiement", v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CB">CB</SelectItem>
                <SelectItem value="Virement">Virement</SelectItem>
                <SelectItem value="Espèces">Espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut de paiement</label>
            <Select value={form.watch("statut_paiement")} onValueChange={v => form.setValue("statut_paiement", v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payé">Payé</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <Textarea {...form.register("commentaire")} />
          </div>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
            <Button type="submit" disabled={loading}>{cotisationId ? "Enregistrer" : "Créer"}</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CotisationForm;
