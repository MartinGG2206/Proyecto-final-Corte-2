# Marketopos (FastAPI + Angular)
1) BD: abre phpMyAdmin y ejecuta marketopos_db.sql
2) Backend:
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   copy .env.example .env
   uvicorn app.main:app --reload --port 8000
3) Frontend:
   cd ../frontend
   npm install
   npm start
Abrir http://localhost:4200
