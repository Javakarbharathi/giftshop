# Deployment Guide: Gift Shop Demo

This guide provides step-by-step instructions to host the frontend on Vercel and expose the local backend via ngrok for a client demo.

## Phase 1: Backend Exposure (Local $\rightarrow$ Public)
Since the backend is running on your local machine, we use **ngrok** to create a secure public URL.

1. **Install ngrok**:
   - Download and install from [ngrok.com](https://ngrok.com/).
   - Sign up for a free account to get your `authtoken`.
2. **Authenticate ngrok**:
   - Run this command in your terminal (replace `YOUR_AUTHTOKEN` with the one from your ngrok dashboard):
     ```bash
     ngrok config add-authtoken YOUR_AUTHTOKEN
     ```
3. **Start the Backend**:
   - Navigate to `giftshop_backend` and start your Django server:
     ```bash
     python manage.py runserver 8000
     ```
4. **Start ngrok Tunnel**:
   - Open a new terminal and run:
     ```bash
     ngrok http 8000
     ```
   - **Important**: Copy the `Forwarding` URL (e.g., `https://a1b2-c3d4.ngrok-free.app`). This is your **Public Backend URL**.

---

## Phase 2: Frontend Deployment (Vercel)

### 1. Prepare the Code
The frontend currently uses a hardcoded local URL. We need to make it dynamic for Vercel.
- In `giftshop_frontend/src/api.js`, change:
  `const API_URL = 'http://127.0.0.1:8000/api/';` 
  $\rightarrow$ `const API_URL = import.meta.env.VITE_API_URL;`

### 2. Push to GitHub
1. Create a new repository on GitHub (e.g., `giftshop-frontend`).
2. Push your `giftshop_frontend` folder to this repo:
   ```bash
   git init
   git add .
   git commit -m "Prepare for deployment"
   git remote add origin https://github.com/Javakarbharathi/giftshop-frontend.git
   git push -u origin master
   ```

### 3. Deploy to Vercel
1. Log in to [vercel.com](https://vercel.com/).
2. Click **"Add New"** $\rightarrow$ **"Project"**.
3. Import your `giftshop-frontend` repository from GitHub.
4. **Configure Project**:
   - **Framework Preset**: Vite (should be auto-detected).
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: `https://your-ngrok-url.ngrok-free.app/api/` (The URL from Phase 1 + `/api/`)
5. Click **"Deploy"**.

---

## Phase 3: Final Verification & Demo
1. Vercel will provide a production URL (e.g., `giftshop-frontend.vercel.app`).
2. Open this link in your browser.
3. Ensure the backend is still running locally and the ngrok tunnel is active.
4. **Client Demo**: Share the Vercel link with the client.

**Note:** Ngrok free tunnels expire or change URLs if restarted. For the 2-hour window, keep the terminal open. If the link changes, update the `VITE_API_URL` in Vercel Project Settings $\rightarrow$ Environment Variables and redeploy.
