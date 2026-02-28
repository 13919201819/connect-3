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
//     console.log('Idea submission data received:', data);

//     // Validate required fields
//     const requiredFields = ['fullName', 'email', 'whoAreYou', 'ideaTitle', 'idea'];
//     const missingFields = requiredFields.filter(field => !data[field]);
    
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400, headers }
//       );
//     }

//     // Format the Email Body
//     let body = `💡 New Idea Submission!\n\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `👤 SUBMITTER DETAILS\n`;
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Name: ${data.fullName}\n`;
//     body += `Email: ${data.email}\n`;
//     body += `Who are they: ${data.whoAreYou}\n`;
//     if (data.company) body += `Company: ${data.company}\n`;
//     if (data.industry) body += `Industry: ${data.industry}\n`;
//     body += `\n`;
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `💡 IDEA DETAILS\n`;
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Title: ${data.ideaTitle}\n\n`;
    
//     body += `📝 Description:\n`;
//     body += `${data.idea}\n\n`;
    
//     if (data.whyValuable) {
//       body += `💎 Why Valuable:\n`;
//       body += `${data.whyValuable}\n\n`;
//     }
    
//     if (data.fileName) {
//       body += `📎 Attachment: ${data.fileName}\n\n`;
//     }
    
//     body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
//     body += `Submitted: ${new Date().toLocaleString()}\n`;

//     // Create HTML version
//     const htmlBody = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 30px; border-radius: 10px 10px 0 0;">
//           <h1 style="color: white; margin: 0; font-size: 24px;">💡 New Idea Submission</h1>
//         </div>
        
//         <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
//           <h2 style="color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px;">👤 Submitter Details</h2>
//           <table style="width: 100%; margin-bottom: 20px;">
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${data.fullName}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
//             <tr><td style="padding: 8px 0; color: #666;"><strong>Who are they:</strong></td><td style="padding: 8px 0;">${data.whoAreYou}</td></tr>
//             ${data.company ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td><td style="padding: 8px 0;">${data.company}</td></tr>` : ''}
//             ${data.industry ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Industry:</strong></td><td style="padding: 8px 0;">${data.industry}</td></tr>` : ''}
//           </table>

//           <h2 style="color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px;">💡 Idea Details</h2>
//           <h3 style="color: #7c3aed; margin: 20px 0 10px 0; font-size: 18px;">${data.ideaTitle}</h3>
          
//           <h4 style="color: #9333ea; margin-top: 20px;">📝 Description:</h4>
//           <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #9333ea; margin: 10px 0;">
//             ${data.idea.replace(/\n/g, '<br>')}
//           </div>

//           ${data.whyValuable ? `
//             <h4 style="color: #9333ea; margin-top: 20px;">💎 Why This Creates Value:</h4>
//             <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #7c3aed; margin: 10px 0;">
//               ${data.whyValuable.replace(/\n/g, '<br>')}
//             </div>
//           ` : ''}

//           ${data.fileName ? `
//             <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
//               <strong style="color: #0369a1;">📎 Attachment:</strong> ${data.fileName}
//             </div>
//           ` : ''}

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
//       from: '"MistrAI Ideas" <karanbhatt230803@gmail.com>',
//       to: 'karanbhatt230803@gmail.com',
//       replyTo: data.email,
//       subject: `💡 New Idea: ${data.ideaTitle} - ${data.fullName}`,
//       text: body,
//       html: htmlBody,
//     });

//     console.log('✅ Email sent successfully');

//     return NextResponse.json({ success: true }, { headers });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to send idea submission' },
//       { status: 500, headers }
//     );
//   }
// }




// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function OPTIONS() {
//   console.log('✅ OPTIONS request received');
//   return new NextResponse(null, { 
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     }
//   });
// }

// export async function POST(request: Request) {
//   console.log('✅ POST request received for idea submission');

//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   };

//   try {
//     const data = await request.json();
//     console.log('📝 Idea submission data received:', {
//       fullName: data.fullName,
//       email: data.email,
//       ideaTitle: data.ideaTitle,
//       hasFile: !!data.fileName
//     });

//     // Validate required fields
//     const requiredFields = ['fullName', 'email', 'whoAreYou', 'ideaTitle', 'idea'];
//     const missingFields = requiredFields.filter(field => !data[field]);
    
