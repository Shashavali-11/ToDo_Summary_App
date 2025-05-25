# Todo Summary App (Simple Guide)

This is a full-stack Todo app where you can add, view, and delete tasks. It also creates a short summary of your tasks using Cohere (an AI service) and sends the summary to a Slack channel.

---

## 📁 Project Structure

- `frontend/` – React app for user interface
- `backend/` – Express server with Firebase, Cohere, and Slack setup
- `.env.example` – Example file for environment variables

---

## 🚀 Getting Started

### ✅ What You Need First

- Node.js (v16 or higher)
- A Firebase project (with Firestore)
- Cohere API key ([https://cohere.ai/](https://cohere.ai/))
- Slack workspace (with a webhook URL)
- Git

### 🧾 Clone the Project

```bash
git clone https://github.com/your-username/todo-summary-app.git
cd todo-summary-app
```

---

## 🛠️ Backend Setup

1. Go to backend folder and install packages:

```bash
cd backend
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and add your details:

- `COHERE_API_KEY` – Get it from cohere.ai
- `SLACK_WEBHOOK_URL` – Create one in Slack and paste here
- `GOOGLE_APPLICATION_CREDENTIALS` – Path to Firebase admin JSON file

4. Add your Firebase admin JSON file to the backend folder.

5. Start the backend:

```bash
npm start
```

Backend runs at `http://localhost:5000`.

---

## 💻 Frontend Setup

1. Open another terminal and go to frontend:

```bash
cd frontend
npm install
npm start
```

2. React app runs at `http://localhost:3000`.

---

## ⚙️ Environment Variables Example

```
COHERE_API_KEY=your-cohere-api-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook
GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json
PORT=5000
```

---

## 🔧 Slack & Cohere Setup

### Slack Webhook

- Go to [Slack Webhooks](https://api.slack.com/messaging/webhooks) and make one.
- Paste the URL into your `.env` file.

### Cohere API

- Sign up at [cohere.ai](https://cohere.ai) and get your API key.
- Paste the key into your `.env` file.

---

## 📐 Design Highlights

- Express + Firebase for backend
- Cohere AI for summaries
- Slack Webhook for notifications
- React frontend for managing todos
- Uses `.env` to keep secrets safe

---

## 🌍 Deployment

You can deploy it on:

- Backend: Render, Heroku, Vercel functions, etc.
- Frontend: Netlify, Vercel, Firebase Hosting

Make sure to add the right environment variables.

---

## 📄 License

This project uses the MIT License.

---

Need help with `.env` file or deployment? Just ask!