
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";

const Messages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <MessageSquare size={80} className="text-primary opacity-50" />
                  <Clock size={30} className="absolute -top-2 -right-2 text-orange-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Messages</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Fonctionnalité à venir
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  La messagerie est en cours de développement. Vous pourrez bientôt :
                </p>
                <ul className="mt-3 text-left text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Envoyer et recevoir des messages</li>
                  <li>• Créer des discussions de groupe</li>
                  <li>• Partager des fichiers et documents</li>
                  <li>• Recevoir des notifications en temps réel</li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cette page sera disponible dans une prochaine mise à jour.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Messages;
