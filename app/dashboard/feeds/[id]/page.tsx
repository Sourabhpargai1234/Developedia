import React from 'react';

interface User {
  _id: string;
  username: string;
  profilePicture: string;
  bio: string;
  email: string;
}

interface Feed {
  _id: string;
  content: string;
  user: User;
}

async function getFeed(id: string): Promise<Feed> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/Feeds/${id}`;
  console.log('Fetching from URL:', url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch feed');
  }
  const data = await res.json();
  console.log('Fetched data:', data);
  return data;
}


interface FeedPageProps {
  params: {
    id: string;
  };
}

export default async function FeedPage({ params }: FeedPageProps) {
  try {
    const feed = await getFeed(params.id);
    console.log("Feed=", feed);

    return (
      <div className="max-w-2xl mx-auto p-4">
        {/* Display Username */}
        <h1 className="text-gray-600 text-2xl font-bold">{feed.user.username}</h1>
        
        {/* Display Profile Picture */}
        {feed.user.profilePicture && (
          <img
            src={feed.user.profilePicture}
            alt={`${feed.user.username}'s profile picture`}
            className="w-16 h-16 rounded-full"
          />
        )}
        
        {/* Display User Bio */}
        <p className="text-gray-700 mt-2">{feed.user.bio}</p>
        
        {/* Display User Email */}
        <p className="text-gray-500 text-sm">{feed.user.email}</p>
        
        {/* Display Feed Content */}
        <p className="mt-4">{feed.content}</p>
      </div>
    );
  } catch (error) {
    console.error('Error loading feed:', error);
    return <p>Failed to load feed. Please try again later.</p>;
  }
}
