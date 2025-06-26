
import React from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, getDay, getDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity } from '@/lib/api';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  selectedDate?: Date;
  activities: Activity[];
  filter: string;
  onEventClick: (activity: Activity) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  view, 
  selectedDate = new Date(), 
  activities, 
  filter,
  onEventClick
}) => {
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type_activite === filter;
  });

  const getEventColor = (activityType?: string) => {
    switch(activityType) {
      case 'reunion': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'formation': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'loisir': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const renderDayView = () => {
    const dayEvents = filteredActivities.filter(activity => 
      isSameDay(parseISO(activity.date_debut), selectedDate)
    );

    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="min-h-[600px] fade-in-scale">
        <div className="text-center font-medium mb-4 text-lg">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
        <div className="grid grid-cols-[80px_1fr] h-full border rounded-lg shadow-lg overflow-hidden bg-white">
          <div className="border-r bg-gray-50">
            {hoursOfDay.map(hour => (
              <div key={hour} className="h-20 border-b border-gray-200 px-3 py-2 text-sm text-right text-gray-600 font-medium">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>
          <div className="relative bg-white calendar-grid-hour">
            {hoursOfDay.map(hour => (
              <div key={hour} className="h-20 border-b border-gray-100"></div>
            ))}
            
            {dayEvents.map((activity, idx) => {
              const startTime = parseISO(activity.date_debut);
              const endTime = parseISO(activity.date_fin);
              const startHour = startTime.getHours() + (startTime.getMinutes() / 60);
              const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
              
              return (
                <div 
                  key={idx}
                  onClick={() => onEventClick(activity)}
                  className={cn(
                    "absolute left-2 right-2 px-3 py-2 rounded-lg text-white text-sm cursor-pointer calendar-day-event shadow-md",
                    getEventColor(activity.type_activite)
                  )}
                  style={{
                    top: `${startHour * 20}px`,
                    height: `${Math.max(duration * 20, 40)}px`,
                  }}
                >
                  <div className="font-semibold truncate">{activity.titre}</div>
                  <div className="text-xs opacity-90 truncate">
                    {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className="min-h-[600px] fade-in-scale">
        <div className="grid grid-cols-7 text-center font-semibold border-b-2 border-gray-200 pb-3 mb-2 bg-gradient-to-r from-blue-50 to-purple-50">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="px-2 py-3">
              <div className="text-gray-700">{format(day, 'EEEE', { locale: fr })}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">
                {format(day, 'd MMM', { locale: fr })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 h-full mt-4">
          {daysOfWeek.map((day, dayIdx) => {
            const dayEvents = filteredActivities.filter(activity => 
              isSameDay(parseISO(activity.date_debut), day)
            );
            
            return (
              <div key={dayIdx} className="border border-gray-200 rounded-lg p-2 min-h-[500px] bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  {dayEvents.map((activity, eventIdx) => (
                    <div 
                      key={eventIdx}
                      onClick={() => onEventClick(activity)}
                      className={cn(
                        "p-2 rounded-md text-white text-xs cursor-pointer calendar-day-event shadow-sm",
                        getEventColor(activity.type_activite)
                      )}
                    >
                      <div className="font-semibold truncate">{activity.titre}</div>
                      <div className="text-xs opacity-90 truncate">
                        {format(parseISO(activity.date_debut), 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    
    const daysToDisplay = [];
    let day = startDate;
    
    for (let i = 0; i < 42; i++) {
      daysToDisplay.push(day);
      day = addDays(day, 1);
    }
    
    return (
      <div className="min-h-[600px] fade-in-scale">
        <div className="grid grid-cols-7 text-center font-semibold border-b-2 border-gray-200 pb-3 mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(weekday => (
            <div key={weekday} className="py-3 text-gray-700">{weekday}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {daysToDisplay.slice(0, 35).map((day, idx) => {
            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
            const isToday = isSameDay(day, new Date());
            
            const dayEvents = filteredActivities.filter(activity => 
              isSameDay(parseISO(activity.date_debut), day)
            );
            
            return (
              <div 
                key={idx} 
                className={cn(
                  "min-h-[120px] border rounded-lg p-2 transition-all duration-200 hover:shadow-md",
                  !isCurrentMonth && "bg-gray-50 opacity-60",
                  isCurrentMonth && "bg-white shadow-sm",
                  isToday && "ring-2 ring-blue-500 bg-blue-50"
                )}
              >
                <div className={cn(
                  "text-right text-sm font-semibold mb-2",
                  isToday ? "text-blue-600" : "text-gray-700",
                  !isCurrentMonth && "text-gray-400"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((activity, eventIdx) => (
                    <div 
                      key={eventIdx}
                      onClick={() => onEventClick(activity)}
                      className={cn(
                        "px-2 py-1 rounded-md text-white text-xs cursor-pointer calendar-day-event shadow-sm",
                        getEventColor(activity.type_activite)
                      )}
                    >
                      <div className="truncate font-medium">{activity.titre}</div>
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
};

export default CalendarView;
