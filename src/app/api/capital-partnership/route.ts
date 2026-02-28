// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function OPTIONS() {
//   console.log('✅ OPTIONS received');
//   return new NextResponse(null, { 
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': '*',
//     }
//   });
// }

// export async function POST(request: Request) {
//   console.log('✅ POST received');

//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Access-Control-Allow-Headers': '*',
//   };

//   try {
//     const data = await request.json();
//     console.log('Form data received:', data);

//     // Validate required fields
//     const requiredFields = [
//       'organizationName',
//       'organizationWebsite',
//       'industry',
//       'organizationSize',
//       'fullName',
//       'workEmail',
//       'roleDesignation',
//       'productType',
//       'customizationScope',
//       'requirements',
//       'timeline'
//     ];

//     const missingFields = requiredFields.filter(field => !data[field]);
    
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400, headers }
//       );
//     }

//     // Format the Email Body
//     let body = `🎯 New Product Customization Request!\n\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `📋 ORGANIZATION DETAILS\n`;
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Organization: ${data.organizationName}\n`;
//     body += `Website: ${data.organizationWebsite}\n`;
//     body += `Industry: ${data.industry}\n`;
//     body += `Size: ${data.organizationSize}\n\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `👤 CONTACT PERSON\n`;
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Name: ${data.fullName}\n`;
//     body += `Email: ${data.workEmail}\n`;
//     body += `Role: ${data.roleDesignation}\n\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `🔧 CUSTOMIZATION DETAILS\n`;
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Product Type: ${data.productType}\n`;
//     body += `Customization Scope: ${data.customizationScope}\n`;
//     body += `Expected Timeline: ${data.timeline}\n\n`;
    
//     body += `📝 Requirements:\n`;
//     body += `${data.requirements}\n\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Submitted: ${new Date().toLocaleString()}\n`;

//     // Create HTML version
//     const htmlBody = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Customization Request</h1>
//         </div>
        
//         <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
//           <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📋 Organization Details</h2>
//           <table style="width: 100%; margin-bottom: 20px;">
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Organization:</strong></td><td style="padding: 8px 0;">${data.organizationName}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Website:</strong></td><td style="padding: 8px 0;"><a href="${data.organizationWebsite}">${data.organizationWebsite}</a></td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Industry:</strong></td><td style="padding: 8px 0;">${data.industry}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Size:</strong></td><td style="padding: 8px 0;">${data.organizationSize}</td></tr>
//           </table>

//           <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">👤 Contact Person</h2>
//           <table style="width: 100%; margin-bottom: 20px;">
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${data.fullName}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.workEmail}">${data.workEmail}</a></td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td><td style="padding: 8px 0;">${data.roleDesignation}</td></tr>
//           </table>

//           <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🔧 Customization Details</h2>
//           <table style="width: 100%; margin-bottom: 20px;">
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Product Type:</strong></td><td style="padding: 8px 0;">${data.productType}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Scope:</strong></td><td style="padding: 8px 0;">${data.customizationScope}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Timeline:</strong></td><td style="padding: 8px 0;">${data.timeline}</td></tr>
//           </table>

//           <h3 style="color: #667eea; margin-top: 20px;">📝 Requirements:</h3>
//           <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
//             ${data.requirements.replace(/\n/g, '<br>')}
//           </div>

//           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
//             Submitted: ${new Date().toLocaleString()}
//           </div>
//         </div>
//       </div>
//     `;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'karanbhatt230803@gmail.com', 
//         pass: 'tqhkxvkqwzblanjc', 
//       },
//     });

//     // Send email
//     await transporter.sendMail({
//       from: '"MistrAI Customization" <karanbhatt230803@gmail.com>',
//       to: 'karanbhatt230803@gmail.com',
//       replyTo: data.workEmail,
//       subject: `🎯 Customization Request: ${data.organizationName} - ${data.productType}`,
//       text: body,
//       html: htmlBody,
//     });

//     console.log('✅ Email sent successfully');

