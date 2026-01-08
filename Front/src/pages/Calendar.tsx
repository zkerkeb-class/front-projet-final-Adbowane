
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity } from '@/lib/api';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EventFormDialog from '@/components/calendar/EventFormDialog';
import CalendarView from '@/components/calendar/CalendarView';
import EventList from '@/components/calendar/EventList';
import { Filter } from 'lucide-react';
import ActivityList from '@/components/activities/ActivityList'
;
const CalendarPage = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Fetch activities to display on the calendar
  const { data: activities, isLoading, error, refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3003/api/activities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      return await response.json();
    }
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setIsEventDialogOpen(true);
  };

  const handleEventAdded = () => {
    refetch();
    toast({
      title: "Événement créé",
      description: "L'événement a été ajouté avec succès au calendrier.",
    });
    setIsEventDialogOpen(false);
  };

  const getDateRange = () => {
    if (!selectedDate) return '';
    
    switch (view) {
      case 'day':
        return format(selectedDate, 'dd MMMM yyyy', { locale: fr });
      case 'week':
        const weekStart = selectedDate;
        const weekEnd = addDays(selectedDate, 6);
        return `${format(weekStart, 'dd')} - ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy', { locale: fr });
      default:
        return '';
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendrier</h1>
            <p className="text-muted-foreground">{getDateRange()}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Tabs defaultValue={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="day">Jour</TabsTrigger>
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="reunion">Réunions</SelectItem>
                  <SelectItem value="formation">Formations</SelectItem>
                  <SelectItem value="loisir">Loisirs</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleCreateEvent}>
                Nouvel événement
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 hidden lg:block">
            <CardHeader>
              <CardTitle>Mini Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
              <div className="mt-4">
                <h3 className="font-medium mb-2">Légende</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Réunions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Formations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Loisirs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <CalendarView 
                  view={view} 
                  selectedDate={selectedDate} 
                  activities={activities || []} 
                  filter={filter}
                  onEventClick={(activity) => {
                    toast({
                      title: activity.titre,
                      description: activity.description,
                    });
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Chargement des événements...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 p-4 rounded-md text-red-700">
                    <p>Une erreur est survenue lors du chargement des événements.</p>
                  </div>
                ) : (
                  <>
                    <EventList 
                      activities={activities || []} 
                      filter={filter} 
                      onRefetch={refetch}
                    />
                    <ActivityList 
                      onViewDetails={(activity) => {
                        toast({
                          title: activity.titre,
                          description: activity.description,
                        });
                      }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <EventFormDialog 
        isOpen={isEventDialogOpen} 
        onOpenChange={setIsEventDialogOpen}
        onEventAdded={handleEventAdded}
        selectedDate={selectedDate}
      />
    </Layout>
  );
};

export default CalendarPage;
