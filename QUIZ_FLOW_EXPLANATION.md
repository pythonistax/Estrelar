# Quiz Flow Explanation - How Everything Works

## 🚀 What Happens When You Run `npm run dev`

### 1. **Next.js Development Server Starts**
   - Command: `npm run dev` → runs `next dev` (from `package.json`)
   - Next.js starts a development server on `http://localhost:3000`
   - Webpack compiles your React/TypeScript files
   - Hot Module Replacement (HMR) is enabled for live updates

### 2. **Initial File Loading Sequence**

```
npm run dev
    ↓
next dev (reads next.config.js)
    ↓
Loads app/layout.tsx (Root Layout - wraps ALL pages)
    ↓
Loads app/page.tsx (Home Page - the landing page)
    ↓
Browser renders the page
```

**Files Triggered:**
- `app/layout.tsx` - Root layout (loads fonts, global CSS, toast notifications)
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles
- `components/CoursivHeader.tsx` - Header component

---

## 📄 Initial Page Load (`app/page.tsx`)

### What Renders First:
1. **Landing Page** with:
   - Header (`CoursivHeader` component)
   - Main content: "More than 700,000 people joined Coursiv to master AI"
   - Image on the right side
   - "CONTINUE" button at the bottom

### State Management:
```typescript
const [showQuiz, setShowQuiz] = useState(false)
```
- When `showQuiz = false`: Shows landing page
- When `showQuiz = true`: Shows `QuizFlow` component

### User Action:
- User clicks "CONTINUE" button → `onClick={() => setShowQuiz(true)}`
- This switches the entire view from landing page to quiz

---

## 🎯 Quiz Flow Logic (`components/QuizFlow.tsx`)

### State Variables (The "Brain" of the Quiz):

```typescript
// Step tracking
const [currentStep, setCurrentStep] = useState(0)  // Which question (0-19)
const [answers, setAnswers] = useState<Record<number, string | string[]>>({})  // All answers stored here

// Special pages
const [showTeaser, setShowTeaser] = useState(false)        // Shown after Q5
const [showUserProfile, setShowUserProfile] = useState(false)  // Shown after Q17
const [showPersonalPlan, setShowPersonalPlan] = useState(false) // Shown after Q19
const [showMagicPage, setShowMagicPage] = useState(false)  // After Personal Plan
const [showEmailPage, setShowEmailPage] = useState(false)  // After Magic Page
const [showNamePage, setShowNamePage] = useState(false)    // After Email Page
const [showScratchPage, setShowScratchPage] = useState(false) // After Name Page
const [showSellingPage, setShowSellingPage] = useState(false)  // After Scratch Page
const [showEndPage, setShowEndPage] = useState(false)      // Final page

// User data
const [userName, setUserName] = useState<string>('')
const [userEmail, setUserEmail] = useState<string>('')
```

### Data Source:
- Quiz questions come from `config/copy.json` via `lib/config.ts`
- Loaded as: `const steps = copy.quiz.steps` (array of 20 questions)

---

## 🔄 Complete User Journey Flow

### **Phase 1: Landing Page → Quiz Start**
```
Landing Page (app/page.tsx)
    ↓ User clicks "CONTINUE"
QuizFlow component mounts
    ↓
useEffect generates sessionId
    ↓
Shows Question 1 (currentStep = 0)
```

### **Phase 2: Questions 1-5**
```
Question 1 (currentStep = 0)
    ↓ User selects answer
handleAnswer() saves answer to answers[0]
    ↓ 300ms delay
Question 2 (currentStep = 1)
    ↓ ... continues ...
Question 5 (currentStep = 4)
    ↓ User selects ANY answer
SPECIAL: Automatically shows TeaserPage
```

**Key Code (lines 109-115):**
```typescript
if (currentStep === 4) {  // Question 5
  setTimeout(() => {
    setShowTeaser(true)
  }, 300)
  return
}
```

### **Phase 3: Teaser Page**
```
TeaserPage renders
    ↓ User clicks continue
handleTeaserContinue()
    ↓
Jumps to Question 6 (currentStep = 5)
Continues with Questions 6-16
```

### **Phase 4: Questions 6-16**
```
Question 6 (currentStep = 5)
    ↓ ... continues normally ...
Question 17 (currentStep = 16)
    ↓ User selects ANY answer
SPECIAL: Shows UserProfilePage
```

**Key Code (lines 100-106):**
```typescript
if (currentStep === 16) {  // Question 17
  setTimeout(() => {
    setShowUserProfile(true)
  }, 300)
  return
}
```

### **Phase 5: User Profile → Question 18**
```
UserProfilePage renders
    ↓ User clicks continue
handleUserProfileContinue()
    ↓
Question 18 (currentStep = 17)
```

### **Phase 6: Question 19 → Personal Plan**
```
Question 19 (currentStep = 18)
    ↓ User selects ANY answer
SPECIAL: Shows PersonalPlanPage
```

**Key Code (lines 91-97):**
```typescript
if (currentStep === 18) {  // Question 19
  setTimeout(() => {
    setShowPersonalPlan(true)
  }, 300)
  return
}
```

### **Phase 7: Personal Plan → Magic → Email → Name → Scratch → Selling → End**
```
PersonalPlanPage
    ↓ continue
MagicPage
    ↓ continue
EmailPage (collects email + consent)
    ↓ continue (handleEmailPageContinue)
NamePage (collects name)
    ↓ submit (handleNameSubmit)
    ↓ API call: POST /api/save-email
    ↓ (saves email + name + quiz answers + session data)
ScratchPage (interactive scratch card)
    ↓ complete
SellingPage
    ↓ continue
EndPage (final page)
```

---

## 📊 How Answers Are Stored