//     return NextResponse.json({ success: true }, { headers });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to send customization request' },
//       { status: 500, headers }
//     );
//   }
// }













































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
  console.log('✅ POST request received for capital partners');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const data = await request.json();
    console.log('📝 Capital partners data received:', {
      fundName: data.fundName,
      workEmail: data.workEmail,
      investmentStage: data.investmentStage
    });

    // Validate required fields
    const requiredFields = [
      'fundName',
      'fundWebsite',
      'fundType',
      'aum',
      'fullName',
      'workEmail',
      'roleDesignation',
      'investmentFocus',
      'investmentStage',
      'typicalCheckSize',
      'briefMessage'
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
    let textBody = `💰 NEW CAPITAL PARTNER INQUIRY\n`;
    textBody += `${'='.repeat(60)}\n\n`;
    
    textBody += `💼 FUND INFORMATION\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Fund Name:         ${data.fundName}\n`;
    textBody += `Website:           ${data.fundWebsite}\n`;
    textBody += `Fund Type:         ${data.fundType}\n`;
    textBody += `AUM:               ${data.aum}\n`;
    textBody += `\n`;
    
    textBody += `👤 CONTACT PERSON\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Name:              ${data.fullName}\n`;
    textBody += `Email:             ${data.workEmail}\n`;
    textBody += `Role:              ${data.roleDesignation}\n`;
    textBody += `\n`;
    
    textBody += `📊 INVESTMENT FOCUS\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Focus:             ${data.investmentFocus}\n`;
    textBody += `Stage:             ${data.investmentStage}\n`;
    textBody += `Check Size:        ${data.typicalCheckSize}\n\n`;
    
    textBody += `💬 Message:\n`;
    textBody += `${data.briefMessage}\n\n`;
    
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
          .highlight { display: inline-block; padding: 8px 16px; background: #dcfce7; color: #166534; border-radius: 6px; font-weight: 600; margin: 10px 0; }
          a { color: #9333ea; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>💰 Capital Partner Inquiry</h1>
            <p>New investor interest from MistrAI Capital Partners Portal</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Fund Information -->
            <div class="section">
              <h2 class="section-title">💼 Fund Information</h2>
              <table class="info-table">
                <tr>
                  <td>Fund Name:</td>
                  <td><strong>${data.fundName}</strong></td>
                </tr>
                <tr>
                  <td>Website:</td>
                  <td><a href="${data.fundWebsite}" target="_blank">${data.fundWebsite}</a></td>
                </tr>
                <tr>
                  <td>Fund Type:</td>
                  <td><span class="badge">${data.fundType}</span></td>
                </tr>
                <tr>
                  <td>AUM:</td>
                  <td><span class="highlight">${data.aum}</span></td>
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

            <!-- Investment Focus -->
            <div class="section">
              <h2 class="section-title">📊 Investment Focus</h2>
              <table class="info-table">
                <tr>
                  <td>Investment Focus:</td>
                  <td><strong>${data.investmentFocus}</strong></td>
                </tr>
                <tr>
                  <td>Investment Stage:</td>
                  <td><span class="badge">${data.investmentStage}</span></td>
                </tr>
                <tr>
                  <td>Typical Check Size:</td>
                  <td><span class="highlight">${data.typicalCheckSize}</span></td>
                </tr>
              </table>
              
              <h4 style="color: #9333ea; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">💬 MESSAGE:</h4>
              <div class="text-block">${data.briefMessage.replace(/\n/g, '<br>')}</div>
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
            <p style="margin: 0; color: #d1d5db;">This email was sent from the MistrAI Capital Partners Portal</p>
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
      from: '"MistrAI Capital Partners" <karanbhatt230803@gmail.com>',
      to: 'karanbhatt230803@gmail.com',
      replyTo: data.workEmail,
      subject: `💰 Capital Partner Inquiry: ${data.fundName} | ${data.investmentStage}`,
      text: textBody,
      html: htmlBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('✅ Capital partners inquiry email sent successfully');
    console.log(`📧 Sent to: karanbhatt230803@gmail.com`);
    console.log(`📝 Subject: ${mailOptions.subject}`);

    return NextResponse.json({ 
      success: true,
      message: 'Capital partners inquiry submitted successfully'
    }, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error('❌ Error processing capital partners inquiry:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit inquiry. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}