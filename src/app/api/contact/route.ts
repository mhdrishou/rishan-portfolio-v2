import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
})

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 5

  const record = rateLimitMap.get(ip)
  
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

async function sendEmail(data: { name: string; email: string; subject: string; message: string }) {
  const nodemailer = await import('nodemailer')
  
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `Portfolio Contact: ${data.subject}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A2E;">New Contact Form Submission</h2>
          <div style="background: #F8F9FE; padding: 24px; border-radius: 12px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          </div>
        </div>
      `,
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.email,
      subject: 'Thank you for reaching out!',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A2E;">Thank you, ${data.name}!</h2>
          <p>I've received your message and will get back to you soon.</p>
          <p>Best regards,<br>Rishan</p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Email error:', emailError)
    throw new Error('Failed to send email')
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    await sendEmail(validatedData)

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}