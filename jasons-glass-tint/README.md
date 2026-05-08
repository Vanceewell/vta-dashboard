# Jason's Glass Tint — Website

Premium luxury website for Jason's Glass Tint, San Clemente, CA.

Built with: **Next.js 14** · **Tailwind CSS** · **Framer Motion** · **Supabase** · **TypeScript**

---

## 🚀 Quick Deploy (Vercel — Recommended)

### 1. Push to GitHub

```bash
cd jasons-glass-tint
git init
git add .
git commit -m "Initial: Jason's Glass Tint website"
git remote add origin https://github.com/YOUR_USERNAME/jasons-glass-tint.git
git push -u origin main
```

> If you're using the `vta-dashboard` repo, the project is already inside it as the `jasons-glass-tint/` folder.

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Set **Root Directory** to `jasons-glass-tint`
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site is live at `your-project.vercel.app`

### 3. Connect Custom Domain

1. Vercel Dashboard → Domains → Add `jasonsglasstint.com`
2. Add the DNS records Vercel provides to your domain registrar
3. SSL is automatic via Let's Encrypt

---

## 🗄️ Supabase Gallery Setup

The gallery system uses Supabase for image storage and metadata.

### Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. New Project → choose a name (e.g., `jasons-glass-tint`)
3. Set a strong database password

### Step 2: Create the Storage Bucket

1. Supabase Dashboard → **Storage** → **New Bucket**
2. Name: `gallery`
3. Toggle **Public bucket: ON**
4. File size limit: `10485760` (10MB)
5. Allowed MIME types: `image/jpeg, image/png, image/webp`

### Step 3: Run the Database Schema

1. Supabase Dashboard → **SQL Editor**
2. Open `supabase/schema.sql` from this repo
3. Copy all contents → paste → **Run**

### Step 4: Get Your Credentials

1. Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (safe to use in frontend)

### Step 5: Add Environment Variables

**For local development:**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**For Vercel deployment:**
1. Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `NEXT_PUBLIC_SITE_URL` = `https://jasonsglasstint.com`
3. Redeploy the project

---

## 📸 How to Upload Gallery Images

1. Go to `/admin-gallery` on your deployed site
2. Drag and drop photos into the upload zone (or click to browse)
3. Set a title and category for each image
4. Click **Upload All** or upload individually
5. Images are automatically compressed to 1200px max width, 85% JPEG quality
6. Uploaded images immediately appear in the public gallery

### Categories available:
- `automotive`
- `residential`
- `commercial`
- `marine`
- `rv`
- `frost`
- `safety film`

---

## ✏️ How to Edit Content

All editable content is marked with `// AI-EDITABLE:` comments in the source.

### Key content locations:

| What to edit | File |
|---|---|
| Business name, phone, location | `src/app/layout.tsx` |
| Hero headline & subtext | `src/components/HeroSection.tsx` |
| Trust stats (years, windows, etc.) | `src/components/TrustSection.tsx` |
| Services list & descriptions | `src/components/ServicesSection.tsx` |
| About Jason story & bio | `src/components/AboutSection.tsx` |
| Customer reviews | `src/components/ReviewsSection.tsx` |
| Film benefits & percentages | `src/components/FilmBenefitsSection.tsx` |
| Service areas | `src/components/ServiceAreaSection.tsx` |
| Footer links & contact | `src/components/Footer.tsx` |
| Site colors & fonts | `tailwind.config.ts` |
| Global CSS | `src/app/globals.css` |
| SEO metadata | `src/app/layout.tsx` |
| Sitemap URLs | `public/sitemap.xml` |

### Adding a new review:

Open `src/components/ReviewsSection.tsx` and add to the `REVIEWS` array:

```tsx
{
  name:     'Customer Name',
  location: 'City, CA',
  stars:    5,
  date:     'Month Year',
  text:     'Review text here...',
  service:  'Service Type',
},
```

### Changing the phone number:

Search for `9494968468` across all files and replace. Or use:
```bash
grep -r "9494968468" src/ --include="*.tsx" -l
```

---

## 🏙️ How to Add a New SEO City Page

1. Create a new directory: `src/app/your-city-window-tint/`
2. Create `page.tsx` in that directory
3. Copy the structure from an existing city page (e.g., `talega-window-tint/page.tsx`)
4. Update: metadata, hero content, sections, FAQs, relatedLinks
5. Add the URL to `public/sitemap.xml`
6. Add a link in `src/components/Footer.tsx` under `AREA_LINKS`
7. Add a link in `src/components/ServiceAreaSection.tsx` under `AREAS`

