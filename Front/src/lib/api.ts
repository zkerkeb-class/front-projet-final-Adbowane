export const API_URL = "http://localhost:3003";

export interface Activity {
    id: number;
    titre: string;
    description: string;
    date_debut: string;
    date_fin: string;
    lieu: string;
    capacite_max: number;
    type_activite: string | null;
    actif: number;
}

export interface Member {
  id: number;
  utilisateur_id: number;
  date_adhesion: string;
  statut_adhesion: "actif" | "suspendu" | "expiré";
  document_adhesion: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
}

export interface Inscription {
  id: number;
  membre_id: number;
  activite_id: number;
  date_inscription: string;
  presence: boolean;
  membre?: {
    nom: string;
    prenom: string;
    email: string;
  };
  activite?: {
    titre: string;
    date_debut: string;
    lieu: string;
  };
}

export interface InscriptionData {
  membre_id: number;
  activite_id: number;
}

export interface Log {
  _id: string;
  action: string;
  details: any;
  createdAt: string;
  utilisateur?: {
    nom: string;
    prenom: string;
  };
}

export interface LoginData {
  email: string;
  mot_de_passe: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone: string;
  role: string;
}

export interface ActivityData {
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  lieu: string;
  capacite_max: number;
}

export interface MemberData {
  utilisateur_id: number;
  date_adhesion: string;
  statut_adhesion: "actif" | "suspendu" | "expiré";
  document_adhesion?: string;
}

export interface MemberStatusUpdate {
  statut_adhesion: "actif" | "suspendu" | "expiré";
}

export interface DocumentUpload {
  document_adhesion: string;
}

export interface SettingsData {
  theme: string;
  notifications: boolean;
  language: string;
}

export interface Cotisation {
  id: number;
  membre_id: number;
  montant: string;
  date_paiement: string;
  methode_paiement: string;
  statut_paiement: string;
  commentaire: string;
  nom: string;
  prenom: string;
}

// Auth functions
export const loginUser = async (data: LoginData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur de connexion" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur d'inscription" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

// Inscription functions
export const createInscription = async (data: InscriptionData, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/inscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de l'inscription" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const getInscriptions = async (token: string, filters?: { activite_id?: number; membre_id?: number }) => {
  try {
    let url = `${API_URL}/api/inscriptions`;
    const params = new URLSearchParams();
    
    if (filters?.activite_id) {
      params.append('activite_id', filters.activite_id.toString());
    }
    if (filters?.membre_id) {
      params.append('membre_id', filters.membre_id.toString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la récupération des inscriptions" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const getInscriptionById = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/inscriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la récupération de l'inscription" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const updateInscriptionPresence = async (id: number, presence: boolean, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/inscriptions/${id}/presence`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ presence }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la mise à jour de la présence" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const deleteInscription = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/inscriptions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la suppression de l'inscription" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

// Activity functions
export const createActivity = async (data: ActivityData, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la création de l'activité" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const getRegisteredMembers = async (activityId: number, token: string) => {
  try {
    console.log(`API call: fetching members for activity ${activityId}`);
    const response = await fetch(`${API_URL}/api/activities/${activityId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      return { error: `Erreur ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();
    console.log('Members data received from API:', data);
    return data;
  } catch (error) {
    console.error('Network error:', error);
    return { error: 'Erreur de connexion au serveur' };
  }
};

// Member functions
export const addMember = async (data: MemberData, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de l'ajout du membre" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const updateMemberStatus = async (memberId: string, data: MemberStatusUpdate, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/members/${memberId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la mise à jour du statut" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const uploadDocument = async (memberId: string, data: DocumentUpload, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/members/${memberId}/document`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors du téléchargement du document" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const getAdhesionHistory = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/members/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la récupération de l'historique" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

// Log functions
export const getLogs = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la récupération des logs" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

// Settings functions
export const getSettings = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la récupération des paramètres" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const updateSettings = async (data: SettingsData, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de la mise à jour des paramètres" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const exportData = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de l'export des données" };
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const importData = async (file: File, token: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erreur lors de l'import des données" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: "Erreur de connexion au serveur" };
  }
};

export const getCotisations = async (token?: string) => {
  const headers: HeadersInit = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/cotisations`, { headers });
  if (!res.ok) return { error: "Erreur lors du chargement des cotisations" };
  return await res.json();
};

export const getCotisation = async (id: number, token?: string) => {
  const headers: HeadersInit = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/cotisations/${id}`, { headers });
  if (!res.ok) return { error: "Erreur lors du chargement de la cotisation" };
  return await res.json();
};

export const createCotisation = async (data: Partial<Cotisation>, token?: string) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/cotisations`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) return { error: "Erreur lors de la création de la cotisation" };
  return await res.json();
};

export const updateCotisation = async (id: number, data: Partial<Cotisation>, token?: string) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/cotisations/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) return { error: "Erreur lors de la modification de la cotisation" };
  return await res.json();
};

export const deleteCotisation = async (id: number, token?: string) => {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/cotisations/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) return { error: "Erreur lors de la suppression de la cotisation" };
  return { success: true };
};
