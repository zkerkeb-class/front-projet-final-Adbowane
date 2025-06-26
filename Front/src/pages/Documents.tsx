import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Upload, Search, Filter, Eye, Trash2, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Données de démonstration
  const documents = [
    {
      id: 1,
      name: "Statuts de l'association",
      type: "PDF",
      category: "Legal",
      size: "2.3 MB",
      dateCreated: "2024-01-15",
      dateModified: "2024-01-20",
      author: "Admin"
    },
    {
      id: 2,
      name: "Rapport annuel 2023",
      type: "PDF",
      category: "Rapports",
      size: "5.7 MB",
      dateCreated: "2024-02-01",
      dateModified: "2024-02-05",
      author: "Jean Dupont"
    },
    {
      id: 3,
      name: "Budget prévisionnel 2024",
      type: "Excel",
      category: "Finance",
      size: "1.2 MB",
      dateCreated: "2024-01-10",
      dateModified: "2024-03-15",
      author: "Marie Martin"
    },
    {
      id: 4,
      name: "Procès-verbal AG 2024",
      type: "Word",
      category: "Legal",
      size: "890 KB",
      dateCreated: "2024-03-20",
      dateModified: "2024-03-21",
      author: "Pierre Durand"
    },
    {
      id: 5,
      name: "Photos événement printemps",
      type: "ZIP",
      category: "Médias",
      size: "45.2 MB",
      dateCreated: "2024-04-15",
      dateModified: "2024-04-15",
      author: "Sophie Leroy"
    }
  ];

  const categories = ["all", "Legal", "Rapports", "Finance", "Médias", "Formation"];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Legal": "bg-red-100 text-red-800",
      "Rapports": "bg-blue-100 text-blue-800",
      "Finance": "bg-green-100 text-green-800",
      "Médias": "bg-purple-100 text-purple-800",
      "Formation": "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleAddDocument = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de documents sera bientôt disponible.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="crm-container py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Gérez vos documents et fichiers</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={handleAddDocument}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un document
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "Toutes les catégories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                        <span className="text-sm text-gray-500">{doc.type}</span>
                        <span className="text-sm text-gray-500">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-sm text-gray-500">
                      <p>Modifié le {new Date(doc.dateModified).toLocaleDateString("fr-FR")}</p>
                      <p>Par {doc.author}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun document trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Documents;