---

## 🎨 How to Change Colors or Fonts

Edit `tailwind.config.ts`:

```ts
colors: {
  jgt: {
    gold: {
      DEFAULT: '#C5A056',  // Change this for the main accent color
    },
    bg:      '#0F0F0F',  // Main background
    surface: '#1A1A1A',  // Card backgrounds
    text:    '#F0EDE8',  // Main text color
  }
}
```

Edit `src/app/globals.css` to update the CSS variables that mirror the theme.

---

## 🔒 Admin Security (Optional)

The `/admin-gallery` page has no authentication in the current build. To add basic security:

### Option 1: Password protection via Vercel
Use Vercel's "Password Protection" feature (available on Pro plan).

### Option 2: Add a simple password check
In `src/app/admin-gallery/page.tsx`, add a password state at the top:

```tsx
const [auth, setAuth] = useState(false);
const [pw, setPw] = useState('');
if (!auth) return (
  <div>
    <input value={pw} onChange={e => setPw(e.target.value)} type="password" />
    <button onClick={() => setAuth(pw === 'your-secret-password')}>Enter</button>
  </div>
);
```

### Option 3: Supabase Auth (recommended for production)
Enable Supabase Auth and update the RLS policies to require an authenticated user for writes.

---

## 📊 SEO Strategy Summary

The site targets these keywords naturally throughout content:

**Primary:** `window tint San Clemente`, `window tinting San Clemente`
**Secondary:** `automotive window tint`, `residential window tint`, `commercial tint Orange County`, `marine tint San Clemente`
**City pages:** `Talega window tint`, `Dana Point window tint`, `San Juan Capistrano window tint`

**Technical SEO:**
- `LocalBusiness` schema in `layout.tsx`
- `FAQPage` schema on relevant pages
- `sitemap.xml` at `/public/sitemap.xml`
- `robots.txt` at `/public/robots.txt`
- Open Graph tags on every page
- Canonical URLs on every page
- Lazy-loaded images throughout
- Mobile-first responsive design

**After deploying:** Submit the sitemap to Google Search Console:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → your domain
3. Sitemaps → Add: `https://jasonsglasstint.com/sitemap.xml`

---

## 🛠️ Local Development

```bash
cd jasons-glass-tint
npm install
cp .env.example .env.local
# Edit .env.local with Supabase credentials (optional for local dev)
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
jasons-glass-tint/
├── public/
│   ├── sitemap.xml           # Submit to Google Search Console
│   └── robots.txt            # Search engine instructions
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout + SEO + LocalBusiness schema
│   │   ├── page.tsx          # Homepage (imports all sections)
│   │   ├── globals.css       # Global styles + fonts
│   │   ├── admin-gallery/    # Gallery upload system
│   │   ├── automotive-window-tint/
│   │   ├── residential-window-tint/
│   │   ├── commercial-window-tint/
│   │   ├── marine-window-tint/
│   │   ├── san-clemente-window-tint/
│   │   ├── talega-window-tint/
│   │   ├── dana-point-window-tint/
│   │   └── san-juan-capistrano-window-tint/
│   ├── components/           # All UI components (modular, AI-editable)
│   └── lib/
│       └── supabase.ts       # Supabase client + gallery functions
├── supabase/
│   └── schema.sql            # Database schema — run once in SQL Editor
├── .env.example              # Copy to .env.local, add credentials
├── tailwind.config.ts        # Theme: colors, fonts, spacing
├── next.config.js            # Next.js configuration
└── README.md                 # This file
```

---

## 💡 Tips for Future AI Agents

- All major sections are modular components in `src/components/` — edit them independently
- Content marked `// AI-EDITABLE:` is safe to modify without breaking anything structural
- The LandingPageTemplate component in `src/components/LandingPageTemplate.tsx` powers all 8 SEO landing pages — edit it once to update the layout for all pages simultaneously
- Color tokens are defined in both `tailwind.config.ts` AND `globals.css` (CSS variables) — update both when changing the color scheme
- The gallery shows Unsplash placeholder images by default; these are replaced by real uploaded images once Supabase is configured
- New services can be added by inserting into the `SERVICES` array in `ServicesSection.tsx`

---

*Built with care for Jason's Glass Tint — San Clemente, California*
