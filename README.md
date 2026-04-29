<div align="center">
  <br />
  <h1>VaultX</h1>
  <p><b>Monetization that respects the audience. Turn shared files into earning links.</b></p>
</div>

---

## 📖 Overview

**VaultX** is a modern platform that allows creators and users to seamlessly monetize their file sharing. Upload any file, share your generated secure link, and earn revenue whenever someone unlocks your content. Built for scale and transparency, VaultX features smart access controls, fair friction, and a stunning, high-performance user interface.

## ✨ Key Features

- **Smart Access Control:** Enforce unlock rules automatically. Access is granted only when conditions are met, without manual intervention.
- **Earnings Per Unlock:** Every successful file access generates revenue for the uploader, credited transparently.
- **Friction That Feels Fair:** Viewers unlock content through a simple, respectful flow that maintains trust.
- **Massive File Support:** Configured to handle ultra-large file uploads (up to 250GB) securely.
- **Cinematic Experience:** Fluid, GSAP-powered scroll animations, 3D data visualizations (Three.js/React-Globe), and accessible Radix UI components.
- **Secure Cloud Storage:** Backed by robust Backblaze B2 cloud storage integration.

## 🚀 Technology Stack

### Frontend (`/vaultx-frontend`)
- **Framework:** Next.js (App Router) & React 18
- **Styling:** Tailwind CSS
- **Animations:** GSAP (ScrollTrigger), Three.js, React-Globe.gl
- **Data Vis:** D3.js, Recharts
- **Components:** Radix UI, Headless UI, Lucide Icons

### Backend (`/vaultx-backend`)
- **Framework:** Fastify
- **Language:** TypeScript
- **Storage:** Backblaze B2 Cloud Storage API
- **Utilities:** `@fastify/multipart`, `@fastify/cors`

## 📂 Project Structure

```text
VaultX/
├── vaultx-frontend/       # Next.js web application
│   ├── app/               # Next.js 13+ App Router pages (admin, dashboard, vault, etc.)
│   ├── components/        # Reusable React components
│   ├── lib/               # Utility functions and animation helpers
│   └── public/            # Static assets
└── vaultx-backend/        # Fastify API server
    ├── src/
    │   ├── routes/        # API endpoints (upload, download, file handling)
    │   ├── services/      # Business logic and B2 integration
    │   ├── types/         # TypeScript type definitions
    │   └── utils/         # Helper functions
    └── package.json
```

## 🛠 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) account and credentials

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vaultx.git
cd VaultX
```

### 2. Setup the Backend

```bash
cd vaultx-backend
npm install
```

Create a `.env` file in the `vaultx-backend` directory and add your required variables (e.g., B2 keys, PORT=3001).

```bash
npm run dev
# The backend will start on http://localhost:3001
```

### 3. Setup the Frontend

Open a new terminal window:

```bash
cd vaultx-frontend
npm install
```

Create a `.env` file in the frontend directory if needed (e.g., pointing `NEXT_PUBLIC_API_URL` to `http://localhost:3001`).

```bash
npm run dev
# The frontend will start on http://localhost:3000
```

## 📜 License

This project is licensed under the ISC License.
