# Schedule Management System - Documentation

## Overview

A comprehensive scheduling system has been added to EMSI Flow that allows admins to create, edit, and delete class schedules, while students can view their schedules in an intuitive interface.

## Features

### Admin Features

- **Create Schedules**: Add new schedules for any class
- **Quick Templates**: Apply pre-configured schedule templates (e.g., 8:30-17:30 with standard breaks)
- **Image Upload & AI Analysis**: Upload a photo of a printed or digital schedule, and the AI will automatically extract schedule information
- **Manual Editing**: Fine-tune individual class slots
- **Edit & Delete**: Update or remove existing schedules
- **Bulk Operations**: Add multiple time slots at once per day

### Student Features

- **View Schedule**: See their class schedule in a clean, organized format
- **Day View**: View classes for a specific day with all details (time, room, instructor)
- **Week Overview**: Quick summary of classes throughout the week
- **Multiple Schedules**: Support for different schedules (e.g., different semesters)

## Database Schema

### Schedule Model

```prisma
model Schedule {
  id              String         @id @default(cuid())
  name            String
  description     String?
  classId         String
  class           Class          @relation(fields: [classId], references: [id], onDelete: Cascade)
  imageUrl        String?        // URL to uploaded schedule image
  imageAnalysis   String?        // JSON containing AI analysis
  isPublished     Boolean        @default(false)
  createdBy       String?        // Admin ID
  slots           ScheduleSlot[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model ScheduleSlot {
  id          String   @id @default(cuid())
  scheduleId  String
  schedule    Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
  day         String   // "monday", "tuesday", etc.
  startTime   String   // "08:30" format
  endTime     String   // "10:30" format
  subject     String?
  room        String?
  instructor  String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### Get Schedules

```
GET /api/schedules?classId=CLASS_ID&published=true
```

Returns all schedules for a specific class, optionally filtered by published status.

**Response:**

```json
[
  {
    "id": "schedule_id",
    "name": "Spring 2026 Schedule",
    "description": "Main class schedule",
    "classId": "class_id",
    "class": { ... },
    "isPublished": true,
    "slots": [
      {
        "id": "slot_id",
        "day": "monday",
        "startTime": "08:30",
        "endTime": "10:30",
        "subject": "Data Structures",
        "room": "A101",
        "instructor": "Dr. Smith"
      },
      ...
    ],
    "createdAt": "2026-03-03T00:00:00Z",
    "updatedAt": "2026-03-03T00:00:00Z"
  }
]
```

### Get Single Schedule

```
GET /api/schedules/[id]
```

Returns a specific schedule with all its slots.

### Create Schedule

```
POST /api/schedules
Content-Type: application/json

{
  "name": "Spring 2026 Schedule",
  "description": "Main class schedule",
  "classId": "class_id",
  "slots": [
    {
      "day": "monday",
      "startTime": "08:30",
      "endTime": "10:30",
      "subject": "Data Structures",
      "room": "A101",
      "instructor": "Dr. Smith"
    },
    ...
  ]
}
```

**Response:** Returns created schedule with generated ID.

### Update Schedule

```
PUT /api/schedules/[id]
Content-Type: application/json

{
  "name": "Updated Schedule Name",
  "description": "Updated description",
  "isPublished": true,
  "slots": [ ... ]  // Optional: replaces all slots if provided
}
```

**Response:** Returns updated schedule.

### Delete Schedule

```
DELETE /api/schedules/[id]
```

Deletes a schedule and all its associated slots.

### Analyze Schedule Image

```
POST /api/schedules/analyze
Content-Type: multipart/form-data

Form Data:
  file: <image file>
```

**Response:**

```json
{
  "scheduleSlots": [
    {
      "day": "monday",
      "startTime": "08:30",
      "endTime": "10:30",
      "subject": "Data Structures",
      "room": "A101",
      "instructor": "Dr. Smith"
    }
  ],
  "confidence": 0.95,
  "notes": "Successfully extracted 20 classes from the image",
  "issues": []
}
```

## Components

### ScheduleAdmin Component

Located in `src/components/ScheduleAdmin.tsx`

Admin interface for creating and managing schedules.

**Props:**

- `classes`: Array of class objects
- `onScheduleSaved`: Callback function when schedule is saved

**Features:**

- Create/Edit schedules with templates
- Upload and analyze schedule images
- Add/edit/delete time slots
- Manage multiple schedules per class

### StudentScheduleView Component

Located in `src/components/StudentScheduleView.tsx`

Student interface for viewing schedules.

**Props:**

- `classId`: The student's class ID
- `studentName`: Student's name (optional)

**Features:**

- View schedule by day
- Week overview
- Switch between multiple schedules
- Clean, intuitive UI

## Services

### Schedule Analyzer Service

Located in `src/services/schedule-analyzer.js`

Uses Google's Gemini API to analyze schedule images.

**Functions:**

```javascript
// Analyze from base64 encoded image
analyzeScheduleImage(imageBase64, mimeType);

