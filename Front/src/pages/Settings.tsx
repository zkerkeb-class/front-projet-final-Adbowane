import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getSettings, updateSettings, exportData, importData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Settings as SettingsIcon, Download, Upload, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({
    nom_association: "",
    email_contact: "",
    adresse: "",
    notifications_email: true,
    notifications_push: true,
    theme_auto: false,
    sauvegarde_auto: true,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getSettings(token);
        if ("error" in data) {
          throw new Error(data.error);
        }
        setSettings({ ...settings, ...data });
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, toast]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateSettings(settings, token);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Succès",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportData(token);
      if ("error" in blob) {
        throw new Error(blob.error);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `export-data.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Les données ont été exportées avec succès.",
      });
    } catch (err) {
      console.error("Error exporting data:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    try {
      const result = await importData(file, token);
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Succès",
        description: "Les données ont été importées avec succès.",
      });
    } catch (err) {
      console.error("Error importing data:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'importer les données.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 md:h-8 w-8" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-2">Configurez votre application</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Données</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_association">Nom de l'association</Label>
                  <Input
                    id="nom_association"
                    value={settings.nom_association}
                    onChange={(e) => setSettings({ ...settings, nom_association: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email_contact">Email de contact</Label>
                  <Input
                    id="email_contact"
                    type="email"
                    value={settings.email_contact}
                    onChange={(e) => setSettings({ ...settings, email_contact: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={settings.adresse}
                    onChange={(e) => setSettings({ ...settings, adresse: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thème automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Adapter le thème selon l'heure de la journée
                    </p>
                  </div>
                  <Switch
                    checked={settings.theme_auto}
                    onCheckedChange={(checked) => setSettings({ ...settings, theme_auto: checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                  {isUpdating ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications_email}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications_email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications dans le navigateur
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications_push}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications_push: checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                  {isUpdating ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement les données
                    </p>
                  </div>
                  <Switch
                    checked={settings.sauvegarde_auto}
                    onCheckedChange={(checked) => setSettings({ ...settings, sauvegarde_auto: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Sécurité du compte</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Activer l'authentification à deux facteurs
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                  {isUpdating ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Exportation des données</Label>
                  <Button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Export en cours..." : "Exporter les données"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="import_file">Importation des données</Label>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="import_file"
                      type="file"
                      accept=".json,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImport(file);
                        }
                      }}
                      disabled={isImporting}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Formats supportés: JSON, CSV
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
