# How Config Files Work - Practical Guide

## You're Right! They're Like Python Dictionaries

Yes! JSON files are basically dictionaries in Python. Here's how they work:

### Python Dictionary:
```python
hero = {
    "title": "Discover Your Perfect Match",
    "subtitle": "Take our quick quiz",
    "cta": "Start Quiz"
}
print(hero["title"])  # Output: "Discover Your Perfect Match"
```

### JSON File (copy.json):
```json
{
  "hero": {
    "title": "Discover Your Perfect Match",
    "subtitle": "Take our quick quiz",
    "cta": "Start Quiz"
  }
}
```

**Same thing!** Just different syntax.

---

## How The Code Uses These Config Files

### Step 1: Code Reads the Config File

Look at `app/page.tsx` line 9:
```typescript
import { copy } from '@/lib/config'
```

This loads your `copy.json` file into a variable called `copy`.

### Step 2: Code Uses the Values

Look at `app/page.tsx` line 26:
```typescript
{copy.hero.title}
```

This is like Python:
```python
copy["hero"]["title"]  # Gets "Discover Your Perfect Match"
```

### Step 3: Website Shows the Value

When someone visits your website, they see:
```
"Discover Your Perfect Match"  ← This comes from copy.json!
```

---

## Practical Example: How Each Config File is Used

### 1. `copy.json` - All Your Text Content

**What it contains:**
- Hero section text (title, subtitle, button)
- Testimonials (names, locations, quotes)
- Stats (user counts, satisfaction %)
- Quiz questions and answers
- Notification messages

**How it's used:**

In `app/page.tsx`:
```typescript
{copy.hero.title}        // Shows: "Discover Your Perfect Match"
{copy.hero.subtitle}     // Shows: "Take our quick quiz..."
{copy.hero.cta}         // Shows: "Start Quiz" (button text)
```

In `components/SocialProof.tsx`:
```typescript
{copy.socialProof.title}                    // Shows: "Join thousands..."
{copy.socialProof.stats.users}              // Shows: "12,847"
{copy.socialProof.testimonials[0].name}     // Shows: "Sarah M."
{copy.socialProof.testimonials[0].text}     // Shows: "This changed..."
```

**Practical Use:**
- Change `copy.json` → Website text changes instantly
- No code editing needed!

---

### 2. `theme.json` - Colors and Styling

**What it contains:**
- Colors (primary, secondary, accent)
- Font sizes
- Spacing values
- Border radius

**How it's used:**

Currently, the code uses hardcoded colors, but `theme.json` is ready to use. You can modify components to use it like:

```typescript
// Instead of hardcoded: className="bg-blue-600"
// Could use: style={{ backgroundColor: theme.colors.primary }}
```

**Practical Use:**
- Change `theme.json` → Website colors change
- Match your brand colors easily

---

### 3. `app.json` - Feature Switches

**What it contains:**
- App name and version
- Feature flags (on/off switches)

**How it's used:**

The code can check these settings:
```typescript
if (app.settings.enableCountdown) {
    // Show countdown timer
} else {
    // Hide countdown timer
}
```

**Practical Use:**
- Turn features on/off without deleting code
- `enableCountdown: false` → Countdown disappears
- `enableSocialProof: false` → Testimonials disappear

---

## Real-World Example: Changing Your Landing Page

### Scenario: You want to change the headline

**Step 1: Edit `config/copy.json`**
```json
{
  "hero": {
    "title": "Find Your Perfect Solution",  ← Changed this!
    "subtitle": "Take our quick quiz...",
    "cta": "Start Quiz"
  }
}
```

**Step 2: Save the file**

**Step 3: Refresh your browser**

**Result:** The website now shows "Find Your Perfect Solution" instead!

**No code editing needed!** Just like changing a Python variable.

---

## How Data Flows

```
┌─────────────────┐
│  copy.json      │  ← You edit this (like Python dict)
│  (Your data)    │
└────────┬────────┘
         │
         │ Imported by
         ↓
┌─────────────────┐
│  lib/config.ts  │  ← Loads JSON files
│  (Loader)       │
└────────┬────────┘
         │
         │ Used by
         ↓
┌─────────────────┐
│  app/page.tsx   │  ← Displays {copy.hero.title}
│  (Website)      │
└────────┬────────┘
         │
         │ Shows to
         ↓
┌─────────────────┐
│  Browser        │  ← User sees: "Discover Your Perfect Match"
│  (Visitor)      │
└─────────────────┘
```

---

## Practical Uses for Each Section

### `copy.json` → `hero` Section
**Used for:**
- Main headline (big text at top)
- Subheadline (smaller text below)
- Button text ("Start Quiz", "Get Started", etc.)

**Change it when:**
- You want different headlines
- Testing different messages
- Creating a new offer

---

### `copy.json` → `socialProof` Section
**Used for:**
- Testimonial title ("Join thousands...")
- User testimonials (rotating quotes)
- Statistics (user counts, satisfaction %)

**Change it when:**
- Adding new testimonials
- Updating stats
- Changing social proof messages

**Example:**
```json
"testimonials": [
  {
    "name": "Your Customer",
    "location": "Their City",
    "text": "Their quote here",
    "time": "2 hours ago"
  }
]
```

---

### `copy.json` → `quiz` Section
**Used for:**
- Quiz questions
- Answer options

**Change it when:**
- Creating different quiz flows
- Testing different questions
- Customizing for your offer

**Example:**
```json
"steps": [
  {
    "id": 1,
    "question": "What's your main goal?",
    "options": ["Option 1", "Option 2", "Option 3"]
  }
]
```

---

### `copy.json` → `notifications` Section
**Used for:**
- Live notification messages (bottom-right corner)
- Creates urgency ("John just completed...")

**Change it when:**
- Want different notification text
- Testing different messages
- Making it more relevant to your offer

---

## Creating Multiple Landing Pages

### The Power of Config Files:

**Landing Page #1:**
- `config/copy-offer1.json` → "Weight Loss Quiz"
- `config/theme-offer1.json` → Green colors

**Landing Page #2:**
- `config/copy-offer2.json` → "Career Quiz"
- `config/theme-offer2.json` → Blue colors

**Same code, different config files = Different landing pages!**

---

## Quick Reference: What Each File Controls

| Config File | Controls | Example |
|------------|----------|---------|
| `copy.json` → `hero` | Top section text | Headlines, button |
| `copy.json` → `socialProof` | Testimonials & stats | User quotes, numbers |
| `copy.json` → `quiz` | Quiz questions | Questions, answers |
| `copy.json` → `notifications` | Live messages | "John just completed..." |
| `theme.json` → `colors` | Website colors | Blue, red, green |
| `theme.json` → `typography` | Font sizes | Big, small text |
| `app.json` → `settings` | Feature switches | Show/hide features |

---

## Bottom Line

**Config files = Python dictionaries that control your website**

1. **Edit JSON files** (like editing Python dicts)
2. **Code reads them** (like `dict["key"]`)
3. **Website shows them** (like `print(dict["key"])`)

**Practical use:**
- Change content → Edit `copy.json`
- Change colors → Edit `theme.json`
- Turn features on/off → Edit `app.json`

**No coding needed!** Just edit the JSON files and refresh your browser.

---

## Try It Now!

1. Open `config/copy.json`
2. Change `"title": "Discover Your Perfect Match"` to `"title": "My Custom Title"`
3. Save the file
4. If server is running, refresh browser
5. See your change!

That's how config files work! 🎉

