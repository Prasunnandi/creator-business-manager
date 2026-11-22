# Creator Business & Collaboration Manager (`CreatorDesk` + `DealRadar`)

[![NodeJS](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade **Creator Sponsorship CRM and Deal Flow Engine** that merges brand relationship management, inbound lead qualification, contract execution, deliverable tracking, automated invoicing, and payout verification into one unified workspace.

---

## 🌟 Standout Feature: End-to-End Deal Progression Tracker

Unlike generic sales CRMs, CreatorDesk provides a tailored **6-stage sponsorship milestone tracker**:
1. **Brand Inquiry**: Inbound agency outreach & brand campaign scoping.
2. **Rate & Deliverable Negotiation**: CPM pricing, dedicated segments, licensing rights, and exclusivity clauses.
3. **Master Services Agreement (MSA)**: Executed legal contracts & SOWs.
4. **Content Production & Delivery**: Asset drafting, sponsor review previews, and live video publishing.
5. **Automated Invoicing**: Automatic trigger of Net 30 invoices on air date with unique invoice numbering.
6. **Payment Clearance**: Wire / ACH settlement tracking with real-time revenue analytics.

Creators can advance any deal along its milestone path with a single click, instantly updating contract dates, invoice records, and pipeline forecasts.

---

## 🏗️ Architecture

```
                                  ┌──────────────────────────────┐
                                  │   React 18 + Tailwind UI     │
                                  │  - End-to-End Deal Tracker   │
                                  │  - 6-Stage Kanban Pipeline   │
                                  │  - Brand CRM Directory       │
                                  │  - Invoicing & Payout Ledger │
                                  └──────────────┬───────────────┘
                                                 │ HTTP / JSON
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │   Express REST API Gateway   │
                                  │        (/api/v1/*)           │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   ▼                             ▼                             ▼
       ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
       │   Deal Progression   │      │   Brand CRM Directory│      │   Revenue Analytics  │
       │  - Milestone Audits  │      │  - Sponsor Tiers     │      │  - Active Pipeline   │
       │  - Auto-Invoicing    │      │  - Historic Deal Size│      │  - YTD Yield & CPM   │
       └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

---

## 🚀 Quickstart

### Option 1: Docker Compose (Recommended)
```bash
git clone https://github.com/Prasunnandi/creator-business-manager.git
cd creator-business-manager
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- API Backend: `http://localhost:5001/api/v1/health`

### Option 2: Local Development

#### 1. Backend (Express)
```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/deals` | `GET` / `POST` | Query all sponsorship deals or log a new brand lead |
| `/api/v1/deals/:id/advance-stage` | `PATCH` | **Standout Feature**: Move deal to next lifecycle milestone and update artifacts |
| `/api/v1/brands` | `GET` | View verified sponsor brands, tiers, and contacts |
| `/api/v1/analytics` | `GET` | Calculate active pipeline value, pending invoices, and YTD revenue |

---

## 📜 License
Distributed under the MIT License.
