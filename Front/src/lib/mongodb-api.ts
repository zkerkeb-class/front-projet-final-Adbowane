
export const API_URL = "http://localhost:3003";

// Interfaces pour MongoDB selon votre structure backend
export interface LogEntry {
  _id?: string;
  utilisateurId: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
  } | string; // MongoDB ObjectId string ou objet populé
  action: string;
  details: any;
  createdAt?: string; // Timestamp automatique de MongoDB
  updatedAt?: string; // Timestamp automatique de MongoDB
}

export interface Notification {
  _id?: string;
  utilisateurId: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
  } | string; // MongoDB ObjectId string ou objet populé
  message: string;
  metadata: any;
  lu?: boolean;
  createdAt?: string; // Timestamp automatique de MongoDB
  updatedAt?: string; // Timestamp automatique de MongoDB
}

// Créer un log d'activité
export const createLog = async (logData: { utilisateurId: string; action: string; details: any }, token: string): Promise<{ message: string; error?: string }> => {
  try {
    console.log('Sending log data:', logData);
    const response = await fetch(`${API_URL}/api/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(logData),
    });

    console.log('Log response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Log error response text:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    console.log('Log created successfully:', data);
    return data;
  } catch (error) {
    console.error("Create log error:", error);
    return { 
      message: "Échec", 
      error: error instanceof Error ? error.message : "Erreur lors de la création du log" 
    };
  }
};

// Créer une notification
export const createNotification = async (notificationData: { utilisateurId: string; message: string; metadata: any }, token: string): Promise<{ message: string; error?: string }> => {
  try {
    console.log('Sending notification data:', notificationData);
    const response = await fetch(`${API_URL}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(notificationData),
    });

    console.log('Notification response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Notification error response text:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    console.log('Notification created successfully:', data);
    return data;
  } catch (error) {
    console.error("Create notification error:", error);
    return { 
      message: "Échec", 
      error: error instanceof Error ? error.message : "Erreur lors de la création de la notification" 
    };
  }
};

// Récupérer les logs
export const getLogs = async (token: string): Promise<LogEntry[] | { error: string }> => {
  try {
    console.log('Fetching logs from:', `${API_URL}/api/logs`);
    const response = await fetch(`${API_URL}/api/logs`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('Get logs response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Get logs error response:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Response is not JSON:', text);
      throw new Error('La réponse du serveur n\'est pas du JSON valide');
    }
    
    const data = await response.json();
    console.log('Logs data received:', data);
    return data;
  } catch (error) {
    console.error("Get logs error:", error);
    return { 
      error: error instanceof Error ? error.message : "Erreur lors de la récupération des logs" 
    };
  }
};

// Récupérer les notifications
export const getNotifications = async (token: string): Promise<Notification[] | { error: string }> => {
  try {
    console.log('Fetching notifications from:', `${API_URL}/api/notifications`);
    const response = await fetch(`${API_URL}/api/notifications`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('Get notifications response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Get notifications error response:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Response is not JSON:', text);
      throw new Error('La réponse du serveur n\'est pas du JSON valide');
    }
    
    const data = await response.json();
    console.log('Notifications data received:', data);
    return data;
  } catch (error) {
    console.error("Get notifications error:", error);
    return { 
      error: error instanceof Error ? error.message : "Erreur lors de la récupération des notifications" 
    };
  }
};