### Data Structure:
```typescript
answers: {
  0: "18-24",           // Question 1 answer
  1: "Gain financial skills", // Question 2 answer
  2: "Always",          // Question 3 answer
  5: ["option1", "option2"], // Multi-select question (array)
  // ... etc
}
```

### Answer Flow:
1. **Single Select Question:**
   ```
   User clicks option → handleAnswer(answer)
   → saves to answers[currentStep] = answer
   → advances to next question
   ```

2. **Multi-Select Question:**
   ```
   User clicks options → handleAnswer(answer)
   → toggles in selectedAnswers array
   → User clicks "NEXT STEP"
   → handleMultiSelectContinue()
   → saves to answers[currentStep] = selectedAnswers (array)
   → advances to next question
   ```

---

## 🎨 Rendering Logic (Conditional Rendering)

The component uses **if-else chain** to decide what to show:

```typescript
// Priority order (top to bottom):
if (showSellingPage) return <SellingPage />
if (showScratchPage) return <ScratchPage />
if (showNamePage) return <NamePage />
if (showEmailPage) return <EmailPage />
if (showMagicPage) return <MagicPage />
if (showPersonalPlan) return <PersonalPlanPage />
if (showUserProfile) return <UserProfilePage />
if (showEndPage) return <EndPage />
if (showTeaser) return <TeaserPage />
// Otherwise: Show quiz question (current step)
```

**Important:** Only ONE of these renders at a time. When a state changes, React re-renders and the first `true` condition wins.

---

## 🔙 Back Button Logic

The `handleBackClick()` function (lines 293-347) handles navigation backwards:

```typescript
handleBackClick() {
  // Check each page state in reverse order
  if (showSellingPage) → go back to ScratchPage
  if (showScratchPage) → go back to NamePage
  if (showNamePage) → go back to EmailPage
  // ... etc
  if (currentStep > 0) → go back to previous question
  if (onBack) → go back to landing page
}
```

---

## 📡 API Submission Flow

### When Email + Name Are Collected:

1. **Email Page** (`EmailPage.tsx`):
   - User enters email + checks consent boxes
   - `onContinue` called → passes email + consents to `QuizFlow`

2. **Name Page** (`NamePage.tsx`):
   - User enters name
   - `handleNameSubmit` called (QuizFlow, line 230)
   - **API call happens here:**

```typescript
POST /api/save-email
Body: {
  email: "user@example.com",
  name: "John Doe",
  sessionId: "session_1234567890_abc123",
  createdAt: "2024-01-01T00:00:00.000Z",
  privacyConsent: true,
  marketingConsent: false,
  quizAnswers: { 0: "18-24", 1: "...", ... },
  submittedAt: "2024-01-01T00:00:00.000Z"
}
```

3. **After API call:**
   - Proceeds to ScratchPage (regardless of API success/failure)
   - Data is already collected, so user experience isn't blocked

---

## 🗂️ File Structure & Responsibilities

```
app/
  ├── layout.tsx          → Root layout (wraps all pages)
  ├── page.tsx            → Landing page (initial entry point)
  └── api/
      └── save-email/
          └── route.ts    → API endpoint (handles POST /api/save-email)

components/
  ├── QuizFlow.tsx        → Main quiz orchestrator (THE BRAIN)
  ├── EmailPage.tsx       → Email collection page
  ├── NamePage.tsx        → Name collection page
  ├── TeaserPage.tsx      → Shown after Q5
  ├── UserProfilePage.tsx → Shown after Q17
  ├── PersonalPlanPage.tsx → Shown after Q19
  ├── MagicPage.tsx       → After Personal Plan
  ├── ScratchPage.tsx     → After Name collection
  ├── SellingPage.tsx     → After Scratch
  └── EndPage.tsx         → Final page

lib/
  ├── config.ts           → Loads config/copy.json (quiz questions)
  └── session.ts          → Session ID management

config/
  └── copy.json           → Quiz questions, copy text (data source)
```

---

## 🎯 Key Insights

### 1. **State is the Source of Truth**
   - All quiz state lives in `QuizFlow.tsx`
   - Child components receive data via props and callbacks
   - When state changes, React re-renders automatically

### 2. **Conditional Rendering Pattern**
   - Uses simple `if` statements to show/hide pages
   - Only one page component renders at a time
   - State variables act as "flags" for what to show

### 3. **Special Question Logic**
   - Questions 5, 17, and 19 trigger special pages
   - This is hardcoded in `handleAnswer()` function
   - Not based on answer choice, just question number

### 4. **Session Management**
   - Session ID generated when quiz starts (`useEffect` in QuizFlow)
   - Stored in browser's `sessionStorage`
   - Sent with final API submission

### 5. **Data Flow**
   ```
   User action → Event handler → State update → Re-render → New UI
   ```

---

## 🔍 Debugging Tips

1. **Check State:**
   - Add `console.log` in QuizFlow to see current state
   - Check browser DevTools → React DevTools

2. **Track Current Step:**
   ```typescript
   console.log('Current Step:', currentStep)
   console.log('Answers:', answers)
   ```

3. **Check Which Page Should Render:**
   ```typescript
   console.log({
     showTeaser,
     showUserProfile,
     showPersonalPlan,
     showEmailPage,
     showNamePage,
     showScratchPage,
     showSellingPage,
     showEndPage
   })
   ```

---

## 📝 Summary

**The flow is:**
1. Landing page → User clicks CONTINUE
2. Quiz starts → Questions 1-5 → Teaser page
3. Questions 6-16 → User Profile page
4. Question 17-18 → Question 19 → Personal Plan page
5. Magic → Email → Name → API submission
6. Scratch → Selling → End page

**The logic is centralized in `QuizFlow.tsx`** - all state, navigation, and conditional rendering happens there. Other components are "dumb" presentation components that receive props and call callbacks.


