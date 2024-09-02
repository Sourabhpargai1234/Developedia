import { connectDB } from '@/libs/mongodb';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/outline'
import FollowButton from '@/app/ui/FollowButton'; 
import LikeButton from '@/app/ui/LikeButton';
import LikedByButton from '@/app/ui/LikedByButton';
import AdBanner from '@/app/ui/ads/AdBanner';
import Link from 'next/link';
import { Feed } from '@/models/Feed';

const FeedsPage = async () => {
  const db = await connectDB();
  const feeds = await Feed.find()
  .populate('user', 'username')
  .sort({ createdAt: -1 }); // Sort by creation date, newest first

  console.log(feeds)

  return (
    <div className="max-w-5xl p-4 h-full flex-col">
      <h1 className="text-2xl font-semibold text-center mb-6">Feeds</h1>
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
              <Link href={`/dashboard/feeds/${feed.user.toString()}`}>
                  <p className="text-gray-600 cursor-pointer">Author: {feed?.user?.username}</p>
              </Link>
            </div>
            <div className="flex h-8 gap-8 mx-4 justify-between">
                <LikeButton id={feed._id.toString()} />
                <ChatBubbleLeftIcon className="cursor-pointer hover:opacity-80"/>
                <FollowButton id={feed._id.toString()} />
            </div>
            <div className='flex my-4 mx-4 w-full'>
              <LikedByButton id={feed._id.toString()}/>
            </div>
            <div className='float-right w-full text-center'>{feed.createdAt.toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <div className='mt-8'>
        <AdBanner dataAdFormat='auto' dataFullWidthResponsive={true} dataAdSlot='1573170883'/>
      </div>
    </div>
  );
};

export default FeedsPage;
