import redis from "@/libs/redis";
import { NextRequest, NextResponse } from "next/server";

// Type definition for the request body
interface RequestBody {
    key: string;
    value: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { key, value } = body;

        await redis.setnx(key, value);
        await redis.expire(key, 20);
        return NextResponse.json({ message: 'Data stored in Redis successfully' }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: 'Failed to store data in Redis', details: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