// Analyze from URL (requires Gemini File API)
analyzeScheduleImageFromUrl(imageUrl);
```

## Pages

### Schedules Page

Located in `src/app/schedules/page.jsx`

Main page with two tabs:

1. **View Schedule** - Student view of their schedule
2. **Manage Schedules** - Admin view for creating/editing schedules

## Getting Started

### 1. Push Database Changes

```bash
npm run db:push
```

### 2. Access the Schedules Page

Navigate to `/schedules` in your application.

### 3. Create Your First Schedule (Admin)

1. Go to the "Manage Schedules" tab
2. Select a class
3. Enter a schedule name
4. Choose one of:
   - Apply a quick template
   - Upload a schedule image (AI will extract data)
   - Manually add time slots
5. Click "Create Schedule"

### 4. View Schedule (Student)

Students can view their schedule in the "View Schedule" tab, filtered by their class.

## AI Image Analysis

The system uses Google Gemini 1.5 Flash to analyze schedule images.

### How It Works

1. Student/Admin uploads an image of a schedule
2. Image is sent to Gemini API with specific instructions
3. AI extracts:
   - Day of week
   - Start and end times
   - Subject name
   - Room/location
   - Instructor name
4. Results are formatted and populated into the schedule editor

### Requirements

- Set `GOOGLE_API_KEY` environment variable
- Image should be clear and readable
- Supports common schedule formats

## Quick Templates

### Standard Template

- **Monday-Friday**: 8:30-10:30, 10:30-12:30, 13:30-15:30, 15:30-17:30
- **Saturday-Sunday**: Empty (no classes)

Future templates can be added by extending the `applyQuickTemplate` function.

## Tips for Best Results

### Image Analysis

- Use clear, high-quality images
- Ensure text is readable
- Include column headers (days)
- Support both printed and digital schedule photos

### Manual Entry

- Use 24-hour time format (HH:MM)
- Room names can be alphanumeric (e.g., "A101", "Lab 2")
- Instructor names are optional but recommended
- Use consistent subject names

### Organization

- Create a separate schedule for each semester
- Name schedules descriptively (e.g., "Spring 2026 - Lab Schedule")
- Publish schedules only when finalized
- Archive old schedules by deleting them

## Future Enhancements

- [ ] Schedule conflict detection
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Student schedule export (PDF, iCal)
- [ ] Recurring schedule patterns
- [ ] Room availability conflicts
- [ ] Exam schedule management
- [ ] Schedule notifications
- [ ] Mobile app optimization
- [ ] Multi-language support
- [ ] History/versioning of schedules

## Troubleshooting

### Image Analysis Not Working

- Ensure `GOOGLE_API_KEY` is set correctly
- Check that the image is clear and readable
- Verify image format is supported (JPEG, PNG, etc.)
- Check browser console for specific error messages

### Schedules Not Appearing for Students

- Ensure schedule is set to `isPublished: true`
- Verify student's class ID matches the schedule's class ID
- Clear browser cache

### Database Errors

- Run `npm run db:push` to apply schema changes
- Check that Prisma client is properly initialized
- Verify database file exists and is accessible

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── schedules/
│   │       ├── route.js          (GET, POST, DELETE)
│   │       ├── [id]/
│   │       │   └── route.js      (GET, PUT, DELETE)
│   │       └── analyze/
│   │           └── route.js      (POST - image analysis)
│   └── schedules/
│       └── page.jsx              (Main schedules page)
├── components/
│   ├── ScheduleAdmin.tsx         (Admin UI)
│   └── StudentScheduleView.tsx   (Student UI)
├── services/
│   └── schedule-analyzer.js      (Gemini API integration)
└── prisma/
    └── schema.prisma            (Database schema)
```

## Notes

- All data is stored in the SQLite database
- Schedules are paginated and filtered server-side
- Images are analyzed in real-time; original images are not stored (only metadata)
- Cascade delete ensures slots are deleted when a schedule is deleted
- Timestamps are automatically managed by Prisma
