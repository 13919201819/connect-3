import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ── CORS preflight ────────────────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  console.log('📬 Received contact form submission');

  try {
    const data = await request.json();
    const { name, email, company, message } = data;

    // ── Validate ──────────────────────────────────────────────────────────────
    const missing: string[] = [];
    if (!name?.trim())    missing.push('name');
    if (!email?.trim())   missing.push('email');
    if (!message?.trim()) missing.push('message');

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: process.env.HOST_TIMEZONE || 'Asia/Kolkata',
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
    });

    // ── Plain-text body ───────────────────────────────────────────────────────
    const textBody = `
New Contact Form Submission — NeuroForgeAI
==========================================

NAME:    ${name}
EMAIL:   ${email}
COMPANY: ${company || 'Not provided'}

MESSAGE:
${message}

------------------------------------------
Submitted: ${submittedAt}
    `.trim();

    // ── HTML body ─────────────────────────────────────────────────────────────
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#000;">
  <div style="max-width:580px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(0,255,209,0.15);border-radius:4px;overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#003d33,#001a14);padding:28px 28px 24px;border-bottom:1px solid rgba(0,255,209,0.2);">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,255,209,0.08);border:1px solid rgba(0,255,209,0.2);padding:4px 12px;margin-bottom:14px;">
        <span style="font-size:11px;font-weight:700;color:#00FFD1;text-transform:uppercase;letter-spacing:1px;">New Message</span>
      </div>
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;letter-spacing:-0.01em;">Contact Form Submission</h1>
      <p style="color:rgba(255,255,255,0.4);margin:6px 0 0;font-size:13px;">Someone reached out via the NeuroForgeAI website</p>
    </div>

    <!-- Body -->
    <div style="padding:28px;">

      <!-- Sender info -->
      <div style="background:#111;border:1px solid rgba(0,255,209,0.15);border-left:3px solid #00FFD1;padding:20px;margin-bottom:20px;">
        <div style="font-size:10px;font-weight:700;color:#00FFD1;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">👤 Sender Details</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:7px 0;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;width:90px;vertical-align:top;">NAME</td>
            <td style="padding:7px 0;color:#fff;font-size:14px;font-weight:500;">${name}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:7px 0;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;vertical-align:top;">EMAIL</td>
            <td style="padding:7px 0;"><a href="mailto:${email}" style="color:#00FFD1;font-size:14px;text-decoration:none;">${email}</a></td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:7px 0;color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;vertical-align:top;">COMPANY</td>
            <td style="padding:7px 0;color:rgba(255,255,255,0.7);font-size:14px;">${company?.trim() || '—'}</td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div style="background:#111;border:1px solid rgba(255,255,255,0.08);padding:20px;margin-bottom:20px;">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">💬 Message</div>
        <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <!-- Reply CTA -->
      <div style="text-align:center;margin:24px 0 8px;">
        <a href="mailto:${email}?subject=Re: Your message to NeuroForgeAI"
          style="display:inline-block;background:#00FFD1;color:#000;padding:12px 32px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;">
          Reply to ${name} →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">Submitted: ${submittedAt}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // ── Confirmation HTML (to sender) ─────────────────────────────────────────
    const confirmationHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#000;">
  <div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(0,255,209,0.15);border-radius:4px;overflow:hidden;">

    <div style="background:linear-gradient(135deg,#003d33,#001a14);padding:32px 28px;text-align:center;border-bottom:1px solid rgba(0,255,209,0.2);">
      <div style="width:48px;height:48px;border:2px solid #00FFD1;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px;">✓</div>
      <h1 style="color:#00FFD1;margin:0;font-size:22px;font-weight:600;">Message Received!</h1>
      <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px;">We'll get back to you within 24 hours</p>
    </div>

    <div style="padding:28px;">
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 22px;">
        Hi <strong style="color:#fff;">${name}</strong>, thanks for reaching out to NeuroForgeAI. We've received your message and our team will respond to <strong style="color:#00FFD1;">${email}</strong> within 24 hours.
      </p>

      <!-- Message recap -->
      <div style="background:#111;border:1px solid rgba(255,255,255,0.08);border-left:3px solid rgba(0,255,209,0.4);padding:16px;margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px;">Your Message</div>
        <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.6;margin:0;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin:0;">
        Need immediate assistance? Email us directly at
        <a href="mailto:${process.env.SMTP_EMAIL}" style="color:rgba(0,255,209,0.7);text-decoration:none;">${process.env.SMTP_EMAIL}</a>
      </p>
    </div>

    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">© ${new Date().getFullYear()} NeuroForgeAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // ── Nodemailer transport ──────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // ── Send notification to host ─────────────────────────────────────────────
    await transporter.sendMail({
      from: `"NeuroForgeAI Contact" <${process.env.SMTP_EMAIL}>`,
      to: process.env.HOST_EMAIL,
      replyTo: email,
      subject: `📬 New Message: ${name}${company?.trim() ? ` — ${company.trim()}` : ''}`,
      text: textBody,
      html: htmlBody,
    });

    console.log('✅ Host notification sent');

    // ── Send confirmation to sender ───────────────────────────────────────────
    try {
      await transporter.sendMail({
        from: `"NeuroForgeAI" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `✅ We received your message, ${name}!`,
        html: confirmationHtml,
      });
      console.log('✅ Confirmation email sent to sender');
    } catch (confirmErr) {
      // Non-fatal — host email already sent
      console.error('⚠️ Confirmation email failed (non-fatal):', confirmErr);
    }

    return NextResponse.json(
      { success: true, message: "Message sent! We'll get back to you within 24 hours." },
      { status: 200, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error('❌ Error in send-email route:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}