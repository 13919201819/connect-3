import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function OPTIONS() {
  console.log('✅ OPTIONS received');
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  });
}

export async function POST(request: Request) {
  console.log('✅ POST received');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  try {
    const data = await request.json();
    console.log('Form data received:', data);

    // Validate required fields
    const requiredFields = [
      'organizationName',
      'organizationWebsite',
      'industry',
      'organizationSize',
      'fullName',
      'workEmail',
      'roleDesignation',
      'productType',
      'customizationScope',
      'requirements',
      'timeline'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers }
      );
    }

    // Format the Email Body
    let body = `🎯 New Product Customization Request!\n\n`;
    
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `📋 ORGANIZATION DETAILS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Organization: ${data.organizationName}\n`;
    body += `Website: ${data.organizationWebsite}\n`;
    body += `Industry: ${data.industry}\n`;
    body += `Size: ${data.organizationSize}\n\n`;
    
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `👤 CONTACT PERSON\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Name: ${data.fullName}\n`;
    body += `Email: ${data.workEmail}\n`;
    body += `Role: ${data.roleDesignation}\n\n`;
    
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `🔧 CUSTOMIZATION DETAILS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Product Type: ${data.productType}\n`;
    body += `Customization Scope: ${data.customizationScope}\n`;
    body += `Expected Timeline: ${data.timeline}\n\n`;
    
    body += `📝 Requirements:\n`;
    body += `${data.requirements}\n\n`;
    
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Submitted: ${new Date().toLocaleString()}\n`;

    // Create HTML version
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Customization Request</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📋 Organization Details</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #666;"><strong>Organization:</strong></td><td style="padding: 8px 0;">${data.organizationName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Website:</strong></td><td style="padding: 8px 0;"><a href="${data.organizationWebsite}">${data.organizationWebsite}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Industry:</strong></td><td style="padding: 8px 0;">${data.industry}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Size:</strong></td><td style="padding: 8px 0;">${data.organizationSize}</td></tr>
          </table>

          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">👤 Contact Person</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.workEmail}">${data.workEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td><td style="padding: 8px 0;">${data.roleDesignation}</td></tr>
          </table>

          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🔧 Customization Details</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #666;"><strong>Product Type:</strong></td><td style="padding: 8px 0;">${data.productType}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Scope:</strong></td><td style="padding: 8px 0;">${data.customizationScope}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Timeline:</strong></td><td style="padding: 8px 0;">${data.timeline}</td></tr>
          </table>

          <h3 style="color: #667eea; margin-top: 20px;">📝 Requirements:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
            ${data.requirements.replace(/\n/g, '<br>')}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            Submitted: ${new Date().toLocaleString()}
          </div>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karanbhatt230803@gmail.com', 
        pass: 'tqhkxvkqwzblanjc', 
      },
    });

    // Send email
    await transporter.sendMail({
      from: '"MistrAI Customization" <karanbhatt230803@gmail.com>',
      to: 'karanbhatt230803@gmail.com',
      replyTo: data.workEmail,
      subject: `🎯 Customization Request: ${data.organizationName} - ${data.productType}`,
      text: body,
      html: htmlBody,
    });

    console.log('✅ Email sent successfully');

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to send customization request' },
      { status: 500, headers }
    );
  }
}