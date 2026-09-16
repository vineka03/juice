import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleAiChat } from './src/server/aiHandler.ts';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// API route for AI Juice Operations Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const result = await handleAiChat(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Server /api/chat error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Serve static build assets in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Juice Shop Operations server running on http://0.0.0.0:${port}`);
});
