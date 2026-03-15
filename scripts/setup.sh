#!/usr/bin/env bash
set -euo pipefail

echo "==> Setting up AuthKnot development environment"

# Backend
echo "==> Installing backend dependencies"
cd backend
pip install -r requirements.txt -r requirements-dev.txt
cd ..

# Frontend operator console
echo "==> Installing frontend dependencies"
cd frontend/operator-console
npm install
cd ../..

echo "==> Setup complete!"
echo "    Backend:  cd backend && uvicorn app.main:app --reload"
echo "    Frontend: cd frontend/operator-console && npm run dev"
