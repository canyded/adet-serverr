app.post('/chat', async (req, res) => {
  const { message, userName, habits } = req.body;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const habitsFormatted = habits.map(h => ({
    name: h.name,
    days: h.days_of_week.map(d => dayNames[d]).join(', '),  // [0,1,2] → "Mon, Tue, Wed"
    streak: h.streak ?? 0,
    target: h.target_count ?? 1
  }));

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
      system: `Ты AI Coach в приложении Adet для трекинга привычек.
Имя пользователя: ${userName ?? 'пользователь'}.
Привычки:
${habitsFormatted.map(h => `- ${h.name}: ${h.days}, streak ${h.streak} дней`).join('\n')}

Отвечай на том языке на котором пишет пользователь.
Будь конкретным, ссылайся на реальные привычки. Коротко, 2-3 предложения.`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  res.json({ reply: data.content[0].text });
});
