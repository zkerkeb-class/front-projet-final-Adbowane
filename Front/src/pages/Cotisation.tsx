import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CotisationList from "@/components/cotisations/CotisationList";
import CotisationDetail from "@/components/cotisations/CotisationDetail";
import CotisationForm from "@/components/cotisations/CotisationForm";
import CotisationStats from "@/components/cotisations/CotisationStats";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type View = "list" | "detail" | "edit" | "create";

const CotisationPage = () => {
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [members, setMembers] = useState<{ id: number; nom: string; prenom: string }[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await fetch(`${API_URL}/api/members`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data.map((m: any) => ({
            id: m.id,
            nom: m.nom,
            prenom: m.prenom,
          })));
        } else {
          setMembers([]);
        }
      } catch {
        setMembers([]);
      }
      setLoadingMembers(false);
    };
    fetchMembers();
  }, [token]);

  // Gestion navigation
  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setView("detail");
  };
  const handleEdit = (id: number) => {
    setSelectedId(id);
    setView("edit");
  };
  const handleBackToList = () => {
    setSelectedId(null);
    setView("list");
  };
  const handleCreate = () => {
    setSelectedId(null);
    setView("create");
  };
  const handleSuccess = () => {
    setView("list");
    setSelectedId(null);
  };

  return (
    <Layout>
      <div className="crm-container py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cotisations</h1>
            <p className="text-gray-600 mt-1">Gestion des cotisations des membres</p>
          </div>
          {view === "list" && (
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              Nouvelle cotisation
            </Button>
          )}
        </div>
        <CotisationStats />
        <div className="mt-4">
          {view === "list" && (
            <CotisationList
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
            />
          )}
          {view === "detail" && selectedId !== null && (
            <CotisationDetail
              cotisationId={selectedId}
              onEdit={handleEdit}
              onBack={handleBackToList}
            />
          )}
          {(view === "edit" || view === "create") && (
            loadingMembers ? (
              <Card>
                <CardContent>
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-full mb-2" />
                </CardContent>
              </Card>
            ) : (
              <CotisationForm
                cotisationId={view === "edit" ? selectedId ?? undefined : undefined}
                members={members}
                onSuccess={handleSuccess}
                onCancel={handleBackToList}
              />
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CotisationPage;
