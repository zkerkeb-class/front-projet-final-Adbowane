import { useEffect, useState } from "react";
import { getCotisations, Cotisation } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, AlertTriangle } from "lucide-react";

const CotisationStats = () => {
  const { token } = useAuth();
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCotisations();
    // eslint-disable-next-line
  }, [token]);

  const fetchCotisations = async () => {
    setLoading(true);
    setError(null);
    const data = await getCotisations(token);
    if (data.error) {
      setError(data.error);
      setCotisations([]);
    } else {
      setCotisations(data);
    }
    setLoading(false);
  };

  const totalPayees = cotisations
    .filter(c => c.statut_paiement === "payé")
    .reduce((sum, c) => sum + parseFloat(c.montant), 0);

  const nbAttente = cotisations.filter(c => c.statut_paiement === "en attente").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total cotisations payées
          </CardTitle>
          <Euro className="text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : totalPayees.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Cotisations en attente
          </CardTitle>
          <AlertTriangle className="text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : `${nbAttente} cotisation${nbAttente > 1 ? "s" : ""} en attente`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CotisationStats;
