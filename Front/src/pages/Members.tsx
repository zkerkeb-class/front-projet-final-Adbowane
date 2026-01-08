import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MemberList from "@/components/members/MemberList";
import AddMemberForm from "@/components/members/AddMemberForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import MemberInscriptions from "@/components/inscriptions/MemberInscriptions";

const Members = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Membres</h2>
              <p className="text-gray-600">Consultez et gérez vos membres</p>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-crm-primary hover:bg-blue-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {showAddForm ? "Annuler" : "Ajouter un membre"}
            </Button>
          </div>

          {showAddForm && <AddMemberForm onSuccess={() => setShowAddForm(false)} />}
          
          <MemberList />
        </main>
      </div>
    </div>
  );
};

const MemberDetailPage = ({ member }) => {
  return (
    <div>
      {/* ...existing member details... */}
      <div className="mt-8">
        <MemberInscriptions memberId={member.id} />
      </div>
    </div>
  );
};

export default Members;
