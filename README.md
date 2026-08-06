# QR Linktree Generator

A self-hosted, open-source Linktree-style link page with built-in QR code generation — built with React, Vite, and Tailwind CSS. Admin-protected editing lets you manage your links without a database or third-party service.

## Features

- 🔗 Linktree-style landing page for your links/socials
- 📱 Built-in QR code generation (via the `qrcode` library) for sharing your page or individual links
- 🔐 Two-tier access control — standard admin and super admin passcodes, plus user account registration & login (Username/Email & Password)
- 📇 Instant vCard (Phone Contact) generation and download
- ⚡ Fast dev/build tooling with Vite
- 🎨 Styled with Tailwind CSS, icons via `lucide-react`
- 🐳 Docker & Docker Compose support for easy deployment
- 🧩 No backend/database required — lightweight, static-friendly deployment

## Tech Stack

- **Frontend:** React 18
- **Build tool:** Vite 5
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** lucide-react
- **QR codes:** qrcode
- **Containerization:** Docker / Docker Compose

## Getting Started

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

### Environment Variables

Copy the example env file and set your own passcodes:

```bash
cp .env.example .env
```

| Variable                     | Description                                  |
| ----------------------------- | --------------------------------------------- |
| `VITE_ADMIN_PASSCODE`        | Passcode for standard admin access            |
| `VITE_SUPER_ADMIN_PASSCODE`  | Passcode for master/super admin access        |

> ⚠️ Never commit your `.env` file or real passcodes to version control.

### Development

Start the local dev server (runs on port `8083`):

```bash
npm run dev
```

Then open [http://localhost:8083](http://localhost:8083) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Running with Docker

The project ships with a `Dockerfile` and `docker-compose.yml` for containerized deployment.

```bash
docker compose up -d --build
```

This builds the app and serves it on **[http://localhost:8083](http://localhost:8083)** (mapped to port `80` inside the container).

To stop the container:

```bash
docker compose down
```

## Project Structure

```
qr/
├── src/                 # Application source code
├── dist/                # Production build output
├── .vscode/             # Editor settings
├── .env.example         # Example environment variables
├── Dockerfile            # Container build definition
├── docker-compose.yml    # Container orchestration
├── index.html            # App entry HTML
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
└── package.json
```

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

No license has been specified yet for this repository. Consider adding a `LICENSE` file (e.g., MIT) to clarify usage terms for contributors and users.

## Author

**UG-SIDHARTH**
[GitHub](https://github.com/UG-SIDHARTH)