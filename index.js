const express = require('express');
const app = express();
app.use(express.json());

// Разрешаем запросы с мобильного приложения
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'Adet server is running!' });
});

app.post('/chat', async (req, res) => {
  const { message, habits } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `Ты AI-ассистент в приложении Adet для трекинга привычек. 
Привычки пользователя: ${JSON.stringify(habits)}.
Отвечай по-русски, коротко и поддерживающе.`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  res.json({ reply: data.content[0].text });
});

app.listen(process.env.PORT || 3000);
