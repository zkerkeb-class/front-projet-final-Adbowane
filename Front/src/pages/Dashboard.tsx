import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Euro, 
  BarChart2, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from "recharts";
import { useToast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:3003"; // Replace with your actual API URL

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for API data
  const [activeMembersCount, setActiveMembersCount] = useState<number | null>(null);
  const [cotisationsStats, setCotisationsStats] = useState<{
    totalPaid: number;
    totalPending: number;
  } | null>(null);
  const [participationRate, setParticipationRate] = useState<number | null>(null);
  const [monthlyFinances, setMonthlyFinances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(false);
    
    try {
      // Fetch active members count
      const membersResponse = await fetch(`${API_URL}/api/dashboard/active-members`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!membersResponse.ok) {
        throw new Error('Failed to fetch active members count');
      }
      
      const membersData = await membersResponse.json();
      setActiveMembersCount(membersData.activeMembers);
      
      // Fetch cotisations stats
      const cotisationsResponse = await fetch(`${API_URL}/api/dashboard/cotisations-stats`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!cotisationsResponse.ok) {
        throw new Error('Failed to fetch cotisations stats');
      }
      
      const cotisationsData = await cotisationsResponse.json();
      setCotisationsStats(cotisationsData);
      
      // Fetch participation rate
      const participationResponse = await fetch(`${API_URL}/api/dashboard/participation-rate`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!participationResponse.ok) {
        throw new Error('Failed to fetch participation rate');
      }
      
      const participationData = await participationResponse.json();
      setParticipationRate(participationData.participationRate);
      
      // Fetch monthly finances
      const financesResponse = await fetch(`${API_URL}/api/dashboard/monthly-finances`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!financesResponse.ok) {
        throw new Error('Failed to fetch monthly finances');
      }
      
      const financesData = await financesResponse.json();
      // Process the data to make it more usable for charts
      const processedFinancesData = financesData.map((item: any) => ({
        ...item,
        month: formatMonth(item.month),
        netTotal: item.totalRevenues - item.totalExpenses
      }));
      
      setMonthlyFinances(processedFinancesData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(true);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format month (YYYY-MM to Month YYYY)
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate total paid and pending amounts
  const totalAmount = cotisationsStats ? cotisationsStats.totalPaid + cotisationsStats.totalPending : 0;
  const paidPercentage = totalAmount > 0 ? (cotisationsStats?.totalPaid || 0) / totalAmount * 100 : 0;

  // Prepare data for charts - use real data or fallback
  const chartData = monthlyFinances.length > 0 ? monthlyFinances : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenue{user?.role === "admin" ? " Admin" : ""}
            </h2>
            <p className="text-gray-600">Voici un aperçu des statistiques de l'association</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-6 mb-8 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" />
                <p className="text-red-700">Impossible de charger les données du tableau de bord</p>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                Réessayer
              </button>
            </Card>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Membres Actifs
                    </CardTitle>
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users size={20} className="text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeMembersCount !== null ? activeMembersCount : "—"}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Membres avec adhésion active
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Cotisations Payées
                    </CardTitle>
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <Euro size={20} className="text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {cotisationsStats ? formatCurrency(cotisationsStats.totalPaid) : "—"}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">
                        {cotisationsStats ? formatCurrency(cotisationsStats.totalPending) : "—"} en attente
                      </div>
                      <div className="text-xs text-green-500 flex items-center">
                        <ArrowUp size={14} className="mr-1" />
                        {paidPercentage.toFixed(0)}%
                      </div>
                    </div>
                    <Progress className="h-2 mt-2" value={paidPercentage} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Participation Activités
                    </CardTitle>
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar size={20} className="text-orange-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {participationRate !== null ? `${participationRate.toFixed(0)}%` : "—"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Taux de présence aux activités
                    </div>
                    <Progress className="h-2 mt-2" value={participationRate || 0} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Balance Financière
                    </CardTitle>
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <BarChart2 size={20} className="text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {monthlyFinances.length > 0 ? (
                      <>
                        <div className="text-2xl font-bold">
                          {formatCurrency(
                            monthlyFinances.reduce((acc, curr) => acc + (curr.totalRevenues - curr.totalExpenses), 0)
                          )}
                        </div>
                        <div className="flex items-center text-xs mt-1">
                          {monthlyFinances[monthlyFinances.length - 1]?.netTotal >= 0 ? (
                            <ArrowUp size={14} className="text-green-500 mr-1" />
                          ) : (
                            <ArrowDown size={14} className="text-red-500 mr-1" />
                          )}
                          <span className={monthlyFinances[monthlyFinances.length - 1]?.netTotal >= 0 ? 
                            "text-green-500" : "text-red-500"}>
                            Dernière période
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold">—</div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content grid with charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Finances Mensuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <div className="h-80">
                        <ChartContainer
                          config={{
                            revenue: { color: "#22c55e" },
                            expenses: { color: "#ef4444" },
                          }}
                        >
                          <BarChart data={chartData}>
                            <XAxis dataKey="month" />
                            <YAxis 
                              tickFormatter={(value) => `${value} €`} 
                              width={80}
                            />
                            <Tooltip content={(props) => (
                              <ChartTooltipContent
                                formatter={(value, name) => {
                                  return [
                                    `${formatCurrency(Number(value))}`,
                                    name === "totalRevenues" 
                                      ? "Revenus" 
                                      : name === "totalExpenses" 
                                        ? "Dépenses" 
                                        : name
                                  ];
                                }}
                              />
                            )} />
                            <Legend 
                              formatter={(value) => (
                                value === "totalRevenues" 
                                  ? "Revenus" 
                                  : value === "totalExpenses" 
                                    ? "Dépenses" 
                                    : value
                              )}
                            />
                            <Bar 
                              dataKey="totalRevenues" 
                              name="totalRevenues" 
                              fill="var(--color-revenue)" 
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              dataKey="totalExpenses" 
                              name="totalExpenses" 
                              fill="var(--color-expenses)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    ) : (
                      <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-500">Aucune donnée financière disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Net balance trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Balance Nette</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <div className="h-80">
                        <ChartContainer
                          config={{
                            netTotal: { 
                              color: "#3b82f6" 
                            },
                          }}
                        >
                          <LineChart data={chartData}>
                            <XAxis dataKey="month" />
                            <YAxis 
                              tickFormatter={(value) => `${value} €`}
                              width={80}
                            />
                            <Tooltip content={(props) => (
                              <ChartTooltipContent
                                formatter={(value, name) => {
                                  return [
                                    `${formatCurrency(Number(value))}`,
                                    "Balance Nette"
                                  ];
                                }}
                              />
                            )} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="netTotal" 
                              name="Balance Nette" 
                              stroke="var(--color-netTotal)" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </div>
                    ) : (
                      <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
