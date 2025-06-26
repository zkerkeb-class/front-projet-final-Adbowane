
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLogs, getNotifications, LogEntry, Notification } from '@/lib/mongodb-api';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminLogs = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        console.log('Starting to fetch MongoDB data...');
        
        // Récupérer les logs
        const logsResult = await getLogs(token);
        if ('error' in logsResult) {
          console.error('Logs error:', logsResult.error);
          toast({
            title: "Erreur",
            description: `Logs: ${logsResult.error}`,
            variant: "destructive",
          });
        } else {
          console.log('Logs loaded successfully:', logsResult.length, 'entries');
          setLogs(logsResult);
        }

        // Récupérer les notifications
        const notificationsResult = await getNotifications(token);
        if ('error' in notificationsResult) {
          console.error('Notifications error:', notificationsResult.error);
          toast({
            title: "Erreur",
            description: `Notifications: ${notificationsResult.error}`,
            variant: "destructive",
          });
        } else {
          console.log('Notifications loaded successfully:', notificationsResult.length, 'entries');
          setNotifications(notificationsResult);
        }
      } catch (error) {
        console.error('Fetch data error:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données MongoDB",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getActionBadge = (action: string) => {
    const colors = {
      'connexion': 'bg-green-500',
      'CREATE': 'bg-green-500',
      'UPDATE': 'bg-blue-500',
      'DELETE': 'bg-red-500',
      'LOGIN': 'bg-purple-500',
      'LOGOUT': 'bg-gray-500',
    };
    
    return (
      <Badge className={colors[action as keyof typeof colors] || 'bg-gray-500'}>
        {action}
      </Badge>
    );
  };

  const formatDetails = (details: any) => {
    if (typeof details === 'object') {
      return JSON.stringify(details, null, 2);
    }
    return details;
  };

  const getUserDisplay = (utilisateur: LogEntry['utilisateurId'] | Notification['utilisateurId']) => {
    if (typeof utilisateur === 'object' && utilisateur !== null) {
      return `${utilisateur.prenom} ${utilisateur.nom} (${utilisateur.role})`;
    }
    return `ID: ${utilisateur}`;
  };

  const getUserId = (utilisateur: LogEntry['utilisateurId'] | Notification['utilisateurId']) => {
    if (typeof utilisateur === 'object' && utilisateur !== null) {
      return utilisateur._id;
    }
    return utilisateur.toString();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="text-center">Chargement des données MongoDB...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Administration MongoDB</h1>
          <p className="text-gray-600">Gestion des logs d'activité et notifications</p>
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs">
              Logs d'activité ({logs.length})
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications ({notifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs d'activité</CardTitle>
                <CardDescription>
                  Historique des actions utilisateurs dans le système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log, index) => (
                      <TableRow key={log._id || `log-${index}`}>
                        <TableCell>
                          {log.createdAt && formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{getUserDisplay(log.utilisateurId)}</div>
                            <div className="text-xs text-gray-500">ID: {getUserId(log.utilisateurId)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getActionBadge(log.action)}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                            {formatDetails(log.details)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {logs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun log d'activité trouvé
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Historique des notifications envoyées aux utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Métadonnées</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <TableRow key={notification._id || `notification-${index}`}>
                        <TableCell>
                          {notification.createdAt && formatDate(notification.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{getUserDisplay(notification.utilisateurId)}</div>
                            <div className="text-xs text-gray-500">ID: {getUserId(notification.utilisateurId)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-sm">
                          {notification.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant={notification.lu ? "secondary" : "default"}>
                            {notification.lu ? 'Lu' : 'Non lu'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                            {formatDetails(notification.metadata)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune notification trouvée
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminLogs;
