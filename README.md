# BioLink QR — Open Source Linktree & QR Code Studio

A self-hosted, open-source Linktree-style digital bio card page with built-in QR code generation, theme styling, vCard contact downloads, and multi-user administration — built with React 18, Vite 5, Tailwind CSS, and Vitest.

---

## ⚡ Features

- 🔗 **Standalone Bio Link Cards**: Clean, modern digital bio pages showcasing social profiles, custom links, tags, and portfolio items.
- 🏠 **Homescreen & Landing Page**: Hero section with interactive feature tiles, quick card creation, and brand navigation.
- 📱 **QR Code Studio & Generator**: Instant QR code generation powered by `qrcode` with:
  - Mode toggles: Public Linktree URL vs Mobile Contact vCard.
  - Foreground & background color pickers + Quick Palette Presets (*Cyber Purple*, *Emerald Neon*, *Ocean Cyan*, *Sunset Coral*, *Dark Gold*, *Classic Black*).
  - Error Correction Level (ECC) selector (`L`, `M`, `Q`, `H`).
  - Customizable center logo/emoji overlay.
  - One-click **PNG Image**, **Vector SVG**, and **Clipboard Copy** exports.
- 🎨 **11+ Premium Theme Presets**:
  - *Midnight Glass*, *Cyber Neon*, *Emerald Luxe*, *Sunset Glow*, *Retro Wave*, *Solar Flare*, *Minimalist Dark*, *Clean Light*, *Aurora Borealis*, *Cyberpunk Neon*, and *Nordic Frost*.
- 📇 **Instant vCard Generation**: Scans or downloads `.vcf` phone contact files directly into iOS/Android address books.
- 🌐 **Zero-Backend URL Payload Sharing**: Full profile encoding into URL hash parameters (`?p=...`) for instant sharing without third-party servers or databases.
- 🔐 **Admin & Directory Roster**:
  - Passcode-protected admin access (`VITE_ADMIN_PASSCODE` & `VITE_SUPER_ADMIN_PASSCODE`).
  - User registration & login.
  - CSV import/export for bulk organization directories.
- 🧪 **Comprehensive Test Suite & Zero-Warning Linting**: 100% passing Unit & integration tests powered by **Vitest**, **React Testing Library**, and **ESLint 9**.
- 🐳 **Docker Containerization**: Includes `Dockerfile` and `docker-compose.yml` for effortless deployment.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, HTML5, CSS3
- **Build System:** Vite 5
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** `lucide-react`
- **QR Engine:** `qrcode`
- **Testing:** Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- **Linter:** ESLint 9 (`eslint.config.js`) — 0 errors, 0 warnings
- **Deployment:** Docker & Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/UG-SIDHARTH/qr.git
cd qr

# Install dependencies
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and configure your access passcodes:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_ADMIN_PASSCODE` | Passcode for standard admin access | `123456` |
| `VITE_SUPER_ADMIN_PASSCODE` | Master passcode for super admin panel | `31072007` |

---

## 💻 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the Vite local development server on `http://localhost:8083` |
| `npm run build` | Bundles production assets into the `dist/` directory |
| `npm run preview` | Serves the production `dist/` build locally |
| `npm test` | Runs the unit & component test suite with Vitest |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run lint` | Runs ESLint 9 static code analysis |

---

## 🧪 Testing & Code Quality

### Running Unit & Component Tests

```bash
npm test
```

Test suite coverage (13 passed out of 13 tests):
- **`url.test.js`**: Profile hash resolution, UTF-8 Base64 encoding & decoding.
- **`vcard.test.js`**: vCard v3.0 text formatting.
- **`csv.test.js`**: CSV line parsing & member directory mapping.
- **`Header.test.jsx`**: React component navigation rendering.

### Code Quality Audit (`npm run lint`)

Static analysis is verified using ESLint 9 flat configuration with **0 errors and 0 warnings**:

```bash
npm run lint
```

---

## 🐳 Docker Deployment

To build and run the application inside a container:

```bash
# Build and start container in detached mode
docker compose up -d --build
```

The application will be accessible at **`http://localhost:8083`** (mapped to port `80` inside NGINX).

To stop the container:

```bash
docker compose down
```

---

## 📁 Project Structure

```text
qr/
├── src/
│   ├── components/
│   │   ├── Admin/         # Bulk directory & QR export dashboard
│   │   ├── Editor/        # Profile, Socials, Portfolio, Theme, QR tabs
│   │   ├── Modals/        # Auth, Export, QR, and Publish modals
│   │   ├── Preview/       # BioPage, PhoneMockup, WelcomeLanding
│   │   └── __tests__/     # React component test suites
│   ├── data/              # Default profile & theme presets data
│   ├── test/              # Vitest setup file
│   └── utils/             # URL encoding, vCard, and CSV helpers
│       └── __tests__/     # Utility unit tests
├── dist/                  # Production build output
├── .env                   # Local environment passcodes (git-ignored)
├── .env.example           # Environment template
├── Dockerfile             # Container definition
├── docker-compose.yml     # Docker orchestration
├── eslint.config.js       # ESLint 9 flat configuration
├── index.html             # App HTML entrypoint
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite & Vitest configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👤 Author

**UG-SIDHARTH**
- GitHub: [@UG-SIDHARTH](https://github.com/UG-SIDHARTH)