//     if (missingFields.length > 0) {
//       console.error('❌ Missing required fields:', missingFields);
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400, headers }
//       );
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(data.email)) {
//       console.error('❌ Invalid email format:', data.email);
//       return NextResponse.json(
//         { error: 'Invalid email address format' },
//         { status: 400, headers }
//       );
//     }

//     // Format the plain text email body
//     let textBody = `💡 NEW IDEA SUBMISSION\n`;
//     textBody += `${'='.repeat(60)}\n\n`;
    
//     textBody += `👤 SUBMITTER INFORMATION\n`;
//     textBody += `${'-'.repeat(60)}\n`;
//     textBody += `Name:          ${data.fullName}\n`;
//     textBody += `Email:         ${data.email}\n`;
//     textBody += `Who are they:  ${data.whoAreYou}\n`;
//     if (data.company) textBody += `Company:       ${data.company}\n`;
//     if (data.industry) textBody += `Industry:      ${data.industry}\n`;
//     textBody += `\n`;
    
//     textBody += `💡 IDEA INFORMATION\n`;
//     textBody += `${'-'.repeat(60)}\n`;
//     textBody += `Title: ${data.ideaTitle}\n\n`;
    
//     textBody += `📝 Description:\n`;
//     textBody += `${data.idea}\n\n`;
    
//     if (data.whyValuable) {
//       textBody += `💎 Why This Creates Value:\n`;
//       textBody += `${data.whyValuable}\n\n`;
//     }
    
//     if (data.fileName) {
//       textBody += `📎 Attachment: ${data.fileName}\n\n`;
//     }
    
//     textBody += `${'-'.repeat(60)}\n`;
//     textBody += `⏰ Submitted: ${new Date().toLocaleString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       timeZoneName: 'short'
//     })}\n`;
//     textBody += `${'='.repeat(60)}\n`;

//     // Create HTML email body with modern styling
//     const htmlBody = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
//           .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; }
//           .header { background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; }
//           .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
//           .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
//           .content { background: white; padding: 40px 30px; }
//           .section { margin-bottom: 30px; }
//           .section-title { color: #9333ea; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #9333ea; }
//           .info-table { width: 100%; border-collapse: collapse; }
//           .info-table td { padding: 10px 0; vertical-align: top; }
//           .info-table td:first-child { color: #666; font-weight: 600; width: 140px; }
//           .info-table td:last-child { color: #333; }
//           .idea-title { color: #7c3aed; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; }
//           .text-block { background: #f9fafb; padding: 20px; border-left: 4px solid #9333ea; margin: 15px 0; line-height: 1.6; color: #374151; border-radius: 4px; }
//           .value-block { background: #faf5ff; padding: 20px; border-left: 4px solid #7c3aed; margin: 15px 0; line-height: 1.6; color: #374151; border-radius: 4px; }
//           .attachment { background: #eff6ff; padding: 15px 20px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 15px 0; display: inline-block; }
//           .attachment-icon { color: #2563eb; font-size: 18px; margin-right: 8px; }
//           .footer { padding: 30px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
//           .badge { display: inline-block; padding: 4px 12px; background: #f3e8ff; color: #7c3aed; border-radius: 12px; font-size: 13px; font-weight: 500; }
//           a { color: #9333ea; text-decoration: none; }
//           a:hover { text-decoration: underline; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <!-- Header -->
//           <div class="header">
//             <h1>💡 New Idea Submission</h1>
//             <p>A new idea has been submitted for review</p>
//           </div>
          
//           <!-- Content -->
//           <div class="content">
//             <!-- Submitter Information -->
//             <div class="section">
//               <h2 class="section-title">👤 Submitter Information</h2>
//               <table class="info-table">
//                 <tr>
//                   <td>Name:</td>
//                   <td><strong>${data.fullName}</strong></td>
//                 </tr>
//                 <tr>
//                   <td>Email:</td>
//                   <td><a href="mailto:${data.email}">${data.email}</a></td>
//                 </tr>
//                 <tr>
//                   <td>Who are they:</td>
//                   <td><span class="badge">${data.whoAreYou}</span></td>
//                 </tr>
//                 ${data.company ? `
//                 <tr>
//                   <td>Company:</td>
//                   <td>${data.company}</td>
//                 </tr>
//                 ` : ''}
//                 ${data.industry ? `
//                 <tr>
//                   <td>Industry:</td>
//                   <td>${data.industry}</td>
//                 </tr>
//                 ` : ''}
//               </table>
//             </div>

//             <!-- Idea Details -->
//             <div class="section">
//               <h2 class="section-title">💡 Idea Details</h2>
//               <h3 class="idea-title">${data.ideaTitle}</h3>
              
//               <h4 style="color: #9333ea; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">📝 DESCRIPTION:</h4>
//               <div class="text-block">${data.idea.replace(/\n/g, '<br>')}</div>

//               ${data.whyValuable ? `
//                 <h4 style="color: #7c3aed; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">💎 WHY THIS CREATES VALUE:</h4>
//                 <div class="value-block">${data.whyValuable.replace(/\n/g, '<br>')}</div>
//               ` : ''}

//               ${data.fileName ? `
//                 <div class="attachment">
//                   <span class="attachment-icon">📎</span>
//                   <strong>Attachment:</strong> ${data.fileName}
//                 </div>
//               ` : ''}
//             </div>
//           </div>

//           <!-- Footer -->
//           <div class="footer">
//             <p style="margin: 0 0 10px 0;">⏰ Submitted on ${new Date().toLocaleString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//               timeZoneName: 'short'
//             })}</p>
//             <p style="margin: 0; color: #d1d5db;">This email was sent from the MistrAI Idea Submission Portal</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     // Create email transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'karanbhatt230803@gmail.com',
//         pass: 'tqhkxvkqwzblanjc',
//       },
//     });

//     // Send email
//     const mailOptions = {
//       from: '"MistrAI Ideas Portal" <karanbhatt230803@gmail.com>',
//       to: 'karanbhatt230803@gmail.com',
//       replyTo: data.email,
//       subject: `💡 New Idea: ${data.ideaTitle} | ${data.fullName}`,
//       text: textBody,
//       html: htmlBody,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log('✅ Idea submission email sent successfully');
//     console.log(`📧 Sent to: karanbhatt230803@gmail.com`);
//     console.log(`📝 Subject: ${mailOptions.subject}`);

//     return NextResponse.json({ 
//       success: true,
//       message: 'Idea submitted successfully'
//     }, { 
//       status: 200,
//       headers 
//     });

//   } catch (error) {
//     console.error('❌ Error processing idea submission:', error);
    
//     return NextResponse.json(
//       { 
//         error: 'Failed to submit idea. Please try again later.',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
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
  console.log('✅ POST request received for idea submission');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const data = await request.json();
    console.log('📝 Idea submission data received:', {
      fullName: data.fullName,
      email: data.email,
      ideaTitle: data.ideaTitle,
      hasFile: !!data.file,
      fileDetails: data.file ? {
        name: data.file.name,
        type: data.file.type,
        dataLength: data.file.data?.length || 0,
        dataPreview: data.file.data?.substring(0, 50) + '...'
      } : null
    });

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'whoAreYou', 'ideaTitle', 'idea'];
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
    if (!emailRegex.test(data.email)) {
      console.error('❌ Invalid email format:', data.email);
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400, headers }
      );
    }

    // Format the plain text email body
    let textBody = `💡 NEW IDEA SUBMISSION\n`;
    textBody += `${'='.repeat(60)}\n\n`;
    
    textBody += `👤 SUBMITTER INFORMATION\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Name:          ${data.fullName}\n`;
    textBody += `Email:         ${data.email}\n`;
    textBody += `Who are they:  ${data.whoAreYou}\n`;
    if (data.company) textBody += `Company:       ${data.company}\n`;
    if (data.industry) textBody += `Industry:      ${data.industry}\n`;
    textBody += `\n`;
    
    textBody += `💡 IDEA INFORMATION\n`;
    textBody += `${'-'.repeat(60)}\n`;
    textBody += `Title: ${data.ideaTitle}\n\n`;
    
    textBody += `📝 Description:\n`;
    textBody += `${data.idea}\n\n`;
    
    if (data.whyValuable) {
      textBody += `💎 Why This Creates Value:\n`;
      textBody += `${data.whyValuable}\n\n`;
    }
    
    if (data.file?.name) {
      textBody += `📎 Attachment: ${data.file.name}\n\n`;
    }
    
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
          .info-table td:first-child { color: #666; font-weight: 600; width: 140px; }
          .info-table td:last-child { color: #333; }
          .idea-title { color: #7c3aed; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; }
          .text-block { background: #f9fafb; padding: 20px; border-left: 4px solid #9333ea; margin: 15px 0; line-height: 1.6; color: #374151; border-radius: 4px; }
          .value-block { background: #faf5ff; padding: 20px; border-left: 4px solid #7c3aed; margin: 15px 0; line-height: 1.6; color: #374151; border-radius: 4px; }
          .attachment { background: #eff6ff; padding: 15px 20px; border-radius: 8px; border: 1px solid #bfdbfe; margin: 15px 0; display: inline-block; }
          .attachment-icon { color: #2563eb; font-size: 18px; margin-right: 8px; }
          .footer { padding: 30px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
          .badge { display: inline-block; padding: 4px 12px; background: #f3e8ff; color: #7c3aed; border-radius: 12px; font-size: 13px; font-weight: 500; }
          a { color: #9333ea; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>💡 New Idea Submission</h1>
            <p>A new idea has been submitted for review</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Submitter Information -->
            <div class="section">
              <h2 class="section-title">👤 Submitter Information</h2>
              <table class="info-table">
                <tr>
                  <td>Name:</td>
                  <td><strong>${data.fullName}</strong></td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td><a href="mailto:${data.email}">${data.email}</a></td>
                </tr>
                <tr>
                  <td>Who are they:</td>
                  <td><span class="badge">${data.whoAreYou}</span></td>
                </tr>
                ${data.company ? `
                <tr>
                  <td>Company:</td>
                  <td>${data.company}</td>
                </tr>
                ` : ''}
                ${data.industry ? `
                <tr>
                  <td>Industry:</td>
                  <td>${data.industry}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Idea Details -->
            <div class="section">
              <h2 class="section-title">💡 Idea Details</h2>
              <h3 class="idea-title">${data.ideaTitle}</h3>
              
              <h4 style="color: #9333ea; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">📝 DESCRIPTION:</h4>
              <div class="text-block">${data.idea.replace(/\n/g, '<br>')}</div>

              ${data.whyValuable ? `
                <h4 style="color: #7c3aed; font-size: 14px; font-weight: 600; margin: 20px 0 10px 0;">💎 WHY THIS CREATES VALUE:</h4>
                <div class="value-block">${data.whyValuable.replace(/\n/g, '<br>')}</div>
              ` : ''}

              ${data.file?.name ? `
                <div class="attachment">
                  <span class="attachment-icon">📎</span>
                  <strong>Attachment:</strong> ${data.file.name}
                </div>
              ` : ''}
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
            <p style="margin: 0; color: #d1d5db;">This email was sent from the MistrAI Idea Submission Portal</p>
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
      attachments?: Array<{
        filename: string;
        content: string;
        encoding: string;
        contentType: string;
      }>;
    }

    const mailOptions: MailOptions = {
      from: '"MistrAI Ideas Portal" <karanbhatt230803@gmail.com>',
      to: 'karanbhatt230803@gmail.com',
      replyTo: data.email,
      subject: `💡 New Idea: ${data.ideaTitle} | ${data.fullName}`,
      text: textBody,
      html: htmlBody,
    };

    // Add attachment if file exists
    if (data.file?.data && data.file?.name) {
      console.log('📎 Processing file attachment:', data.file.name);
      console.log('📎 File type:', data.file.type);
      console.log('📎 Data format check:', data.file.data.substring(0, 30));
      
      // Extract base64 data from the data URL
      // Format: "data:application/pdf;base64,JVBERi0xLjQK..."
      const base64Data = data.file.data.includes(',') 
        ? data.file.data.split(',')[1] 
        : data.file.data;
      
      console.log('📎 Base64 data length:', base64Data.length);
      console.log('📎 Base64 preview:', base64Data.substring(0, 50) + '...');
      
      mailOptions.attachments = [
        {
          filename: data.file.name,
          content: base64Data,
          encoding: 'base64',
          contentType: data.file.type
        }
      ];
      
      console.log('✅ File attachment added to email');
      console.log('✅ Attachment config:', {
        filename: data.file.name,
        contentType: data.file.type,
        encoding: 'base64',
        contentLength: base64Data.length
      });
    } else {
      console.log('⚠️ No file attachment:', {
        hasFile: !!data.file,
        hasData: !!data.file?.data,
        hasName: !!data.file?.name
      });
    }

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('✅ Idea submission email sent successfully');
    console.log(`📧 Sent to: karanbhatt230803@gmail.com`);
    console.log(`📝 Subject: ${mailOptions.subject}`);
    if (data.file?.name) {
      console.log(`📎 Attachment: ${data.file.name} (${data.file.type})`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Idea submitted successfully'
    }, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error('❌ Error processing idea submission:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit idea. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}