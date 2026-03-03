'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScheduleAdmin } from '@/components/ScheduleAdmin';
import { StudentScheduleView } from '@/components/StudentScheduleView';
import { AlertCircle, Calendar } from 'lucide-react';

export default function SchedulesPage() {
  const [classes, setClasses] = useState([]);
  const [userRole, setUserRole] = useState('student'); // 'admin' or 'student'
  const [userClassId, setUserClassId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    // TODO: Get actual user info from session/auth
    // For now, we'll assume admin can see all, student sees their class
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Class Schedules
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and view class schedules efficiently
        </p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">View Schedule</TabsTrigger>
          <TabsTrigger value="admin">Manage Schedules</TabsTrigger>
        </TabsList>

        {/* Student View */}
        <TabsContent value="student" className="space-y-6">
          {classes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No classes available. Please check back later.
              </AlertDescription>
            </Alert>
          ) : (
            <StudentScheduleView 
              classId={classes[0]?.id}
              studentName="Student"
            />
          )}
        </TabsContent>

        {/* Admin View */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>
                Create, edit, and delete class schedules. Upload images for AI-powered schedule extraction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No classes available. Please create a class first.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScheduleAdmin
                  classes={classes}
                  onScheduleSaved={(schedule) => {
                    console.log('Schedule saved:', schedule);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information Card */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">💡 Schedule Management Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✅ <strong>Quick Templates:</strong> Apply pre-configured schedules with standard timeslots</p>
          <p>📸 <strong>AI Image Analysis:</strong> Upload a photo of a schedule and let AI extract the information</p>
          <p>✏️ <strong>Manual Editing:</strong> Add, edit, or remove individual class slots</p>
          <p>👥 <strong>Student Access:</strong> Students can view their published schedules in a clean interface</p>
          <p>🔒 <strong>Database Storage:</strong> All schedules are securely stored in the database</p>
        </CardContent>
      </Card>
    </div>
  );
}
