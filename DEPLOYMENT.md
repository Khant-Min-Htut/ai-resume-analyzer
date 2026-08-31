# Deployment Guide

## Architecture
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (NestJS)
- **Database**: MongoDB Atlas (free tier)

---

## 1. MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/database) and create a free account
2. Create a free **M0** cluster (select any cloud provider/region)
3. Under **Database Access**, create a database user:
   - Username: `resume-app-user`
   - Password: (generate a secure password)
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Go to **Database** → **Connect** → **Drivers**
6. Copy the connection string (it looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/...`)
7. Replace `<password>` with the password you created

Save this as `MONGODB_URI` — you'll need it for Render.

---

## 2. Render (Backend)

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-resume-analyzer-api`
   - **Runtime**: Docker
   - **Root Directory**: `backend`
   - **Plan**: Free
5. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | (your MongoDB Atlas connection string) |
   | `JWT_SECRET` | (generate a random 32+ char string) |
   | `GROQ_API_KEY` | (your Groq API key) |
   | `FRONTEND_URL` | (your Vercel frontend URL, e.g. `https://your-app.vercel.app`) |

6. Click **Create Web Service**
7. Wait for the build to complete — your backend URL will be something like `https://ai-resume-analyzer-api.onrender.com`

> **Note**: The free tier spins down after inactivity. First request after idle may take 30-60 seconds.

---

## 3. Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) and sign up / log in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://ai-resume-analyzer-api.onrender.com` |

6. Click **Deploy**

---

## 4. Update Backend CORS

After Vercel deploys, update your backend's `FRONTEND_URL` environment variable on Render with your actual Vercel URL, then redeploy the backend.

---

## Required Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-resume-analyzer?retryWrites=true&w=majority
JWT_SECRET=<random-32-char-string>
GROQ_API_KEY=<your-groq-api-key>
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://ai-resume-analyzer-api.onrender.com
```
