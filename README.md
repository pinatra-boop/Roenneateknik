# Rønne Autoteknik – Komplet Website System

Premium full-stack hjemmeside til Rønne Autoteknik. Bygget med Next.js 15, TypeScript, TailwindCSS v4, Framer Motion, Prisma og NextAuth.

---

## 🚀 Hurtig start

### 1. Forudsætninger

- Node.js 18+ (anbefalet 20+)
- PostgreSQL database (lokal eller cloud)
- SMTP email-adgang (Gmail, SendGrid, etc.)

### 2. Installation

```bash
cd app
npm install
```

### 3. Miljøvariabler

```bash
cp .env.example .env.local
```

Rediger `.env.local` – minimum påkrævet:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ronne_autoteknik"
NEXTAUTH_SECRET="minimum-32-tegn-hemmelig-noegle"
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="din@gmail.com"
SMTP_PASS="app-adgangskode"
WORKSHOP_EMAIL="info@ronneautoteknik.dk"
```

### 4. Database opsætning

```bash
npm run db:generate   # Generer Prisma client
npm run db:push       # Skub schema til database
npm run db:seed       # Opret admin bruger + demo-data
```

**Admin login:**
- Email: `admin@ronneautoteknik.dk`
- Kodeord: `admin123!` ← SKIFT I PRODUKTION

### 5. Start

```bash
npm run dev
```

- Hjemmeside: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 📁 Projektstruktur

```
app/
├── prisma/schema.prisma       # Database schema
├── scripts/seed.ts            # Database seed
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Forside
│   │   ├── booking/           # Booking system
│   │   ├── brugte-biler/      # Brugtbilssalg
│   │   ├── kontakt/           # Kontaktformular
│   │   ├── om-os/             # Om os
│   │   ├── services/          # Services
│   │   ├── admin/             # CMS Dashboard
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── BookingForm.tsx    # 3-trins booking
│   │   ├── CookieBanner.tsx
│   │   ├── sections/          # Forside-sektioner
│   │   └── admin/             # Admin UI
│   └── lib/
│       ├── prisma.ts          # DB client
│       ├── auth.ts            # NextAuth
│       ├── email.ts           # Email service
│       └── licensePlate.ts    # Nummerplade API
└── .env.local
```

---

## 🗃️ Database modeller

| Model | Beskrivelse |
|-------|-------------|
| `User` | Admin brugere |
| `Booking` | Kunders bookinger med biloplysninger |
| `Service` | Serviceydelser med priser |
| `Car` | Brugte biler til salg |
| `Contact` | Kontaktformular-beskeder |
| `BlockedDate` | Lukkede datoer/tider |
| `Review` | Kundeanmeldelser |
| `Campaign` | Tilbud og kampagner |

---

## 📅 Booking System

- 3-trins flow: Service → Bil (nummerpladeOpslag) → Kontaktinfo
- Automatisk hentning af biloplysninger via nummerplade
- Real-time tilgængelighed – dobbeltbooking forhindres
- Email-bekræftelse til både kunde og værksted
- Admin kan låse dage til ferie/sygdom

### Nummerplade API
Systemet forsøger automatisk (ingen API-nøgle nødvendig i første omgang):
1. nummerplade.net (gratis)
2. DMR API (med `DMR_API_KEY` i .env.local)

---

## 📧 Email

**Gmail setup:**
1. Aktivér 2-faktor på din Google-konto
2. Gå til Konto → Sikkerhed → App-adgangskoder
3. Generer adgangskode og brug som `SMTP_PASS`

**Produktion:** Brug Resend.com eller SendGrid for bedre leveringsrate.

---

## 🚢 Deployment

### Vercel (anbefalet)
```bash
npm i -g vercel
vercel
```
Tilføj miljøvariabler i Vercel Dashboard.

### Railway
1. Opret projekt på railway.app
2. Tilføj PostgreSQL service
3. Kopier DATABASE_URL til miljøvariabler
4. Deploy

### VPS/Docker
```bash
npm run build
npm start
```

---

## 🔒 Sikkerhed – tjekliste til produktion

- [ ] Skift admin adgangskode
- [ ] Sæt stærk NEXTAUTH_SECRET (32+ tegn)
- [ ] Brug HTTPS (automatisk på Vercel)
- [ ] Tilføj rate limiting
- [ ] Sæt NODE_ENV=production

---

## 🛠️ Tilpasning

**Farvetema** – redigér `src/app/globals.css`:
```css
--color-accent: #e8931a;   /* Orange */
--color-primary: #0f2d5a;  /* Mørkeblå */
```

**Åbningstider** – redigér `TIME_SLOTS` i `BookingForm.tsx`

**Services** – tilføj via `npm run db:studio` eller admin-panel
