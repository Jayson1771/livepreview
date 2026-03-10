const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  welcome: (data) => ({
    subject: "Welcome to LivePreview! 🚀",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#6366f1">Welcome to LivePreview, ${data.name}!</h1>
        <p>Your account is ready. Start sharing your localhost in seconds:</p>
        <pre style="background:#0f1117;color:#a5b4fc;padding:16px;border-radius:8px;font-size:14px">npm install -g livepreview-cli
livepreview start -p 3000 -t ${data.token}</pre>
        <p style="color:#6b7280;font-size:14px">Your free plan includes 1 active tunnel with 1-hour sessions.</p>
        <a href="https://${process.env.TUNNEL_DOMAIN}/pricing" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Upgrade to Pro →</a>
      </div>
    `,
  }),

  welcome_pro: (data) => ({
    subject: "Welcome to LivePreview Pro! ⚡",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#6366f1">You're now on Pro, ${data.name}!</h1>
        <p>Your Pro features are now active:</p>
        <ul>
          <li>✅ Unlimited active tunnels</li>
          <li>✅ No session time limits</li>
          <li>✅ Custom subdomains</li>
          <li>✅ 30-day request history</li>
        </ul>
        <a href="https://${process.env.TUNNEL_DOMAIN}/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Open Dashboard →</a>
      </div>
    `,
  }),

  payment_failed: (data) => ({
    subject: "Payment failed — action required",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#ef4444">Payment Failed</h1>
        <p>Hi ${data.name}, we couldn't process your LivePreview Pro payment.</p>
        <p>Please update your payment method to keep your Pro features active.</p>
        <a href="https://${process.env.TUNNEL_DOMAIN}/dashboard/billing" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Update Payment →</a>
      </div>
    `,
  }),

  tunnel_expiring: (data) => ({
    subject: `Your tunnel expires in ${data.minutes} minutes`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#f59e0b">Tunnel Expiring Soon</h1>
        <p>Hi ${data.name}, your tunnel <strong>${data.url}</strong> will expire in ${data.minutes} minutes.</p>
        <p>Upgrade to Pro for unlimited session time.</p>
        <a href="https://${process.env.TUNNEL_DOMAIN}/pricing" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Upgrade to Pro →</a>
      </div>
    `,
  }),
};

async function sendEmail({ to, template, data, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Would send "${template || subject}" to ${to}`);
    return;
  }

  const tmpl = templates[template]?.(data) || { subject, html };

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to,
      subject: tmpl.subject,
      html: tmpl.html,
    });
    console.log(`[Email] Sent "${tmpl.subject}" to ${to}`);
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
  }
}

module.exports = { sendEmail };
