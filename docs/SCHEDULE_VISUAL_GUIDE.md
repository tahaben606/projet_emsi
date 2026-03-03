# Schedule Management System - Visual Guide

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      EMSI Flow Application                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐     ┌──────────────┐
            │  Student     │     │   Admin      │
            │  View Tab    │     │  Manage Tab  │
            └──────────────┘     └──────────────┘
                    │                   │
                    ▼                   ▼
         ┌────────────────────┐  ┌────────────────────┐
         │StudentScheduleView │  │  ScheduleAdmin     │
         │    Component       │  │    Component       │
         └────────────────────┘  └────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌──────────────────┐
                    │  API Endpoints   │
                    │  /api/schedules  │
                    └──────────────────┘
                              │
                    ┌─────────┬─────────┬──────────┐
                    ▼         ▼         ▼          ▼
                  GET       POST      PUT      DELETE
                  │         │         │          │
                    └─────────┴─────────┴──────────┘
                              ▼
                    ┌──────────────────┐
                    │   Prisma ORM     │
                    └──────────────────┘
                              ▼
                    ┌──────────────────┐
                    │  SQLite Database │
                    └──────────────────┘
```

## 🎯 User Workflows

### Admin Workflow - Creating a Schedule

```
START
  │
  ├─→ Go to /schedules
  │
  ├─→ Click "Manage Schedules" tab
  │
  ├─→ Select Class
  │    │
  │    ├─→ Enter Schedule Name
  │    │
  │    ├─→ Choose Method:
  │    │   │
  │    │   ├─→ [A] Apply Template
  │    │   │     │
  │    │   │     ├─→ Click "Standard Template"
  │    │   │     │
  │    │   │     ├─→ Customize Subjects/Rooms/Instructors
  │    │   │     │
  │    │   │     └─→ Click "Create Schedule"
  │    │   │
  │    │   ├─→ [B] Upload Image (AI)
  │    │   │     │
  │    │   │     ├─→ Upload schedule image
  │    │   │     │
  │    │   │     ├─→ AI analyzes image
  │    │   │     │
  │    │   │     ├─→ Review extracted data
  │    │   │     │
  │    │   │     └─→ Click "Create Schedule"
  │    │   │
  │    │   └─→ [C] Manual Entry
  │    │         │
  │    │         ├─→ For each day:
  │    │         │   ├─→ Click "Add Slot"
  │    │         │   ├─→ Enter Start/End time
  │    │         │   ├─→ Add Subject/Room/Instructor
  │    │         │   └─→ Repeat for all slots
  │    │         │
  │    │         └─→ Click "Create Schedule"
  │    │
  │    └─→ SUCCESS! ✅
  │
  └─→ END
```

### Student Workflow - Viewing Schedule

```
START
  │
  ├─→ Go to /schedules
  │
  ├─→ Click "View Schedule" tab
  │
  ├─→ Schedule loads automatically
  │
  ├─→ Browse Schedule:
  │   │
  │   ├─→ Click day tab (Mon-Sun)
  │   │
  │   ├─→ See classes for that day
  │   │   ├─→ Time: 08:30 - 10:30
  │   │   ├─→ Subject: Data Structures
  │   │   ├─→ Room: A101
  │   │   └─→ Instructor: Dr. Smith
  │   │
  │   └─→ Check "Week Overview" for summary
  │
  └─→ END
```

## 🏗️ Data Flow Diagram

### Creating a Schedule with Image

```
┌──────────────┐
│ Admin picks  │
│ image file   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Upload to UI     │
│ (FormData)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/schedules/analyze      │
│ - File sent to server            │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ schedule-analyzer.js service     │
│ - Convert to base64             │
│ - Send to Gemini API            │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Google Gemini 1.5 Flash          │
│ - Analyze image                  │
│ - Extract information            │
│ - Return JSON                    │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ API Response to Client           │
│ {                                │
│   scheduleSlots: [               │
│     { day, startTime, endTime,   │
│       subject, room, instructor} │
│   ]                              │
│ }                                │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ UI Auto-populates Form           │
│ - Shows extracted data           │
│ - User reviews & edits           │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ User clicks "Create Schedule"    │
│ POST /api/schedules              │
│ - Send all slots to server       │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Prisma ORM                       │
│ - Validate data                  │
│ - Create schedule                │
│ - Create all slots               │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ SQLite Database                  │
│ ✅ Schedule saved successfully   │
└──────────────────────────────────┘
```

## 📱 UI Layout

### Main Schedules Page

```
┌─────────────────────────────────────────────────┐
│  📅 Class Schedules                             │
│  Manage and view class schedules efficiently    │
├─────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────────┐           │
│  │ View Schedule│ Manage Schedules │ (Tabs)    │
│  └──────────────┴──────────────────┘           │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ [Content varies by selected tab]         │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ 💡 Schedule Management Features          │  │
│  │ ✅ Quick Templates                      │  │
│  │ 📸 AI Image Analysis                    │  │
│  │ ✏️  Manual Editing                      │  │
│  │ 👥 Student Access                      │  │
│  │ 🔒 Database Storage                    │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Student View Tab

