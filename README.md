# CommunityPulse AI

> **Making Communities Smarter Through AI-Powered Civic Intelligence**

CommunityPulse AI is an AI-powered civic issue reporting platform developed for the **Gen AI Academy APAC Hackathon** under the theme:

**AI for Better Living and Smarter Communities**

The platform enables citizens to report civic issues by uploading images and descriptions. Using Google's Gemini AI, the application analyzes reports, classifies issues, estimates severity, recommends responsible departments, and provides authorities with an analytics dashboard for smarter decision-making.

---

## Live Demo

**Deployed Application:**

https://asset-manager--chaharamit917.replit.app/

---

## Problem Statement

Traditional civic complaint systems are often slow, manual, and inefficient.

CommunityPulse AI addresses this challenge by using Artificial Intelligence to automate complaint analysis, prioritize issues, and provide actionable insights for authorities.

---

## Features

- AI-powered image analysis using Google Gemini
- Automatic complaint classification
- AI-generated complaint title and summary
- Priority and severity prediction
- Department recommendation
- Suggested corrective actions
- Environmental impact assessment
- Complaint management dashboard
- Admin panel for monitoring reports
- Search and filtering
- Interactive analytics charts
- Responsive modern UI

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express

### AI

- Google Gemini API

### Database

- PostgreSQL (Drizzle ORM)

### Deployment

- Replit
- Compatible architecture for Google Cloud Run

---

## Project Structure

```
artifacts/
├── community-ai/      # React Frontend
├── api-server/        # Express Backend

lib/
├── api-client-react/
├── api-spec/
├── api-zod/
└── db/

scripts/

package.json
pnpm-workspace.yaml
```

---

## How It Works

1. User uploads an image of a civic issue.
2. User provides a short description.
3. Google Gemini analyzes the image and text.
4. AI classifies the issue.
5. The system predicts severity and urgency.
6. Responsible department is recommended.
7. Complaint is stored and displayed on the dashboard.
8. Authorities monitor and manage reports through the admin panel.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/rakshachahar/CommunityPulseAI-Hackathon.git
```

Install dependencies:

```bash
pnpm install
```

Run the application:

```bash
pnpm dev
```

---

## Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## Future Improvements

- Real-time notifications
- Regional language support
- Voice-based complaint reporting
- GIS heatmap visualization
- Mobile application
- IoT integration
- Predictive civic maintenance
- AI chatbot assistant

---

## Impact

CommunityPulse AI helps improve civic governance by:

- Reducing manual complaint processing
- Improving response prioritization
- Supporting data-driven decisions
- Increasing transparency
- Enhancing citizen engagement

---

## Team

**Team Name:** Byte Babes

**Project:** CommunityPulse AI

---

## License

This project was developed for the **Gen AI Academy APAC Hackathon** for educational and demonstration purposes.
