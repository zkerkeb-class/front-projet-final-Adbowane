import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, TrendingUp, Users, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:3003";

const Reports = () => {
  const { user, token } = useAuth();
  const [membersStats, setMembersStats] = useState<{ total: number; monthly: any[] }>({ total: 0, monthly: [] });
  const [activitiesStats, setActivitiesStats] = useState<{ total: number; repartition: any[] }>({ total: 0, repartition: [] });
  const [participationRate, setParticipationRate] = useState<number>(0);
  const [budgetUsed, setBudgetUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Membres
        const membersRes = await fetch(`${API_URL}/api/dashboard/members-stats`, { headers });
        if (!membersRes.ok) throw new Error(`Erreur membres: ${membersRes.status} ${membersRes.statusText}`);
        const membersData = await membersRes.json();
        // Adapter la structure pour le graphique
        setMembersStats({
          total: membersData.total || 0,
          monthly: [
            {
              month: "Ce mois",
              newMembers: Number(membersData.actifs) || 0,
              totalMembers: Number(membersData.total) || 0,
            }
          ],
        });

        // Activités
        const activitiesRes = await fetch(`${API_URL}/api/dashboard/activities-stats`, { headers });
        if (!activitiesRes.ok) throw new Error(`Erreur activités: ${activitiesRes.status} ${activitiesRes.statusText}`);
        const activitiesData = await activitiesRes.json();
        // Adapter la structure pour le graphique
        setActivitiesStats({
          total: activitiesData.total || 0,
          repartition: [
            {
              name: "Actives",
              value: Number(activitiesData.actives) || 0,
              color: "#3b82f6"
            },
            {
              name: "Inactives",
              value: Number(activitiesData.inactives) || 0,
              color: "#e5e7eb"
            }
          ],
        });

        // Participation
        const participationRes = await fetch(`${API_URL}/api/dashboard/participation-rate`, { headers });
        if (!participationRes.ok) throw new Error(`Erreur participation: ${participationRes.status} ${participationRes.statusText}`);
        const participationData = await participationRes.json();
        setParticipationRate(participationData.participationRate || 0);

        // Budget
        const financesRes = await fetch(`${API_URL}/api/dashboard/monthly-finances`, { headers });
        if (!financesRes.ok) throw new Error(`Erreur finances: ${financesRes.status} ${financesRes.statusText}`);
        const financesData = await financesRes.json();
        // Calcul du budget utilisé (dépenses / revenus * 100) sur le dernier mois
        let budget = 0;
        if (Array.isArray(financesData) && financesData.length > 0) {
          const last = financesData[financesData.length - 1];
          const totalRevenues = Number(last.totalRevenues) || 0;
          const totalExpenses = Number(last.totalExpenses) || 0;
          budget = totalRevenues > 0 ? Math.round((totalExpenses / totalRevenues) * 100) : 0;
        }
        setBudgetUsed(budget);

      } catch (e: any) {
        setError(e?.message || "Erreur inconnue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const exportReport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Fonctionnalité à venir",
      description: `L'export ${format === "pdf" ? "PDF" : "Excel"} sera bientôt disponible.`,
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="crm-container py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rapports</h1>
            <p className="text-gray-600 mt-1">Analysez les performances de votre association</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => exportReport('pdf')} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport('excel')} className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">Chargement des données...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-red-600">
            <AlertTriangle className="w-10 h-10 mb-2" />
            <div className="font-semibold mb-2">Erreur lors du chargement des rapports</div>
            <div className="mb-4">{error}</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Membres totaux</p>
                      <p className="text-2xl font-bold">{membersStats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Activités ce mois</p>
                      <p className="text-2xl font-bold">{activitiesStats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taux de participation</p>
                      <p className="text-2xl font-bold">{participationRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Budget utilisé</p>
                      <p className="text-2xl font-bold">{budgetUsed}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des membres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={membersStats.monthly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newMembers" fill="#3b82f6" name="Nouveaux membres" />
                        <Bar dataKey="totalMembers" fill="#10b981" name="Total membres" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des activités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activitiesStats.repartition}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {activitiesStats.repartition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
