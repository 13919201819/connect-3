import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function OPTIONS() {
  console.log('✅ OPTIONS request received');
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function POST(request: Request) {
  console.log('✅ POST request received for strategic partnership');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const data = await request.json();
    console.log('📝 Partnership data received:', {
      organizationName: data.organizationName,
      workEmail: data.workEmail,
      initiativeType: data.initiativeType
    });

    // Validate required fields
    const requiredFields = [
      'organizationName', 
      'organizationWebsite', 
      'industry', 
      'organizationType', 
      'fullName', 
      'workEmail', 
      'roleDesignation', 
      'initiativeType', 
      'briefDescription', 
      'timeline'
    ];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.workEmail)) {
      console.error('❌ Invalid email format:', data.workEmail);
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400, headers }
      );
    }

    // Format the plain text email body
    let textBody = `🤝 NEW STRATEGIC PARTNERSHIP INQUIRY\n`;
    textBody += `${'='.repeat(60)}\n\n`;
    
    textBody += `🏢 ORGANIZATION INFORMATION\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Organization:      ${data.organizationName}\n`;
    textBody += `Website:           ${data.organizationWebsite}\n`;
    textBody += `Industry:          ${data.industry}\n`;
    textBody += `Type:              ${data.organizationType}\n`;
    textBody += `\n`;
    
    textBody += `👤 CONTACT PERSON\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Name:              ${data.fullName}\n`;
    textBody += `Email:             ${data.workEmail}\n`;
    textBody += `Role:              ${data.roleDesignation}\n`;
    textBody += `\n`;
    
    textBody += `💡 INITIATIVE DETAILS\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Type:              ${data.initiativeType}\n`;
    textBody += `Timeline:          ${data.timeline}\n\n`;
    
    textBody += `📝 Description:\n`;
    textBody += `${data.briefDescription}\n\n`;
    
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `⏰ Submitted: ${new Date().toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}\n`;
    textBody += `${'='.repeat(60)}\n`;

    // Create HTML email body with modern styling
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
          .content { background: white; padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { color: #9333ea; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #9333ea; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 10px 0; vertical-align: top; }
          .info-table td:first-child { color: #666; font-weight: 600; width: 160px; }
          .info-table td:last-child { color: #333; }
          .text-block { background: #f9fafb; padding: 20px; border-left: 4px solid #9333ea; margin: 15px 0; line-height: 1.6; color: #374151; border-radius: 4px; }
          .footer { padding: 30px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
          .badge { display: inline-block; padding: 4px 12px; background: #f3e8ff; color: #7c3aed; border-radius: 12px; font-size: 13px; font-weight: 500; }
          .highlight { display: inline-block; padding: 8px 16px; background: #eff6ff; color: #1e40af; border-radius: 6px; font-weight: 600; margin: 10px 0; }
          a { color: #9333ea; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🤝 Strategic Partnership Inquiry</h1>
            <p>New partnership request from CLUMOSS Portal</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Organization Information -->
            <div class="section">
              <h2 class="section-title">🏢 Organization Information</h2>
              <table class="info-table">
                <tr>
                  <td>Organization:</td>
                  <td><strong>${data.organizationName}</strong></td>
                </tr>
                <tr>
                  <td>Website:</td>
                  <td><a href="${data.organizationWebsite}" target="_blank">${data.organizationWebsite}</a></td>
                </tr>
                <tr>
                  <td>Industry:</td>
                  <td>${data.industry}</td>
                </tr>
                <tr>
                  <td>Organization Type:</td>
                  <td><span class="badge">${data.organizationType}</span></td>
                </tr>
              </table>
            </div>

            <!-- Contact Person -->
            <div class="section">
              <h2 class="section-title">👤 Contact Person</h2>
              <table class="info-table">
                <tr>
                  <td>Name:</td>
                  <td><strong>${data.fullName}</strong></td>
                </tr>
                <tr>
                  <td>Work Email:</td>
                  <td><a href="mailto:${data.workEmail}">${data.workEmail}</a></td>
                </tr>
                <tr>
                  <td>Role / Designation:</td>
                  <td>${data.roleDesignation}</td>
                </tr>
              </table>
            </div>

            <!-- Initiative Details -->
            <div class="section">
              <h2 class="section-title">💡 Strategic Initiative</h2>
              <table class="info-table">
                <tr>
                  <td>Initiative Type:</td>
                  <td><span class="highlight">${data.initiativeType}</span></td>
                </tr>
                <tr>
                  <td>Timeline:</td>
                  <td><span class="badge">${data.timeline}</span></td>
                </tr>
              </table>
              
              <h4 style="color: #9333ea; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">📝 DESCRIPTION:</h4>
              <div class="text-block">${data.briefDescription.replace(/\n/g, '<br>')}</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 10px 0;">⏰ Submitted on ${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}</p>
            <p style="margin: 0; color: #d1d5db;">This email was sent from the CLUMOSS Strategic Partnership Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karanbhatt230803@gmail.com',
        pass: 'tqhkxvkqwzblanjc',
      },
    });

    // Prepare mail options
    interface MailOptions {
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
      html: string;
    }

    const mailOptions: MailOptions = {
      from: '"CLUMOSS Partnership Portal" <karanbhatt230803@gmail.com>',
      to: 'karanbhatt230803@gmail.com',
      replyTo: data.workEmail,
      subject: `🤝 Strategic Partnership: ${data.initiativeType} | ${data.organizationName}`,
      text: textBody,
      html: htmlBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('✅ Partnership inquiry email sent successfully');
    console.log(`📧 Sent to: karanbhatt230803@gmail.com`);
    console.log(`📝 Subject: ${mailOptions.subject}`);

    return NextResponse.json({ 
      success: true,
      message: 'Partnership inquiry submitted successfully'
    }, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error('❌ Error processing partnership inquiry:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit partnership inquiry. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}