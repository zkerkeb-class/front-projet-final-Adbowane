
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-crm-primary">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page non trouvée</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Link to="/">
          <Button className="mt-8 gap-2">
            <Home size={18} />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
