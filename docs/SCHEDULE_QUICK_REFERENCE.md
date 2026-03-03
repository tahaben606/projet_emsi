# Schedule Management - Quick Reference

## 📍 Access Points

| Role        | URL                                 | Features                       |
| ----------- | ----------------------------------- | ------------------------------ |
| **Student** | `/schedules` → View Schedule tab    | See class schedule by day/week |
| **Admin**   | `/schedules` → Manage Schedules tab | Create, edit, delete schedules |

## ⚡ Quick Start for Admins

### Method 1: Quick Template

```
1. Select Class
2. Enter Schedule Name
3. Click "Standard Template (8:30-17:30)"
4. Customize time/subject/room/instructor
5. Click "Create Schedule"
```

### Method 2: Upload Image (AI)

```
1. Select Class
2. Enter Schedule Name
3. Click "Upload Schedule Image"
4. Select photo of schedule
5. AI extracts data automatically
6. Review & adjust as needed
7. Click "Create Schedule"
```

### Method 3: Manual Entry

```
1. Select Class
2. Enter Schedule Name
3. For each day:
   - Click "Add Slot"
   - Enter Start/End times
   - Add Subject, Room, Instructor
4. Click "Create Schedule"
```

## 🎯 Tips & Tricks

### Image Upload Tips

✅ Clear, well-lit photos work best
✅ Include day headers and time labels
✅ Supports both printed and digital schedules
❌ Avoid blurry or angled photos

### Manual Entry Tips

- Use 24-hour time format: 08:30, not 8:30 AM
- Keep subject names consistent across all schedules
- Room format: A101, Lab 2, etc.
- Instructor names are optional but helpful

### Organization

- Name schedules clearly: "Spring 2026 - Schedule A"
- Create separate schedules for different groups
- Delete old schedules to keep things clean
- Use descriptions for additional context

## 📊 What Data Gets Stored

```
Schedule
├── Name: "Spring 2026 Schedule"
├── Description: "Main class schedule"
├── Class: Reference to class
├── Slots: [
│   {
│   │   Day: "Monday"
│   │   Time: 08:30 - 10:30
│   │   Subject: "Data Structures"
│   │   Room: "A101"
│   │   Instructor: "Dr. Smith"
│   },
│   {
│   │   Day: "Monday"
│   │   Time: 10:30 - 12:30
│   │   ...
│   }
│ ]
└── Timestamps: Created/Updated dates
```

## 🔍 What Students See

1. **View Schedule Tab**: Shows only their class's published schedules
2. **Day View**: Classes for selected day with:
   - Time (start - end)
   - Subject name
   - Room location
   - Instructor name
3. **Week Overview**: Quick look at all days with class count

## ⚙️ API Quick Reference

### Create Schedule

```bash
curl -X POST http://localhost:3000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring 2026",
    "classId": "class_123",
    "slots": [
      {
        "day": "monday",
        "startTime": "08:30",
        "endTime": "10:30",
        "subject": "Math",
        "room": "A101",
        "instructor": "Prof. X"
      }
    ]
  }'
```

### Get Schedules

```bash
curl http://localhost:3000/api/schedules?classId=class_123&published=true
```

### Analyze Image

```bash
curl -X POST http://localhost:3000/api/schedules/analyze \
  -F "file=@schedule.jpg"
```

### Update Schedule

```bash
curl -X PUT http://localhost:3000/api/schedules/schedule_123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "isPublished": true
  }'
```

### Delete Schedule

```bash
curl -X DELETE http://localhost:3000/api/schedules/schedule_123
```

## 🛠️ Troubleshooting

| Issue                  | Solution                                            |
| ---------------------- | --------------------------------------------------- |
| Image analysis fails   | Ensure GOOGLE_API_KEY is set; try clearer image     |
| No schedules appear    | Check `isPublished` status; verify class ID matches |
| Time slots won't save  | Ensure start time < end time; verify format         |
| AI extracts wrong data | Adjust image quality; try different angle           |
| Database error         | Run `npm run db:push`                               |

## 📝 Common Tasks

### Add Subject to Existing Schedule

1. Go to "Manage Schedules" tab
2. Find schedule
3. Click "Edit"
4. Update slots (add subject info)
5. Click "Update Schedule"

### Remove a Class Slot

1. Edit the schedule
2. Click delete icon (🗑️) next to slot
3. Click "Update Schedule"

### Switch Between Multiple Schedules

- In student view, click on different schedule badges at top
- Each schedule appears independently

### Publish a Schedule

- Future: Toggle `isPublished` when ready
- Students will only see published schedules

## 🎓 For Students

### View Your Schedule

1. Go to `/schedules`
2. Click "View Schedule" tab
3. Your class schedule loads automatically
4. Click day tabs to see that day's classes
5. Check "Week Overview" for full week summary

### What Information Is Available

- ⏰ Class times
- 📚 Subject names
- 📍 Room locations
- 👨‍🏫 Instructor names (if provided)

### Navigation

- **Day Tabs**: Switch between Mon-Sun
- **Schedule Badges**: Switch between multiple schedules
- **Week Overview**: See entire week at a glance

## 📱 Responsive Design

- ✅ Mobile-friendly
- ✅ Tablet optimized
- ✅ Desktop full-featured
- ✅ Touch-friendly buttons
- ✅ Readable on small screens

## 🔐 Data Security

- ✅ All data in database (not in URLs)
- ✅ No sensitive data exposed
- ✅ Proper cascade deletes
- ✅ Timestamps for audit trail

## 🚀 Performance

- ✅ Lazy loading of schedules
- ✅ Filtered queries (by class, publish status)
- ✅ Optimized database indexes
- ✅ Client-side caching support

## 🎨 UI Features

- Clean card-based layout
- Color-coded badges for quick identification
- Intuitive time slots editor
- Real-time validation
- Toast notifications for feedback
- Loading states
- Error messages

---

**Need help?** Check the full documentation in `docs/SCHEDULE_MANAGEMENT.md`
