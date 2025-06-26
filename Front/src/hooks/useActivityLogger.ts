
import { useAuth } from '@/contexts/AuthContext';
import { createLog, createNotification } from '@/lib/mongodb-api';
import { useToast } from '@/components/ui/use-toast';
import { useUserObjectId } from '@/lib/user-utils';

export const useActivityLogger = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const { getUserObjectId } = useUserObjectId();

  const logActivity = async (action: string, details: any) => {
    if (!token) return;

    try {
      const userObjectId = await getUserObjectId();
      if (!userObjectId) {
        console.error('Unable to get user ObjectId');
        return;
      }

      console.log('Logging activity:', { action, details, utilisateurId: userObjectId });
      await createLog({
        utilisateurId: userObjectId, // Utiliser l'ObjectId MongoDB
        action,
        details
      }, token);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
      // On n'affiche pas d'erreur à l'utilisateur pour ne pas perturber l'UX
    }
  };

  const logNotification = async (message: string, metadata: any = {}) => {
    if (!token) return;

    try {
      const userObjectId = await getUserObjectId();
      if (!userObjectId) {
        console.error('Unable to get user ObjectId');
        return;
      }

      console.log('Logging notification:', { message, metadata, utilisateurId: userObjectId });
      await createNotification({
        utilisateurId: userObjectId, // Utiliser l'ObjectId MongoDB
        message,
        metadata
      }, token);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la notification:', error);
    }
  };

  return { logActivity, logNotification };
};
