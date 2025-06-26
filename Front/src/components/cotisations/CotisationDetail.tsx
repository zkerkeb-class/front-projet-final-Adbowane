import { useEffect, useState } from "react";
import { getCotisation, Cotisation } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CotisationDetailProps {
  cotisationId: number;
  onEdit: (id: number) => void;
  onBack: () => void;
}

const CotisationDetail = ({ cotisationId, onEdit, onBack }: CotisationDetailProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [cotisation, setCotisation] = useState<Cotisation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCotisation();
    // eslint-disable-next-line
  }, [cotisationId, token]);

  const fetchCotisation = async () => {
    setLoading(true);
    const data = await getCotisation(cotisationId, token);
    if (data.error) {
      toast({ title: "Erreur", description: data.error, variant: "destructive" });
      setCotisation(null);
    } else {
      setCotisation(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </CardContent>
      </Card>
    );
  }

  if (!cotisation) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détail Cotisation #{cotisation.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Nom :</strong> {cotisation.nom}
          </div>
          <div>
            <strong>Prénom :</strong> {cotisation.prenom}
          </div>
          <div>
            <strong>Montant :</strong> {Number(cotisation.montant).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
          <div>
            <strong>Date de paiement :</strong> {new Date(cotisation.date_paiement).toLocaleDateString("fr-FR")}
          </div>
          <div>
            <strong>Méthode de paiement :</strong> {cotisation.methode_paiement}
          </div>
          <div>
            <strong>Statut :</strong> {cotisation.statut_paiement}
          </div>
          <div className="md:col-span-2">
            <strong>Commentaire :</strong> {cotisation.commentaire}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Retour à la liste</Button>
        <Button variant="default" onClick={() => onEdit(cotisation.id)}>Modifier</Button>
      </CardFooter>
    </Card>
  );
};

export default CotisationDetail;
