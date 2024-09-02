import React from 'react';
import { connectDB } from '@/libs/mongodb';
import { Feed as FeedModel } from '@/models/Feed';
import LikeButton from '@/app/ui/LikeButton';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import LikedByButton from '@/app/ui/LikedByButton';
import FollowButton from '@/app/ui/FollowButton';

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
  desc: string;  // Ensure this is defined in the schema
  file: string;  // Ensure this is defined in the schema
  createdAt: string | Date;
  user: User;
}

async function getUserProfile(user: string) {
  console.log(user)
  const userProfile = await FeedModel.find({ user: user })
    .populate('user', 'username profilePicture bio email')
    .exec();

  if (!userProfile) {
    throw new Error('Failed to fetch feed');
  }

  console.log('Fetched data:', userProfile);
  return userProfile;
}

interface FeedPageProps {
  params: {
    id: string;
  };
}

export default async function FeedPage({ params }: FeedPageProps) {
  try {
    const db = await connectDB();

    const decodedParam = decodeURIComponent(params.id);
    const objectIdMatch = decodedParam.match(/ObjectId\('([a-fA-F0-9]{24})'\)/);
    if (!objectIdMatch || objectIdMatch.length < 2) {
      throw new Error('Invalid ObjectId format');
    }
    const objectId = objectIdMatch[1];
    const feeds = await getUserProfile(objectId);

    if (!feeds || feeds.length === 0) {
      return <p>No feed found.</p>;
    }

    const firstFeed = feeds[0];  // Assuming you're displaying the first feed user's details

    return (
      <div className="mr-auto p-4 w-full">
        {/* Display Username */}
        <h1 className="text-gray-600 text-2xl font-bold">{firstFeed.user.username}</h1>

        {/* Display Profile Picture */}
        {firstFeed.user.profilePicture && (
          <img
            src={firstFeed.user.profilePicture}
            alt={`${firstFeed.user.username}'s profile picture`}
            className="w-28 h-28 rounded-full float-right"
          />
        )}

        {/* Display User Bio */}
        <p className="text-gray-700 mt-2">Bio: {firstFeed.user.bio}</p>

        {/* Display User Email */}
        <p className="text-gray-500 text-sm">Email: {firstFeed.user.email}</p>

        {/* Display Feed Content */}
        <div className="max-w-4xl p-4 h-full flex-col">
        <h1 className="text-2xl font-semibold text-center mb-6">Uploads</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {feeds.map((feed) => (
            <li key={feed._id.toString()} className="bg-white rounded-lg shadow-md flex flex-col justify-between">
              <div className="aspect-w-4 aspect-h-3/5">
                <img
                  src={feed.file}
                  alt={feed.content}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium">{feed.content}</h2>
                <h2 className="text-gray-600">{feed.desc}</h2>
              </div>
              <div className="flex h-8 gap-8 mx-4 justify-between">
                <LikeButton id={feed._id.toString()} />
                <ChatBubbleLeftIcon className="cursor-pointer hover:opacity-80" />
              </div>
              <div className="flex my-4 mx-4">
                <LikedByButton id={feed._id.toString()} />
                {new Date(feed.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
        </div>

      </div>
    );
  } catch (error) {
    console.error('Error loading feed:', error);
    return <p>Failed to load feed. Please try again later.</p>;
  }
}
