# 🚀 TalentAI – Candidate Shortlisting System

A full-stack AI-powered candidate shortlisting system built with React + Node.js + MongoDB + OpenRouter AI.

---

## 📁 Project Structure

```
candidate-shortlisting/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── server.js
│   ├── models/
│   │   └── Candidate.js
│   ├── routes/
│   │   ├── candidates.js
│   │   ├── match.js
│   │   └── ai.js
│   ├── .env          ← ⚠️ Add your API key here
│   └── package.json
├── frontend/         ← React app
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── utils/api.js
│   ├── .env
│   └── package.json
└── README.md
```

---

## ⚙️ Step-by-Step Setup

### Step 1: Prerequisites
Make sure you have installed:
- Node.js (v18+): https://nodejs.org
- MongoDB Community: https://www.mongodb.com/try/download/community
- Git (optional): https://git-scm.com

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Open `backend/.env` and set your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/candidate_shortlisting
OPENROUTER_API_KEY=sk-or-your-key-here
```

👉 Get your OpenRouter API key from: https://openrouter.ai/workspaces/default/keys

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### Step 3: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

App opens at: http://localhost:3000

---

## 🌐 Deployment

### Option A: Deploy on Render (Free, Recommended)

#### Deploy Backend on Render:

1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI` → Use MongoDB Atlas (see below)
   - `OPENROUTER_API_KEY` → your key
6. Click **Deploy**

#### MongoDB Atlas (Free Cloud DB):
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string like: `mongodb+srv://user:pass@cluster.mongodb.net/candidate_shortlisting`
4. Use that as `MONGODB_URI`

#### Deploy Frontend on Render (or Vercel/Netlify):

1. Add `.env` in frontend with your backend URL:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
2. Go to Render → New → Static Site
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/build`

### Option B: Deploy on Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel:
```bash
npm install -g vercel
cd frontend
vercel
```
Set env var `REACT_APP_API_URL` to your backend URL.

#### Backend on Railway:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Set root to `backend/`
4. Add env vars

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/candidates | Add a candidate |
| GET | /api/candidates | Get all candidates |
| DELETE | /api/candidates/:id | Delete a candidate |
| POST | /api/match | Basic skill matching |
| POST | /api/ai/shortlist | AI-based shortlisting |
| POST | /api/ai/interview-questions | Generate interview questions |

---

## 🧪 Test API (using curl)

```bash
# Add a candidate
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","email":"rahul@gmail.com","skills":["React","Node.js","MongoDB"],"experience":2}'

# Match candidates
curl -X POST http://localhost:5000/api/match \
  -H "Content-Type: application/json" \
  -d '{"requiredSkills":["React","Node.js"],"minExperience":1}'

# AI shortlist
curl -X POST http://localhost:5000/api/ai/shortlist \
  -H "Content-Type: application/json" \
  -d '{"requiredSkills":["React","Node.js"],"minExperience":1,"jobTitle":"Frontend Developer"}'
```

---

## 🤖 OpenRouter Model Used
- `openai/gpt-4o-mini` (fast and cost-effective)
- Change in `backend/routes/ai.js` to use other models

---

## 📦 Tech Stack
- **Frontend**: React 18, Recharts, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **AI**: OpenRouter API (GPT-4o-mini)
- **Deployment**: Render / Vercel / Railway
