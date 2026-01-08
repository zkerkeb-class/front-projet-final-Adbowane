
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserMinus, Users } from "lucide-react";
import { createInscription, deleteInscription, getInscriptions, Member, Activity, Inscription, API_URL } from "@/lib/api";

interface InscriptionManagerProps {
  activityId: number;
  activity: Activity;
  onInscriptionChange?: () => void;
}

const InscriptionManager = ({ activityId, activity, onInscriptionChange }: InscriptionManagerProps) => {
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [activityId, token]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Récupérer tous les membres
      const membersResponse = await fetch(`${API_URL}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (membersResponse.ok) {
        const members = await membersResponse.json();
        setAvailableMembers(members);
      }

      // Récupérer les inscriptions pour cette activité
      const inscriptionsData = await getInscriptions(token, { activite_id: activityId });
      if (!inscriptionsData.error) {
        setInscriptions(inscriptionsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInscription = async () => {
    if (!selectedMemberId) return;

    setLoading(true);
    try {
      const result = await createInscription(
        {
          membre_id: parseInt(selectedMemberId),
          activite_id: activityId,
        },
        token
      );

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Succès",
        description: "Le membre a été inscrit à l'activité.",
      });

      setSelectedMemberId("");
      fetchData();
      onInscriptionChange?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDesinscription = async (inscriptionId: number) => {
    setLoading(true);
    try {
      const result = await deleteInscription(inscriptionId, token);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Succès",
        description: "Le membre a été désinscrit de l'activité.",
      });

      fetchData();
      onInscriptionChange?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la désinscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableMembersForInscription = () => {
    const inscribedMemberIds = inscriptions.map(i => i.membre_id);
    return availableMembers.filter(member => !inscribedMemberIds.includes(member.id));
  };

  const isCapacityFull = inscriptions.length >= activity.capacite_max;

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Inscriptions
          <Badge variant="outline">
            {inscriptions.length}/{activity.capacite_max}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire d'inscription */}
        {!isCapacityFull && (
          <div className="flex gap-2">
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMembersForInscription().map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.prenom} {member.nom} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleInscription}
              disabled={!selectedMemberId || loading}
              className="px-4"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Inscrire
            </Button>
          </div>
        )}

        {isCapacityFull && (
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-amber-700">Capacité maximale atteinte</p>
          </div>
        )}

        {/* Liste des inscrits */}
        <div className="space-y-2">
          <h4 className="font-medium">Membres inscrits :</h4>
          {inscriptions.length === 0 ? (
            <p className="text-gray-500">Aucun membre inscrit</p>
          ) : (
            <div className="space-y-2">
              {inscriptions.map((inscription) => {
                const member = availableMembers.find(m => m.id === inscription.membre_id);
                return (
                  <div key={inscription.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">
                        {member?.prenom} {member?.nom}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        Inscrit le {new Date(inscription.date_inscription).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDesinscription(inscription.id)}
                      disabled={loading}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Désinscrire
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InscriptionManager;
