# 🔥 HeatShield AI

**Advanced Heat Stress Risk Prediction System**

HeatShield AI combines real-time environmental data with individual physiological factors to predict heat stress risk and provide actionable, life-saving recommendations.

## 🏗️ Architecture (Monorepo)

This project is structured as a specific monorepo:

*   **`frontend/`**:  
    **Framework**: React + Vite + TypeScript  
    **UI Library**: Shadcn/UI + TailwindCSS  
    **Role**: Interactive user interface for data input and visualization.

*   **`backend/`**:  
    **Framework**: Flask (Python)  
    **ML Engine**: Scikit-Learn (Random Forest)  
    **Role**: Data processing, risk inference, and recommendation logic.

## 🚀 Deployment

### Backend (Render)
*   **Build Command**: `pip install -r backend/requirements.txt`
*   **Start Command**: `gunicorn backend.app:app`

### Frontend (Vercel)
*   **Root Directory**: `frontend`
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`
