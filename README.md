# Day 6 – Quiz App | Django REST + React

Part of Sisira's **100 Projects in 100 Days** portfolio challenge.

## Features

- ✅ Django REST API with FBVs
- ✅ Category & Difficulty filters
- ✅ Shuffled questions
- ✅ Per-question countdown timer (20s)
- ✅ Next / Previous navigation
- ✅ Progress bar
- ✅ Score calculation with answer review
- ✅ Leaderboard (Django model + API)
- ✅ Dark mode
- ✅ Fully responsive UI
- ✅ Django Admin panel

---

## Project Structure

```
quiz-app/
├── backend/
│   ├── quizproject/        # Django project settings & URLs
│   ├── quizapi/            # App: models, views (FBV), serializers
│   ├── seed_data.py        # Populates sample questions
│   ├── requirements.txt
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Quiz.jsx
    │   │   ├── Quiz.css
    │   │   ├── Leaderboard.jsx
    │   │   └── Leaderboard.css
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser

# Seed sample questions (15 questions across 3 categories)
python seed_data.py

python manage.py runserver
```

API available at: `http://127.0.0.1:8000/api/`

| Endpoint | Method | Description |
|---|---|---|
| `/api/questions/` | GET | List questions (filter: category, difficulty, shuffle) |
| `/api/categories/` | GET | List all categories |
| `/api/leaderboard/` | GET | Top 10 scores |
| `/api/leaderboard/` | POST | Submit a score |

Admin: `http://127.0.0.1:8000/admin/`

---

### Frontend

```bash
cd frontend

npm install
npm run dev
```

App available at: `http://localhost:3000`

---

## Resume Point

> Developed a full-stack Quiz Application using React and Django REST Framework featuring category/difficulty filters, randomised questions, per-question timer, score review, leaderboard with persistent storage, dark mode, and responsive UI.

## GitHub Title

`Day 6 - Quiz App | React + Django REST Framework`
