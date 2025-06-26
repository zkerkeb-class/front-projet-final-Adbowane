import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Log, getLogs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const LogViewer = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs(token);
        if ("error" in data) {
          throw new Error(data.error);
        }
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les logs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    // Rafraîchir les logs toutes les 30 secondes
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [token, toast]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs système</CardTitle>
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
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {log.utilisateur ? `${log.utilisateur.prenom} ${log.utilisateur.nom}` : "Système"}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  {typeof log.details === "object" && log.details !== null
                    ? JSON.stringify(log.details)
                    : log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LogViewer;