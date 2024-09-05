// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import { SMTPClient } from 'emailjs';
const otpStorage: Record<string, number> = {}; // In-memory storage for OTPs (consider using a database in production)
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
        user: 'Sourabhpargai1234@gmail.com',
        password: `${process.env.SMTP_PASSWORD}`,
        host: 'smtp.gmail.com',
        ssl: true,
    });
    await redis.setnx(email, otp);
    await redis.expire(email, 60);
    client.send(
        {
            text: `Your otp: ${otp}`,
            from: 'Developedia',
            to: `${email}`,
            subject: 'testing emailjs',
        },
        (err, message) => {
            console.log(err || message);
        }
    );

    return NextResponse.json({ message: "Otp created successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