```
┌─────────────────────────────────────────────────┐
│  📅 Your Schedule                               │
│  View your class schedule                       │
├─────────────────────────────────────────────────┤
│  [Description if available]                     │
│                                                 │
│  ┌──┬──┬──┬──┬──┬──┬──┐                       │
│  │Mon│Tue│Wed│Thu│Fri│Sat│Sun│  (Day Tabs)  │
│  └──┴──┴──┴──┴──┴──┴──┘                       │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ 08:30 - 10:30                           │  │
│  │ Data Structures                         │  │
│  │ 📍 A101  👨‍🏫 Dr. Smith                │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ 10:30 - 12:30                           │  │
│  │ Web Development                         │  │
│  │ 📍 Lab 2  👨‍🏫 Prof. Johnson            │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ Week Overview                           │  │
│  │                                         │  │
│  │ Mon: 2 classes  │ Tue: 3 classes      │  │
│  │ Wed: 2 classes  │ Thu: 3 classes      │  │
│  │ Fri: 1 class    │ Sat: -              │  │
│  │ Sun: -          │                     │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Admin View Tab

```
┌─────────────────────────────────────────────────┐
│  ⚙️  Schedule Management                       │
├─────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────┐              │
│  │ Create/Edit  │ Manage       │  (Tabs)     │
│  └──────────────┴──────────────┘              │
├─────────────────────────────────────────────────┤
│ CREATE/EDIT TAB:                                │
│                                                 │
│ Class: [Select Class ▼]                        │
│ Name:  [________________]                       │
│ Description: [______________]                  │
│                                                 │
│ ┌─ Quick Templates ──────────────────────┐    │
│ │ [Standard Template 8:30-17:30]          │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ ┌─ Upload Schedule Image ────────────────┐    │
│ │ [Choose File] [🔄 Analyzing...]        │    │
│ │ Upload a photo for AI extraction       │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ Schedule Slots:                                │
│                                                 │
│ ┌─ Monday ──────────────────────────────┐    │
│ │ [08:30-10:30] Data Structures A101   │    │
│ │ [10:30-12:30] Web Dev Lab 2          │    │
│ │ [+ Add Slot]                         │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ [Create Schedule] or [Update Schedule]        │
│                                                 │
├─────────────────────────────────────────────────┤
│ MANAGE TAB:                                     │
│                                                 │
│ Class: [Select Class ▼]                        │
│                                                 │
│ ┌─────────────────────────────────────┐       │
│ │ Spring 2026 Schedule                │       │
│ │ Main class schedule                 │       │
│ │ 16 slots • Created Feb 28, 2026    │       │
│ │                    [Edit] [Delete]  │       │
│ └─────────────────────────────────────┘       │
│                                                 │
│ ┌─────────────────────────────────────┐       │
│ │ Summer 2026 Schedule                │       │
│ │ 12 slots • Created Jan 15, 2026    │       │
│ │                    [Edit] [Delete]  │       │
│ └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

## 🗂️ Database Relationships

```
┌──────────────┐
│    Class     │
│              │
│ id (PK)      │
│ name         │
│ code         │
│ ...          │
└──────┬───────┘
       │ (1:N)
       │ classId
       ▼
┌──────────────┐          ┌───────────────┐
│   Schedule   │          │ ScheduleSlot  │
│              │ ──────── │               │
│ id (PK)      │ (1:N)    │ id (PK)       │
│ name         │          │ scheduleId    │
│ description  │   slots  │ day           │
│ classId (FK) │◄─────────│ startTime     │
│ isPublished  │          │ endTime       │
│ createdAt    │          │ subject       │
│ ...          │          │ room          │
└──────────────┘          │ instructor    │
                          │ ...           │
                          └───────────────┘
```

## 🔄 API Request/Response Flow

### Create Schedule

```
REQUEST:
POST /api/schedules
{
  "name": "Spring 2026",
  "classId": "class_123",
  "slots": [
    {
      "day": "monday",
      "startTime": "08:30",
      "endTime": "10:30",
      "subject": "Data Structures"
    }
  ]
}

↓↓↓ (Processed by Prisma) ↓↓↓

RESPONSE (201 Created):
{
  "id": "sched_456",
  "name": "Spring 2026",
  "classId": "class_123",
  "class": { ... },
  "slots": [ ... ],
  "createdAt": "2026-03-03T00:00:00Z"
}
```

### Get Schedules

```
REQUEST:
GET /api/schedules?classId=class_123&published=true

↓↓↓ (Query filtered) ↓↓↓

RESPONSE (200 OK):
[
  {
    "id": "sched_456",
    "name": "Spring 2026",
    "slots": [
      { "day": "monday", "startTime": "08:30", ... },
      { "day": "monday", "startTime": "10:30", ... },
      ...
    ],
    ...
  }
]
```

## 📊 Component Hierarchy

```
schedules/page.jsx
│
├── Tabs (View Schedule / Manage Schedules)
│
├── Tab 1: Student View
│   │
│   └── StudentScheduleView.tsx
│       ├── Tabs (Monday, Tuesday, ...)
│       │
│       ├── ScheduleSlotCard components
│       │   ├── Time display
│       │   ├── Subject name
│       │   ├── Room badge
│       │   └── Instructor badge
│       │
│       └── Week Overview
│           └── Day cards with slot counts
│
└── Tab 2: Admin View
    │
    └── ScheduleAdmin.tsx
        ├── Tabs (Create/Edit Schedule, Manage)
        │
        ├── Tab 1: Create/Edit
        │   ├── Class selector
        │   ├── Schedule info inputs
        │   ├── Quick templates
        │   ├── Image upload
        │   ├── Time slots editor
        │   │   └── Day-by-day layout
        │   │       └── Slot editor rows
        │   └── Submit button
        │
        └── Tab 2: Manage
            ├── Class filter
            └── Schedule list
                └── Schedule cards
                    ├── Edit button
                    └── Delete button
```

---

## Summary

This visual guide shows:

- ✅ System architecture and component relationships
- ✅ User workflows for admin and students
- ✅ Data flow diagrams
- ✅ UI layouts and component hierarchy
- ✅ Database relationships
- ✅ API communication patterns

Everything is fully implemented and ready to use! 🚀
