'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export function StudentScheduleView({ classId, studentName = 'Student' }) {
  const [schedules, setSchedules] = useState([]);
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('monday');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/schedules?classId=${classId}&published=true`);
        if (response.ok) {
          const data = await response.json();
          setSchedules(data);
          if (data.length > 0) {
            setActiveSchedule(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchSchedules();
    } else {
      setLoading(false);
    }
  }, [classId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading schedule...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No schedule available for your class yet. Please check back later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const schedule = activeSchedule;

  const getSlotsForDay = (day) => {
    const daySlots = schedule.slots.filter(slot => slot.day === day);
    return [...daySlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Schedule
              </CardTitle>
              <CardDescription>View your class schedule</CardDescription>
            </div>
            {schedules.length > 1 && (
              <div className="flex gap-2">
                {schedules.map((sched) => (
                  <Badge
                    key={sched.id}
                    variant={activeSchedule?.id === sched.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setActiveSchedule(sched)}
                  >
                    {sched.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {schedule.description && (
            <p className="text-sm text-muted-foreground mb-4">{schedule.description}</p>
          )}

          {/* Day Tabs */}
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
              {DAYS.map(day => (
                <TabsTrigger key={day} value={day} className="text-xs md:text-sm">
                  {DAY_LABELS[day].slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {DAYS.map(day => (
              <TabsContent key={day} value={day} className="space-y-4">
                {getSlotsForDay(day).length > 0 ? (
                  <div className="space-y-3">
                    {getSlotsForDay(day).map((slot, index) => (
                      <ScheduleSlotCard key={index} slot={slot} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No classes scheduled for {DAY_LABELS[day]}</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Week Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Week Overview</CardTitle>
          <CardDescription>All classes for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.map(day => {
              const slotCount = schedule.slots.filter(s => s.day === day).length;
              return (
                <Card key={day} className="p-4">
                  <h4 className="font-semibold capitalize mb-2">{DAY_LABELS[day]}</h4>
                  <p className="text-sm text-muted-foreground">
                    {slotCount} {slotCount === 1 ? 'class' : 'classes'}
                  </p>
                  {slotCount > 0 && (
                    <div className="mt-3 space-y-2">
                      {schedule.slots
                        .filter(s => s.day === day)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .slice(0, 2)
                        .map((slot, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                            {slot.subject && <p className="text-muted-foreground">{slot.subject}</p>}
                          </div>
                        ))}
                      {slotCount > 2 && (
                        <p className="text-xs text-muted-foreground pt-2">
                          +{slotCount - 2} more
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleSlotCard({ slot }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-lg">
            {slot.startTime} - {slot.endTime}
          </p>
          {slot.subject && (
            <p className="text-base font-medium mt-1">{slot.subject}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {slot.room && (
              <Badge variant="outline" className="text-xs">
                📍 {slot.room}
              </Badge>
            )}
            {slot.instructor && (
              <Badge variant="outline" className="text-xs">
                👨‍🏫 {slot.instructor}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
