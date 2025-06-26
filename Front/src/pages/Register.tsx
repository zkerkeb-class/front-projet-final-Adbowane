import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import "@/styles/login-animations.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
    nom: "",
    prenom: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Fonctionnalité à venir",
        description: "L'inscription sera bientôt disponible.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E2A44] to-[#2A3D5E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="/logo-exe-crm-sport.png"
            alt="Exe CRM Sport Logo"
            className="mx-auto mb-4 w-28 h-28 rounded-lg shadow-lg login-logo-animated"
            draggable={false}
          />
          <h1 className="text-4xl font-bold text-white drop-shadow-md">Exe CRM Connect</h1>
          <p className="text-gray-300 mt-2">Créer un compte pour votre espace sportif</p>
        </div>
        <Card className="crm-card border-t-4 border-t-[#00C4B4] bg-gray-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">Créer un compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="nom" className="text-gray-200">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C4B4] focus:ring-[#00C4B4] animate-slide-up"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="prenom" className="text-gray-200">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C4B4] focus:ring-[#00C4B4] animate-slide-up"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C4B4] focus:ring-[#00C4B4] animate-slide-up"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="mot_de_passe" className="text-gray-200">Mot de passe</Label>
                <Input
                  id="mot_de_passe"
                  name="mot_de_passe"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C4B4] focus:ring-[#00C4B4] animate-slide-up"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 mt-6 bg-[#00C4B4] text-white hover:bg-[#00A89C] transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création...
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-400">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-[#00C4B4] font-medium hover:underline transition-colors duration-200">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
                 
