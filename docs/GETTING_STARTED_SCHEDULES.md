# 🚀 Schedule System - Getting Started NOW

## ⏱️ Installation (2 Minutes)

### Step 1: Apply Database Changes

```bash
npm run db:push
```

This will:

- Create the `Schedule` table
- Create the `ScheduleSlot` table
- Regenerate Prisma client

### Step 2: Regenerate Prisma (Optional)

```bash
npm run db:generate
```

### Step 3: Verify Installation

```bash
npm run dev
```

- App should start on `http://localhost:3000`
- No errors in terminal

**That's it!** ✅

---

## 🎬 First Use (5 Minutes)

### Access the Schedules Page

```
http://localhost:3000/schedules
```

You'll see two tabs:

1. **View Schedule** - Students see this
2. **Manage Schedules** - Admins see this

---

## 📝 Create Your First Schedule (3 Methods)

### Method A: Quick Template (1 minute)

```
1. Click "Manage Schedules" tab
2. Click class dropdown, select a class
3. Enter schedule name, e.g., "Spring 2026"
4. Click "Standard Template (8:30-17:30)"
   ✅ 4 slots per weekday auto-filled!
5. Edit a few details (subject, room)
6. Click "Create Schedule"
```

### Method B: Upload Image (2 minutes)

```
1. Click "Manage Schedules" tab
2. Select class & enter name
3. Click "Upload Schedule Image"
4. Choose a photo of any printed schedule
5. Wait for AI analysis (10-15 seconds)
   ✅ All data auto-extracted!
6. Review the data (adjust if needed)
7. Click "Create Schedule"
```

### Method C: Manual Entry (5 minutes)

```
1. Click "Manage Schedules" tab
2. Select class & enter name
3. For each day (Monday-Sunday):
   - Click "Add Slot"
   - Enter: Start time (08:30), End time (10:30)
   - Enter: Subject, Room, Instructor
4. Click "Create Schedule"
```

---

## 👁️ View Your Schedule

### As a Student

```
1. Click "View Schedule" tab
2. Schedule loads automatically for your class
3. Click day tabs (Mon, Tue, Wed, etc.)
4. See classes for that day with:
   - ⏰ Time
   - 📚 Subject
   - 📍 Room
   - 👨‍🏫 Instructor
5. Scroll to see "Week Overview"
```

---

## 🔍 What You Should See

### After Creating a Schedule

```
✅ Green success toast: "Schedule created successfully"
✅ Schedule appears in "Manage" tab list
✅ You can view it in "View Schedule" tab
✅ Day view shows all your time slots
✅ Week overview shows total classes per day
```

### If Something Goes Wrong

See **Troubleshooting** section below

---

## 🛠️ Troubleshooting

### "Schedule not appearing"

```bash
# Make sure database updated
npm run db:push

# Restart dev server
npm run dev
```

### "Image upload fails"

- Ensure `GOOGLE_API_KEY` is set in `.env`
- Try a clearer image
- Check browser console for error message

### "API errors"

```bash
# Check database
npm run db:generate

# Restart everything
npm run dev
```

### "Components not loading"

- Clear browser cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+F5
- Restart dev server: npm run dev

---

## 📂 File Locations

If you need to find something:

```
Schedules Page:
  src/app/schedules/page.jsx

Admin Component:
  src/components/ScheduleAdmin.tsx

Student Component:
  src/components/StudentScheduleView.tsx

API Routes:
  src/app/api/schedules/route.js
  src/app/api/schedules/[id]/route.js
  src/app/api/schedules/analyze/route.js

AI Service:
  src/services/schedule-analyzer.js

Database:
  prisma/schema.prisma (contains Schedule models)

Docs:
  docs/SCHEDULE_MANAGEMENT.md (full reference)
  SCHEDULE_QUICK_REFERENCE.md (quick start)
  README_SCHEDULES.md (overview)
```

---

## 🌐 Environment Variables

Make sure your `.env` file has:

```env
# Database (should already exist)
DATABASE_URL="file:./dev.db"

# For AI image analysis (need to add)
GOOGLE_API_KEY="your_gemini_api_key_here"
```

**Get API Key:**

1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create new API key
4. Copy it to `.env` as `GOOGLE_API_KEY`

---

## ✨ Quick Features Recap

| Feature         | Where       | How                                           |
| --------------- | ----------- | --------------------------------------------- |
| Create Schedule | Admin tab   | Select class → Add details → Save             |
| Use Template    | Admin tab   | Click "Standard Template" → Customize         |
| Upload Image    | Admin tab   | Click "Upload" → Select photo → Review → Save |
| View Schedule   | Student tab | See classes by day, switch between days       |
| Edit Schedule   | Manage tab  | Click "Edit" → Update → Save                  |
| Delete Schedule | Manage tab  | Click "Delete" → Confirm                      |
| Week Overview   | Student tab | Scroll down to see all days                   |

---

## 🎓 Example Data

If you want test data, here's what a schedule looks like:

```
Schedule Name: Spring 2026 Schedule
Class: 3rd Year Computer Science

Monday:
  08:30-10:30: Data Structures (Room A101, Dr. Smith)
  10:30-12:30: Web Development (Lab 2, Prof. Johnson)
  13:30-15:30: AI/ML (Room B205, Dr. Patel)
  15:30-17:30: Project Work (Lab 1, Team)

Tuesday:
  09:00-11:00: Database Design (Room A102, Dr. Lee)
  ... etc

(And so on for Wed, Thu, Fri)
```

---

## 📊 What's Stored in Database

```
✅ Schedule info (name, description, class)
✅ All time slots (day, time, subject, room, instructor)
✅ Creation timestamps
✅ Update timestamps
❌ Images (analyzed but not stored)
❌ User info (implement later with auth)
```

---

## 🎯 Next Steps (Optional)

After you get it working:

1. **Add to Navigation Menu** - Link to `/schedules`
2. **Customize Appearance** - Adjust colors/styling
3. **Add More Templates** - Beyond the standard one
4. **Implement Auth** - Only admins can manage
5. **Add Notifications** - Alert students of changes

See `SCHEDULE_NEXT_STEPS.md` for complete list.

---

## 📞 Need Help?

### Quick Questions

- See `SCHEDULE_QUICK_REFERENCE.md`

### Technical Details

- See `docs/SCHEDULE_MANAGEMENT.md`

### Setup Issues

- See "Troubleshooting" above

### Architecture/Design

- See `SCHEDULE_VISUAL_GUIDE.md`

### What to do Next

- See `SCHEDULE_NEXT_STEPS.md`

---

## ✅ Installation Verification

After running `npm run db:push`, verify:

```bash
# Should show no errors
npm run dev

# In browser, navigate to:
http://localhost:3000/schedules

# You should see:
✅ "Class Schedules" heading
✅ Two tabs: "View Schedule" and "Manage Schedules"
✅ Information card at bottom
```

If you see all of this, **you're good to go!** 🚀

---

## 🎉 You're Ready!

**Time to get started:**

1. ✅ Run `npm run db:push`
2. ✅ Go to `http://localhost:3000/schedules`
3. ✅ Create your first schedule
4. ✅ View it in the Student tab

**That's all!** Everything else is self-explanatory. 📅

---

**Questions?** Check the documentation files - they have everything!
**Ready to customize?** See SCHEDULE_NEXT_STEPS.md for enhancement ideas.

Good luck! 🚀
