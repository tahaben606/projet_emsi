'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Plus, Trash2, Edit2, Loader2, AlertTriangle } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [
  { label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { label: '12:00 - 14:00', start: '12:00', end: '14:00' },
  { label: '14:00 - 16:00', start: '14:00', end: '16:00' },
  { label: '16:00 - 18:00', start: '16:00', end: '18:00' },
];

export function ScheduleAdmin({ classes, onScheduleSaved }) {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedClass, setSelectedClass] = useState('');
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  
  const initialSlots = {};
  DAYS.forEach(day => {
    initialSlots[day] = [];
  });
  const [slots, setSlots] = useState(initialSlots);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const { toast } = useToast();

  // Initialize slots for selected class
  const initializeSlots = useCallback(() => {
    const newSlots = {};
    DAYS.forEach(day => {
      newSlots[day] = [];
    });
    setSlots(newSlots);
  }, []);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setEditingScheduleId(null);
    setScheduleName('');
    setScheduleDescription('');
    setImageFile(null);
    initializeSlots();
    
    // Fetch existing schedules for this class
    if (classId) {
      try {
        const response = await fetch(`/api/schedules?classId=${classId}`);
        if (response.ok) {
          const data = await response.json();
          setExistingSchedules(data);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    }
  };

  const addTimeSlot = (day) => {
    setSlots(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { startTime: '08:00', endTime: '10:00', subject: '', room: '', instructor: '' }]
    }));
  };

  const updateSlot = (day, index, field, value) => {
    setSlots(prev => {
      const daySlots = [...(prev[day] || [])];
      if (daySlots[index]) {
        daySlots[index] = { ...daySlots[index], [field]: value };
      }
      return { ...prev, [day]: daySlots };
    });
  };

  const removeSlot = (day, index) => {
    setSlots(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter((_, i) => i !== index)
    }));
  };

  const applyQuickTemplate = (template) => {
    const newSlots = {};
    DAYS.forEach(day => {
      newSlots[day] = [];
    });

    if (template === 'standard') {
      DAYS.forEach(day => {
        newSlots[day] = [
          { startTime: '08:30', endTime: '10:30', subject: '', room: '', instructor: '' },
          { startTime: '10:30', endTime: '12:30', subject: '', room: '', instructor: '' },
          { startTime: '13:30', endTime: '15:30', subject: '', room: '', instructor: '' },
          { startTime: '15:30', endTime: '17:30', subject: '', room: '', instructor: '' }
        ];
      });
    }

    setSlots(newSlots);
    toast({ title: 'Template Applied', description: 'Quick template applied successfully.' });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setImageFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/schedules/analyze', {
        method: 'POST',
        body: formData
      });

      const analysis = await response.json();

      if (!response.ok) {
        throw new Error(analysis.error || 'Failed to analyze image');
      }
      
      if (analysis.scheduleSlots && analysis.scheduleSlots.length > 0) {
        const newSlots = {};
        DAYS.forEach(day => {
          newSlots[day] = [];
        });

        analysis.scheduleSlots.forEach(slot => {
          if (slot.day && newSlots[slot.day]) {
            newSlots[slot.day].push({
              startTime: slot.startTime || '08:00',
              endTime: slot.endTime || '10:00',
              subject: slot.subject || '',
              room: slot.room || '',
              instructor: slot.instructor || ''
            });
          }
        });

        setSlots(newSlots);
        toast({
          title: 'Image Analyzed',
          description: `Successfully extracted ${analysis.scheduleSlots.length} schedule slots from the image.`
        });
      } else {
        toast({
          title: 'Analysis Result',
          description: analysis.notes || 'No schedule information found in the image.'
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage || 'Failed to analyze the schedule image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass || !scheduleName) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const allSlots = [];
    Object.entries(slots).forEach(([day, daySlots]) => {
      daySlots.forEach(slot => {
        allSlots.push({ ...slot, day });
      });
    });

    if (allSlots.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one time slot.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingScheduleId 
        ? `/api/schedules/${editingScheduleId}`
        : '/api/schedules';
      
      const method = editingScheduleId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleName,
          description: scheduleDescription,
          classId: selectedClass,
          slots: allSlots,
          imageUrl: imageFile ? 'schedule-image' : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      const schedule = await response.json();
      toast({
        title: 'Success',
        description: editingScheduleId ? 'Schedule updated successfully.' : 'Schedule created successfully.'
      });

      // Refresh schedules list
      if (selectedClass) {
        handleClassChange(selectedClass);
      }

      // Reset form
      setScheduleName('');
      setScheduleDescription('');
      setImageFile(null);
      setEditingScheduleId(null);
      initializeSlots();

      if (onScheduleSaved) onScheduleSaved(schedule);
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save schedule. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      toast({
        title: 'Success',
        description: 'Schedule deleted successfully.'
      });

      // Refresh schedules list
      if (selectedClass) {
        handleClassChange(selectedClass);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete schedule.',
        variant: 'destructive'
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEditSchedule = (schedule) => {
    setScheduleName(schedule.name);
    setScheduleDescription(schedule.description);
    setEditingScheduleId(schedule.id);
    
    const newSlots = {};
    DAYS.forEach(day => {
      newSlots[day] = [];
    });

    schedule.slots.forEach(slot => {
      if (newSlots[slot.day]) {
        newSlots[slot.day].push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          subject: slot.subject || '',
          room: slot.room || '',
          instructor: slot.instructor || ''
        });
      }
    });

    setSlots(newSlots);
    setActiveTab('create');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create/Edit Schedule</TabsTrigger>
          <TabsTrigger value="manage">Manage Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingScheduleId ? 'Edit Schedule' : 'Create New Schedule'}</CardTitle>
              <CardDescription>
                {editingScheduleId ? 'Update the schedule details' : 'Create a schedule by choosing a template, uploading an image, or manually adding slots'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class Selection */}
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Warning if schedule already exists */}
                {selectedClass && existingSchedules.length > 0 && !editingScheduleId && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Warning:</strong> This class already has {existingSchedules.length} schedule(s). Creating a new schedule will add another one for this class.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Schedule Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Spring 2026 Schedule"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Optional description"
                      value={scheduleDescription}
                      onChange={(e) => setScheduleDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick Templates */}
                {!editingScheduleId && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Create Schedule Manually</h3>
                    <div className="space-y-2 mb-4">
                      <Label>Quick Templates</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => applyQuickTemplate('standard')}
                        >
                          Standard Template (8:30-17:30)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                
                {/* Time Slots Editor */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Schedule Slots</h3>
                  {DAYS.map(day => (
                    <Card key={day} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium capitalize">{day}</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addTimeSlot(day)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Slot
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {slots[day] && slots[day].map((slot, index) => (
                          <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                            <div className="space-y-1">
                              <label className="text-sm font-medium">Start</label>
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateSlot(day, index, 'startTime', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium">End</label>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateSlot(day, index, 'endTime', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium">Subject</label>
                              <Input
                                placeholder="Subject"
                                value={slot.subject}
                                onChange={(e) => updateSlot(day, index, 'subject', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium">Room</label>
                              <Input
                                placeholder="Room"
                                value={slot.room}
                                onChange={(e) => updateSlot(day, index, 'room', e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="space-y-1 flex-1">
                                <label className="text-sm font-medium">Instructor</label>
                                <Input
                                  placeholder="Instructor"
                                  value={slot.instructor}
                                  onChange={(e) => updateSlot(day, index, 'instructor', e.target.value)}
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeSlot(day, index)}
                                className="mt-6"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingScheduleId ? 'Update Schedule' : 'Create Schedule'
                  )}
                </Button>

                {editingScheduleId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEditingScheduleId(null);
                      setScheduleName('');
                      setScheduleDescription('');
                      initializeSlots();
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Schedules</CardTitle>
              <CardDescription>View and manage existing schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="class-filter">Filter by Class</Label>
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger id="class-filter">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {existingSchedules.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {existingSchedules.map(schedule => (
                    <Card key={schedule.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{schedule.name}</h4>
                          {schedule.description && (
                            <p className="text-sm text-muted-foreground">{schedule.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {schedule.slots.length} slots • Created {new Date(schedule.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirm(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center py-8 text-muted-foreground">
                  <p>No schedules found for the selected class</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteSchedule(deleteConfirm)}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
