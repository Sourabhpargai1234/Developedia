import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';
import { Feed } from '@/models/Feed';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const { id } = params;
  
    try {
      await connectDB();
  
      const feed = await Feed.findById(id).populate('user', 'username profilePicture bio email');  // Populating the user field
  
      if (!feed) {
        return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
      }
  
      return NextResponse.json(feed);
    } catch (error) {
      console.error('Error fetching feed:', error);
      return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
  }
