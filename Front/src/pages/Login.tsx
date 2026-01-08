import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { loginUser, LoginData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "@/styles/login-animations.css";

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    mot_de_passe: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

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

    try {
      const response = await loginUser(formData);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: response.error,
        });
      } else if (response.token) {
        login(response.token);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E2A44] to-[#2A3D5E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="/logo-exe-crm-sport.png"
            alt="Exe CRM Sport Logo"
            className="mx-auto mb-4 w-28 h-28 rounded-lg shadow-lg"
            draggable={false}
          />
          <h1 className="text-4xl font-bold text-white drop-shadow-md">Exe CRM Connect</h1>
          <p className="text-gray-300 mt-2">Connectez-vous à votre espace sportif</p>
        </div>
        
        <Card className="crm-card border-t-4 border-t-[#00C4B4] bg-gray-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="relative">
                  <Input
                    id="mot_de_passe"
                    name="mot_de_passe"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    required
                    className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#00C4B4] focus:ring-[#00C4B4] pr-12 animate-slide-up"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#00C4B4] transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 mt-6 bg-[#00C4B4] text-white hover:bg-[#00A89C] transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn size={20} />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-400">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-[#00C4B4] font-medium hover:underline transition-colors duration-200">
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;