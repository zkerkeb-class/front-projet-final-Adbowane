
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MemberDetails from "@/components/members/MemberDetails";
import { Member, API_URL } from "@/lib/api";
import { FileText, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log("Fetching members with token:", token);
        
        // Récupérer les membres depuis l'API
        const response = await fetch(`${API_URL}/api/members`, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Ajouter cache: 'no-store' pour éviter les redirections ngrok
          cache: 'no-store'
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
          let errorMsg;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || `Erreur: ${response.status}`;
          } catch (e) {
            errorMsg = `Erreur: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMsg);
        }

        // Vérification du type de contenu
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Si on a reçu du HTML au lieu du JSON, c'est probablement à cause de ngrok
          console.error("Contenu non-JSON reçu:", contentType);
          throw new Error("Le serveur a retourné un contenu non-JSON (problème de redirection ngrok)");
        }

        // Conversion en texte pour debug
        const text = await response.text();
        console.log("Response text:", text);
        
        // Vérification si le texte est un JSON valide
        try {
          // Convertir le texte en JSON
          const data = JSON.parse(text);
          console.log("Members data parsed:", data);
          
          // Vérifier si c'est un tableau
          if (Array.isArray(data)) {
            setMembers(data);
            setError(null);
          } else {
            console.error("La réponse n'est pas un tableau:", data);
            throw new Error("Format de données inattendu, tableau attendu");
          }
        } catch (jsonError) {
          console.error("Erreur de parsing JSON:", jsonError);
          throw new Error("Impossible de parser la réponse JSON");
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        setError(error instanceof Error ? error.message : "Erreur inconnue");
        toast({
          title: "Erreur de connexion à l'API",
          description: "Impossible de charger la liste des membres. Vérifiez que l'URL ngrok est toujours valide.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token, toast]);

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "suspendu":
        return <Badge className="bg-amber-500">Suspendu</Badge>;
      case "expiré":
        return <Badge className="bg-red-500">Expiré</Badge>;
      default:
        return <Badge className="bg-gray-500">Inconnu</Badge>;
    }
  };

  const closeDetails = () => {
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <AlertTriangle size={48} className="text-amber-500 mb-3" />
            <h3 className="text-xl font-medium">Erreur de connexion</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mx-2"
              >
                Réessayer
              </Button>
              <Button
                onClick={() => {
                  // Tentative avec des données de test pour contourner l'erreur ngrok
                  setMembers([
                    {
                      id: 1,
                      utilisateur_id: 6,
                      date_adhesion: "2025-04-06T22:00:00.000Z",
                      statut_adhesion: "actif",
                      document_adhesion: null,
                      nom: "Exemple",
                      prenom: "Utilisateur",
                      email: "exemple@domain.com",
                      telephone: "0123456789",
                      role: "membre"
                    }
                  ]);
                  setError(null);
                  toast({
                    title: "Mode démo activé",
                    description: "Affichage d'un exemple pour contourner l'erreur d'API",
                    variant: "default",
                  });
                }}
                variant="default"
                className="mx-2"
              >
                Mode démo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <Users size={48} className="text-gray-400 mb-3" />
            <h3 className="text-xl font-medium">Aucun membre trouvé</h3>
            <p className="text-gray-500">Commencez par ajouter de nouveaux membres</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {selectedMember ? (
        <MemberDetails member={selectedMember} onClose={closeDetails} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d'adhésion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.nom}</TableCell>
                    <TableCell>{member.prenom}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {new Date(member.date_adhesion).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{getStatusBadge(member.statut_adhesion)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(member)}
                      >
                        <FileText size={16} className="mr-2" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MemberList;
