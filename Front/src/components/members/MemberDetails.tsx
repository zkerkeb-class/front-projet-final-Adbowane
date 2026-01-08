
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { Member, updateMemberStatus, uploadDocument, getAdhesionHistory } from "@/lib/api";
import { ArrowLeft, Upload, History, User } from "lucide-react";

interface MemberDetailsProps {
  member: Member;
  onClose: () => void;
}

const MemberDetails = ({ member, onClose }: MemberDetailsProps) => {
  const [status, setStatus] = useState(member.statut_adhesion);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentBase64, setDocumentBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [history, setHistory] = useState<Member[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchAdhesionHistory = async () => {
    if (!token) return;
    
    setIsLoadingHistory(true);
    try {
      const result = await getAdhesionHistory(member.utilisateur_id.toString(), token);
      
      if ('error' in result) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setHistory(result);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique d'adhésion",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Chargement initial de l'historique d'adhésion
    fetchAdhesionHistory();
  }, [member.utilisateur_id, token]);

  const handleStatusChange = async (newStatus: string) => {
    if (!token) return;
    
    setIsUpdating(true);
    try {
      const result = await updateMemberStatus(
        member.id.toString(), 
        { statut_adhesion: newStatus as "actif" | "suspendu" | "expiré" }, 
        token
      );
      
      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setStatus(newStatus as "actif" | "suspendu" | "expiré");
        toast({
          title: "Succès",
          description: "Le statut a été mis à jour",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      
      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setDocumentBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentBase64 || !token) return;
    
    setIsUploading(true);
    try {
      const result = await uploadDocument(
        member.id.toString(),
        { document_adhesion: documentBase64 },
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
          description: "Le document a été téléchargé avec succès",
        });
        setDocumentFile(null);
        setDocumentBase64(null);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
              <ArrowLeft size={16} />
            </Button>
            <CardTitle>Détails du Membre</CardTitle>
          </div>
          {getStatusBadge(status)}
        </div>
        <CardDescription>
          ID: {member.id} • Adhésion: {new Date(member.date_adhesion).toLocaleDateString("fr-FR")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">
              <User size={16} className="mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Upload size={16} className="mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="history">
              <History size={16} className="mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" value={member.nom} readOnly />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" value={member.prenom} readOnly />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={member.email} readOnly />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" value={member.telephone} readOnly />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={status} 
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="expiré">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Document d'adhésion actuel</h4>
                {member.document_adhesion ? (
                  <div className="flex items-center justify-between">
                    <span>Document disponible</span>
                    <Button size="sm" variant="outline">
                      Visualiser
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun document disponible</p>
                )}
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Télécharger un nouveau document</h4>
                <div className="space-y-3">
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange} 
                  />
                  {documentFile && (
                    <p className="text-sm text-gray-600">
                      Fichier sélectionné: {documentFile.name}
                    </p>
                  )}
                  <Button 
                    onClick={handleDocumentUpload} 
                    disabled={!documentFile || isUploading}
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploading ? "Téléchargement..." : "Télécharger le document"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-40">
                <p>Chargement de l'historique...</p>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div key={index} className="border-l-4 border-crm-primary pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Adhésion du {new Date(entry.date_adhesion).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Statut: {getStatusBadge(entry.statut_adhesion)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">Aucun historique disponible</h3>
                <p className="text-gray-500">L'historique d'adhésion sera affiché ici</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Retour à la liste
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberDetails;
