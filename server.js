const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/send-email', async (req, res) => {
  const { subject, html, recipients } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'Servicio de correo no configurado. Agrega tu RESEND_API_KEY en los secretos.'
    });
  }

  if (!recipients || !recipients.length) {
    return res.status(400).json({ error: 'No hay destinatarios seleccionados' });
  }

  if (!subject || !html) {
    return res.status(400).json({ error: 'Faltan asunto o mensaje' });
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    let sent = 0;
    const errors = [];

    for (const recipient of recipients) {
      try {
        const toEmail = typeof recipient === 'string' ? recipient : recipient.email;
        const toName  = typeof recipient === 'object' ? (recipient.nombre || '') : '';
        await resend.emails.send({
          from: 'JJ Barbería <onboarding@resend.dev>',
          to: toName ? `${toName} <${toEmail}>` : toEmail,
          subject,
          html,
        });
        sent++;
      } catch (e) {
        errors.push({ recipient, error: e.message });
      }
    }

    res.json({ success: true, sent, errors });
  } catch (e) {
    console.error('Email error:', e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✂ JJ Barbería server running on port ${PORT}`);
});
