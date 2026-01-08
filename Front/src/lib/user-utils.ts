
import { useAuth } from '@/contexts/AuthContext';

// Utilitaire pour obtenir l'ObjectId MongoDB de l'utilisateur
export const useUserObjectId = () => {
  const { user, token } = useAuth();

  // Fonction pour obtenir l'ObjectId MongoDB basé sur l'ID numérique
  const getUserObjectId = async (): Promise<string | null> => {
    if (!user || !token) return null;

    try {
      console.log(`Fetching ObjectId for numeric user ID: ${user.id}`);
      // Appel API pour obtenir l'ObjectId MongoDB basé sur l'ID numérique
      const response = await fetch(`http://localhost:3003/api/users/${user.id}/objectid`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User ObjectId received:', data.objectId);
        return data.objectId;
      } else {
        const errorText = await response.text();
        console.error('Failed to get user ObjectId:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error getting user ObjectId:', error);
    }

    // Fallback: utiliser l'ID numérique comme string pour l'instant
    console.log('Using numeric ID as fallback:', user.id.toString());
    return user.id.toString();
  };

  return { getUserObjectId, numericUserId: user?.id };
};
