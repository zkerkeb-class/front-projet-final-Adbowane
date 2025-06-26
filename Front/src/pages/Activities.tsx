import { useState } from "react";
import ActivityForm from "@/components/activities/ActivityForm";
import ActivityList from "@/components/activities/ActivityList";
import ActivityDetails from "@/components/activities/ActivityDetails";
import ActivityChart from "@/components/charts/ActivityChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import InscriptionManager from "@/components/inscriptions/InscriptionManager";
import ActivityParticipants from "@/components/activities/ActivityParticipants";

const Activities = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleFormSuccess = () => {
        setShowForm(false);
    };

    const handleViewDetails = (activity: any) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={sidebarOpen} />
            
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
                <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                
                <main className="p-4 md:p-6 max-w-7xl mx-auto">
                    <Card className="mb-6">
                        <CardContent className="flex justify-between items-center p-6">
                            <h1 className="text-2xl font-bold">Gestion des Activités</h1>
                            {!showForm && !selectedActivity && (
                                <Button onClick={() => setShowForm(true)}>Créer une activité</Button>
                            )}
                        </CardContent>
                    </Card>

                    {!showForm && !selectedActivity && <ActivityChart />}

                    {showForm && (
                        <ActivityForm
                            onSuccess={handleFormSuccess}
                        />
                    )}

                    {!showForm && !selectedActivity && (
                        <ActivityList
                            onViewDetails={handleViewDetails}
                        />
                    )}

                    {selectedActivity && (
                        <ActivityDetails
                            activity={selectedActivity}
                            onClose={handleCloseDetails}
                        />
                    )}

                    {selectedActivity && (
                        <div>
                            <InscriptionManager activityId={selectedActivity.id} activity={selectedActivity} />
                            <div className="mt-8">
                                <ActivityParticipants activityId={selectedActivity.id} />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Activities;