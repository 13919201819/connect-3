import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      jobTitle,
      companySize,
      industry,
      demoType,
      demoDuration,
      message,
      date,        // "YYYY-MM-DD" (IST date selected by user)
      slotHourIST, // integer hour in IST (e.g. 9, 10, 11, 14 ...)
      timezone,    // client's IANA timezone string
    } = body;

    console.log('📅 Received demo booking request:', { date, slotHourIST, name, timezone });

    // ── Validate required fields ──────────────────────────────────────────────
    if (!date || slotHourIST === undefined || slotHourIST === null || !name || !email || !company) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // ── Convert IST slot → UTC ────────────────────────────────────────────────
    // IST = UTC+5:30. So UTC = IST - 5h30m
    const [y, m, d] = date.split('-').map(Number);
    const utcMs = Date.UTC(y, m - 1, d, slotHourIST - 5, -30); // minutes: -30 handles the half-hour offset
    const startUTC = new Date(utcMs);
    const endUTC   = new Date(utcMs + 60 * 60 * 1000); // +1 hour (adjust per demoType if you want)

    const startISO = startUTC.toISOString();
    const endISO   = endUTC.toISOString();

    console.log('🕐 Time conversion:', { date, slotHourIST, startISO, endISO });

    // ── Google Auth ───────────────────────────────────────────────────────────
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const calendar = google.calendar({ version: 'v3', auth });

    // ── Build Calendar Event ──────────────────────────────────────────────────
    const formatISTDisplay = (hour: number): string => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${h}:00 ${period} IST`;
    };

    const event = {
      summary: `${demoType || 'Enterprise'} Demo: ${company} — ${name}`,
      description: `
DEMO BOOKING

