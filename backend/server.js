// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import admin from 'firebase-admin';
// import  { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { CohereClient } from 'cohere-ai';
// import axios from 'axios';
// // console.log(path);

// dotenv.config(); // Load .env



// console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY);
// console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL);


// if (!process.env.SLACK_WEBHOOK_URL) {
//   throw new Error('SLACK_WEBHOOK_URL is missing!');
// }
// if (!process.env.COHERE_API_KEY) {
//   throw new Error('COHERE_API_KEY is missing!');
// }


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;
// const TODOS_COLLECTION = 'todos';

// const serviceAccount = JSON.parse(
//   Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString('utf8')
// );

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// // Cohere Client
// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY,
// });

// // Endpoints

// app.get('/todos', async (req, res) => {
//   try {
//     const snapshot = await db.collection(TODOS_COLLECTION).get();
//     const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(todos);
//   } catch (err) {
//     console.error("Error fetching todos:", err.message);
//     res.status(500).json({ error: "Failed to fetch todos" });
//   }
// });

// app.post('/todos', async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ error: "Text is required" });

//   try {
//     const docRef = await db.collection(TODOS_COLLECTION).add({ text });
//     res.status(201).json({ id: docRef.id, text });
//   } catch (err) {
//     console.error("Error adding todo:", err.message);
//     res.status(500).json({ error: "Failed to add todo" });
//   }
// });

// app.delete('/todos/:id', async (req, res) => {
//   try {
//     await db.collection(TODOS_COLLECTION).doc(req.params.id).delete();
//     res.status(204).send();
//   } catch (err) {
//     console.error("Error deleting todo:", err.message);
//     res.status(500).json({ error: "Failed to delete todo" });
//   }
// });

// app.post('/summarize', async (req, res) => {
//   console.log('🔁 Summarize request received');

//   try {
//     const snapshot = await db.collection(TODOS_COLLECTION).get();

//     if (snapshot.empty) {
//       console.log("📝 No todos to summarize.");
//       return res.status(200).json({ success: true, message: 'No todos found.' });
//     }

//     const todos = snapshot.docs.map(doc => doc.data());
//     const todoText = todos.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
//     console.log("📝 Todos to summarize:\n", todoText);

//     const response = await cohere.chat({
//       message: `Summarize this list of to-do items meaningfully:\n\n${todoText}`,
//     });

//     console.log("✅ Cohere raw response:", response);

//     const summary = response.text;

//     if (!summary) {
//       console.warn("⚠️ Empty summary from Cohere.");
//       return res.status(500).json({ success: false, message: 'Cohere returned empty summary.' });
//     }

//     try {
//       const slackResponse = await axios.post(process.env.SLACK_WEBHOOK_URL, {
//         text: `*📝 To-Do Summary:*\n${summary}`,
//       });
//       console.log("✅ Slack response:", slackResponse.status);
//     } catch (slackError) {
//       console.error("❌ Slack send error:", slackError.response?.data || slackError.message || slackError);
//       return res.status(500).json({ success: false, message: 'Failed to send to Slack' });
//     }

//     res.status(200).json({ success: true, message: summary });

//   } catch (error) {
//     console.error("❌ Summarize error:", error.message || error);
//     res.status(500).json({ success: false, message: 'Failed to summarize or send to Slack' });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });













import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { CohereClient } from 'cohere-ai';
import axios from 'axios';

dotenv.config(); // Load .env

// Check if required environment variables are available
if (!process.env.SLACK_WEBHOOK_URL) {
  throw new Error('SLACK_WEBHOOK_URL is missing!');
}
if (!process.env.COHERE_API_KEY) {
  throw new Error('COHERE_API_KEY is missing!');
}
if (!process.env.FIREBASE_ADMIN_KEY) {
  throw new Error('FIREBASE_ADMIN_KEY is missing!');
}

console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY);
console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const TODOS_COLLECTION = 'todos';

// Decode the Firebase Admin SDK key from the base64 encoded environment variable
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Cohere Client with API Key
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Endpoints

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const snapshot = await db.collection(TODOS_COLLECTION).get();
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const docRef = await db.collection(TODOS_COLLECTION).add({ text });
    res.status(201).json({ id: docRef.id, text });
  } catch (err) {
    console.error("Error adding todo:", err.message);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    await db.collection(TODOS_COLLECTION).doc(req.params.id).delete();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Summarize todos and send to Slack
app.post('/summarize', async (req, res) => {
  console.log('🔁 Summarize request received');

  try {
    const snapshot = await db.collection(TODOS_COLLECTION).get();

    if (snapshot.empty) {
      console.log("📝 No todos to summarize.");
      return res.status(200).json({ success: true, message: 'No todos found.' });
    }

    const todos = snapshot.docs.map(doc => doc.data());
    const todoText = todos.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
    console.log("📝 Todos to summarize:\n", todoText);

    const response = await cohere.chat({
      message: `Summarize this list of to-do items meaningfully:\n\n${todoText}`,
    });

    console.log("✅ Cohere raw response:", response);

    const summary = response.text;

    if (!summary) {
      console.warn("⚠️ Empty summary from Cohere.");
      return res.status(500).json({ success: false, message: 'Cohere returned empty summary.' });
    }

    // Send summary to Slack
    try {
      const slackResponse = await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `*📝 To-Do Summary:*\n${summary}`,
      });
      console.log("✅ Slack response:", slackResponse.status);
    } catch (slackError) {
      console.error("❌ Slack send error:", slackError.response?.data || slackError.message || slackError);
      return res.status(500).json({ success: false, message: 'Failed to send to Slack' });
    }

    res.status(200).json({ success: true, message: summary });

  } catch (error) {
    console.error("❌ Summarize error:", error.message || error);
    res.status(500).json({ success: false, message: 'Failed to summarize or send to Slack' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
