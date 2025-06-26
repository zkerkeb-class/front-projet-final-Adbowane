
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Book, Video, Phone, Mail, HelpCircle } from "lucide-react";
import Layout from "@/components/Layout";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "normal"
  });

  const faqItems = [
    {
      id: "1",
      question: "Comment ajouter un nouveau membre ?",
      answer: "Pour ajouter un nouveau membre, allez dans la section 'Membres' et cliquez sur le bouton 'Ajouter un membre'. Remplissez le formulaire avec les informations requises et validez.",
      category: "Membres"
    },
    {
      id: "2",
      question: "Comment créer une nouvelle activité ?",
      answer: "Rendez-vous dans la section 'Activités', cliquez sur 'Nouvelle activité' et remplissez les détails comme le nom, la date, le lieu et la description.",
      category: "Activités"
    },
    {
      id: "3",
      question: "Comment exporter les données ?",
      answer: "Vous pouvez exporter vos données depuis la section 'Paramètres' en choisissant le format souhaité (CSV ou JSON) et en cliquant sur 'Exporter'.",
      category: "Données"
    },
    {
      id: "4",
      question: "Comment modifier les paramètres de l'association ?",
      answer: "Allez dans 'Paramètres' pour modifier les informations de votre association comme le nom, l'adresse et l'email de contact.",
      category: "Paramètres"
    },
    {
      id: "5",
      question: "Comment gérer les notifications ?",
      answer: "Les notifications s'affichent dans l'en-tête de l'application. Vous pouvez les marquer comme lues en cliquant dessus.",
      category: "Notifications"
    }
  ];

  const resources = [
    {
      title: "Guide de démarrage rapide",
      description: "Apprenez les bases de l'utilisation de votre CRM",
      icon: <Book className="w-6 h-6" />,
      type: "Guide"
    },
    {
      title: "Tutoriels vidéo",
      description: "Regardez nos tutoriels pas à pas",
      icon: <Video className="w-6 h-6" />,
      type: "Vidéo"
    },
    {
      title: "FAQ complète",
      description: "Trouvez des réponses aux questions courantes",
      icon: <HelpCircle className="w-6 h-6" />,
      type: "FAQ"
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    // Logique d'envoi du formulaire
    setContactForm({ subject: "", message: "", priority: "normal" });
  };

  return (
    <Layout>
      <div className="crm-container py-4 sm:py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Centre d'aide</h1>
          <p className="text-gray-600">Trouvez de l'aide et des ressources pour utiliser votre CRM</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {resource.icon}
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <Badge variant="secondary">{resource.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Questions fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher dans la FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{item.question}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQ.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Aucune question trouvée pour votre recherche.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Nous contacter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">support@exe-crm.com</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Objet de votre demande"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Décrivez votre problème ou question..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