Client Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name:          ${name}
💼 Job Title:     ${jobTitle || 'Not provided'}
🏢 Company:       ${company}
📊 Company Size:  ${companySize || 'Not provided'}
🏭 Industry:      ${industry || 'Not provided'}
✉️  Email:         ${email}
📱 Phone:         ${phone || 'Not provided'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Demo Type: ${demoType || 'General Demo'} (${demoDuration || '60 min'})

📝 Additional Notes:
${message || 'No additional notes provided'}

⏰ Host Time (IST): ${formatISTDisplay(slotHourIST)}
📅 IST Date: ${date}
      `.trim(),
      start: { dateTime: startISO, timeZone: 'UTC' },
      end:   { dateTime: endISO,   timeZone: 'UTC' },
      attendees: [
        { email, displayName: name },
        { email: process.env.HOST_EMAIL || '' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email',  minutes: 24 * 60 },
          { method: 'email',  minutes: 60 },
          { method: 'popup',  minutes: 30 },
        ],
      },
    };

    console.log('📝 Creating calendar event...');

    const insertResponse = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';
    const eventId  = insertResponse.data.id;

    console.log('✅ Calendar event created:', { eventId, meetLink });

    // ── Format times for emails ───────────────────────────────────────────────
    const formatForTZ = (isoString: string, tz: string): string => {
      try {
        return new Date(isoString).toLocaleString('en-US', {
          timeZone: tz,
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
        });
      } catch {
        return isoString;
      }
    };

    const clientLocalTime = formatForTZ(startISO, timezone || 'UTC');
    const hostTimezone    = process.env.HOST_TIMEZONE || 'Asia/Kolkata';
    const hostLocalTime   = formatForTZ(startISO, hostTimezone);

    console.log('⏰ Formatted times:', { clientLocalTime, hostLocalTime });

    // ── Nodemailer transporter ────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASS },
    });

    // ── Client confirmation email ─────────────────────────────────────────────
    try {
      await transporter.sendMail({
        from: `"NeuroForgeAI" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: '✅ Your Demo is Confirmed — NeuroForgeAI',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#000;">
  <div style="max-width:600px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(0,255,209,0.15);border-radius:4px;overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#003d33 0%,#001a14 100%);padding:40px 30px;text-align:center;border-bottom:1px solid rgba(0,255,209,0.2);">
      <div style="width:56px;height:56px;border:2px solid #00FFD1;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:24px;">✓</div>
      <h1 style="color:#00FFD1;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.02em;">Demo Confirmed</h1>
      <p style="color:rgba(255,255,255,0.5);margin:10px 0 0;font-size:14px;">Your session has been scheduled</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 30px;">
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 28px;">
        Hi <strong style="color:#fff;">${name}</strong>, thanks for booking. We're looking forward to showing you what NeuroForgeAI can do for <strong style="color:#00FFD1;">${company}</strong>.
      </p>

      <!-- Details card -->
      <div style="background:#111;border:1px solid rgba(0,255,209,0.2);border-left:3px solid #00FFD1;padding:24px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#00FFD1;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:18px;">📅 Session Details</div>

        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:13px;width:120px;">TYPE</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:500;">${demoType || 'Enterprise Demo'} · ${demoDuration || '60 min'}</td></tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);"><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:13px;">YOUR TIME</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">${clientLocalTime}</td></tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);"><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:13px;">MEET LINK</td>
            <td style="padding:8px 0;"><a href="${meetLink}" style="color:#00FFD1;font-size:13px;word-break:break-all;">${meetLink}</a></td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:30px 0;">
        <a href="${meetLink}" style="display:inline-block;background:#00FFD1;color:#000;padding:14px 40px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;">
          Join Meeting →
        </a>
      </div>

      <!-- What to expect -->
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.06);padding:20px;margin-bottom:20px;">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px;">What to Expect</div>
        <ul style="color:rgba(255,255,255,0.55);font-size:13px;line-height:2;margin:0;padding-left:18px;">
          <li>Personalized walkthrough tailored to ${industry || 'your industry'}</li>
          <li>Live Q&A with our solutions team</li>
          <li>Discussion of your specific challenges & use cases</li>
          <li>Custom ROI analysis for ${company}</li>
        </ul>
      </div>

      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin:0;">
        Need to reschedule? Reply to this email or contact <a href="mailto:${process.env.SMTP_EMAIL}" style="color:rgba(0,255,209,0.6);">${process.env.SMTP_EMAIL}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
      <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">© ${new Date().getFullYear()} NeuroForgeAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
      });
      console.log('✅ Client email sent');
    } catch (err) {
      console.error('❌ Error sending client email:', err);
    }

    // ── Host notification email ───────────────────────────────────────────────
    try {
      await transporter.sendMail({
        from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
        to: process.env.HOST_EMAIL,
        subject: `🎯 NEW DEMO BOOKED: ${company} · ${demoType || 'Demo'} · ${hostLocalTime}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#000;">
  <div style="max-width:650px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(16,185,129,0.2);border-radius:4px;overflow:hidden;">

    <div style="background:linear-gradient(135deg,#064e3b,#022c22);padding:28px 30px;border-bottom:1px solid rgba(16,185,129,0.2);">
      <h1 style="color:#10b981;margin:0;font-size:22px;font-weight:700;">🆕 New Demo Booked</h1>
      <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px;">${demoType || 'Enterprise Demo'} · ${demoDuration || '60 min'}</p>
    </div>

    <div style="padding:30px;">

      <!-- Client Profile -->
      <div style="background:#111;border:1px solid rgba(16,185,129,0.15);padding:22px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;">👤 Client Profile</div>
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['NAME',         name],
            ['TITLE',        jobTitle || 'Not provided'],
            ['COMPANY',      company],
            ['COMPANY SIZE', companySize || 'Not provided'],
            ['INDUSTRY',     industry || 'Not provided'],
            ['EMAIL',        email],
            ['PHONE',        phone || 'Not provided'],
          ].map(([label, val], i) => `
          <tr style="${i > 0 ? 'border-top:1px solid rgba(16,185,129,0.08);' : ''}">
            <td style="padding:9px 0;color:rgba(16,185,129,0.7);font-size:12px;font-weight:600;width:130px;">${label}</td>
            <td style="padding:9px 0;color:#fff;font-size:14px;">${val}</td>
          </tr>`).join('')}
        </table>
      </div>

      <!-- Schedule -->
      <div style="background:#111;border:1px solid rgba(124,58,237,0.2);padding:22px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#a855f7;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;">⏰ Schedule</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:9px 0;color:rgba(168,85,247,0.7);font-size:12px;font-weight:600;width:130px;">YOUR TIME (IST)</td>
            <td style="padding:9px 0;color:#fff;font-size:15px;font-weight:700;">${hostLocalTime}</td>
          </tr>
          <tr style="border-top:1px solid rgba(124,58,237,0.1);">
            <td style="padding:9px 0;color:rgba(168,85,247,0.7);font-size:12px;font-weight:600;">CLIENT TIME</td>
            <td style="padding:9px 0;color:rgba(255,255,255,0.7);font-size:14px;">${clientLocalTime}</td>
          </tr>
          <tr style="border-top:1px solid rgba(124,58,237,0.1);">
            <td style="padding:9px 0;color:rgba(168,85,247,0.7);font-size:12px;font-weight:600;">MEET LINK</td>
            <td style="padding:9px 0;"><a href="${meetLink}" style="color:#a855f7;font-size:13px;word-break:break-all;">${meetLink}</a></td>
          </tr>
        </table>
      </div>

      ${message ? `
      <!-- Notes -->
      <div style="background:#111;border:1px solid rgba(59,130,246,0.15);padding:22px;margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">📝 Client Message</div>
        <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0 8px;">
        <a href="${meetLink}" style="display:inline-block;background:#10b981;color:#000;padding:13px 36px;text-decoration:none;font-weight:700;font-size:14px;">
          Open Google Meet →
        </a>
      </div>

      <div style="text-align:center;margin-top:16px;">
        <span style="font-size:12px;color:rgba(255,255,255,0.2);">Event ID: <code style="background:rgba(255,255,255,0.05);padding:2px 6px;color:rgba(255,255,255,0.3);">${eventId}</code></span>
      </div>
    </div>
  </div>
</body>
</html>`,
      });
      console.log('✅ Host email sent');
    } catch (err) {
      console.error('❌ Error sending host email:', err);
    }

    // ── Success response ──────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        meetLink,
        eventId,
        scheduledTime: clientLocalTime,
        message: 'Demo scheduled successfully! Check your email for confirmation.',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error booking demo:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule demo. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}