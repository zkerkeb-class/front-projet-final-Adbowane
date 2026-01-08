import { useState, useEffect } from "react";
import { getCotisations, deleteCotisation, Cotisation } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Pencil, Trash2 } from "lucide-react";

interface CotisationListProps {
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
}

const PAGE_SIZE = 10;

const CotisationList = ({ onViewDetail, onEdit }: CotisationListProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCotisations();
  }, [token]);

  const fetchCotisations = async () => {
    setLoading(true);
    const data = await getCotisations(token);
    if (data.error) {
      toast({ title: "Erreur", description: data.error, variant: "destructive" });
      setCotisations([]);
    } else {
      setCotisations(data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteCotisation(deleteId, token);
    if (res.error) {
      toast({ title: "Erreur", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Cotisation supprimée." });
      fetchCotisations();
    }
    setDeleteId(null);
  };

  // Filtrage
  const filtered = cotisations.filter(c =>
    (c.nom + " " + c.prenom).toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? c.statut_paiement === statusFilter : true)
  );

  // Pagination
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des cotisations</CardTitle>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Recherche nom ou prénom"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Tous statuts</option>
            <option value="payé">Payé</option>
            <option value="en attente">En attente</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.nom}</TableCell>
                    <TableCell>{c.prenom}</TableCell>
                    <TableCell>{Number(c.montant).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</TableCell>
                    <TableCell>{new Date(c.date_paiement).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{c.methode_paiement}</TableCell>
                    <TableCell>{c.statut_paiement}</TableCell>
                    <TableCell>{c.commentaire}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => onViewDetail(c.id)}>
                        <FileText className="w-4 h-4 mr-1" /> Voir
                      </Button>
                      <Button size="sm" variant="outline" className="ml-1" onClick={() => onEdit(c.id)}>
                        <Pencil className="w-4 h-4 mr-1" /> Modifier
                      </Button>
                      <Button size="sm" variant="destructive" className="ml-1" onClick={() => setDeleteId(c.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Page {page} / {totalPages || 1}
              </span>
              <div>
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Précédent
                </Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="ml-2">
                  Suivant
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la cotisation ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CotisationList;
