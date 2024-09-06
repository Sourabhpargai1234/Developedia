// Updated POST handler
import { NextResponse } from 'next/server';
import { SMTPClient } from 'emailjs';
const otpStorage: Record<string, number> = {};
import redis from '@/libs/redis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const email = data?.email;
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = otp;

    const client = new SMTPClient({
      user: `${process.env.USER_EMAIL}`,
      password: `${process.env.SMTP_PASSWORD}`,
      host: 'smtp.gmail.com',
      ssl: true,
    });

    // Store OTP in Redis
    await redis.setnx(email, otp);
    await redis.expire(email, 60);

    // Send the email and await its result
    try {
      const message = await client.sendAsync({
        text: `Your OTP: ${otp}`,
        from: 'Developedia <no-reply@developedia.com>',
        to: email,
        subject: 'Requested OTP',
      });

      console.log('Email sent:', message);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP created successfully", otp }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
