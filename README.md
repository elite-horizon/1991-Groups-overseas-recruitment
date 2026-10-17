# 1991 Group of Companies - Overseas Recruitment & Global Mobility

Official web portal for **1991 Group of Companies**, licensed overseas manpower and recruitment consultancy with dual headquarters in Dubai (UAE) and Visakhapatnam (India).

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

This repository is ready to be hosted on **GitHub Pages** immediately:

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit for 1991 Group website with dynamic JSON config"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** (⚙️) > **Pages** in the left sidebar.
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch`
     - **Branch**: Select `main` and folder `/ (root)`
   - Click **Save**.

3. **Your Site is Live!**:
   - In 1 to 2 minutes, GitHub will publish your site at:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## 🛠️ How to Edit Phone Numbers & Dynamic Stuff (`data/content.json`)

You don't need to touch HTML or code to update phone numbers, emails, addresses, job vacancies, or team members! 
Simply edit `data/content.json`:

### 1. Update Contact Numbers & WhatsApp
Open `data/content.json` and look for the `"contacts"` section:
```json
"contacts": {
  "primaryWhatsApp": "+91 83413 01490",
  "primaryWhatsAppRaw": "918341301490",
  "defaultWhatsAppMessage": "Hello 1991 Group, I am inquiring about overseas job vacancies.",
  "dubaiOffice": {
    "phone": "+971 4 000 0000",
    "phoneRaw": "+9714000000",
    "whatsapp": "+91 83413 01490",
    "whatsappRaw": "918341301490"
  },
  "vizagOffice": {
    "phone": "+91 83413 01490",
    "phoneRaw": "+918341301490",
    "verificationCell": "+91 83413 01490",
    "verificationCellRaw": "918341301490"
  }
}
```
> **Note:**
> - `phone` / `whatsapp`: The formatted number shown to visitors on the website (e.g. `+91 83413 01490`).
> - `phoneRaw` / `whatsappRaw`: Digits only (with country code, no spaces or special symbols) used for direct click-to-call `tel:` and click-to-chat `wa.me/` links.

### 2. Update Email Addresses & Social Links
```json
"emails": {
  "apply": "1991groups@gmail.com",
  "info": "Bodeepallikishan@gmail.com"
},
"social": {
  "instagramDirector": {
    "handle": "@boddepalli.kittu",
    "url": "https://www.instagram.com/boddepalli.kittu?exln=NjVxc3MzMGwxMzlj&utm_source=qr"
  }
}
```

### 3. Add or Edit Job Roles & Categories
In `data/content.json`, find the `"jobRoles"` array. You can add new jobs or change salaries and benefits:
```json
{
  "id": "greenhouse-packing",
  "title": "Greenhouse & Fruit Packing",
  "category": "europe",
  "corridors": "Romania, Poland & Germany (EU)",
  "badge": "Starting ₹1 Lakh",
  "salaryBanner": "National D Visa / TRC Residency • Starting ₹1,00,000 / mo",
  "icon": "potted_plant",
  "features": [
    "Tomato & fruit sorting, packaging, weighing",
    "Free employer furnished accommodation & food",
    "Air ticket & consular visa stamping included"
  ]
}
```

### 4. Edit Migration Corridors & Stats
Update the `"corridors"` and `"stats"` arrays in `data/content.json` to change the highlighted migration corridors, salary tags, or placement metrics.

---

## 📁 Repository Structure

```
├── .nojekyll              # Prevents GitHub Pages Jekyll build issues
├── index.html             # High-converting responsive landing page
├── css/
│   └── style.css          # Design system styling, glassmorphism, animations
├── js/
│   └── app.js             # Dynamic JSON loader, live job search, filter & WhatsApp modal
├── data/
│   └── content.json       # Centralized JSON configuration for all dynamic text & contacts
├── DESIGN.md              # Brand guidelines, color system, and layout specifications
└── README.md              # Hosting & editing guide
```

---

## 🌟 Interactive Features Included

- **One-Click WhatsApp Dispatch**: Candidates can apply for any job role directly via a pre-filled WhatsApp message.
- **Live Search & Category Filtering**: Filter by Europe (EU), Gulf (UAE), and Technical trades, or search by keyword in real time.
- **Candidate FAQ Accordion**: Interactive questions and answers for candidates.
- **Mobile Optimized**: Full responsive layout with mobile drawer navigation.
- **Embedded Fallback System**: Works seamlessly both online (GitHub Pages) and locally (double-clicking `index.html`).
