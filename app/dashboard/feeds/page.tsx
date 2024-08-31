import { connectDB } from '@/libs/mongodb';
import { Feed, IFeed } from '@/models/Feed';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/button';
import LikeButton from '@/app/ui/LikeButton';
import LikedByButton from '@/app/ui/LikedByButton';
import AdBanner from '@/app/ui/ads/AdBanner';

const FeedsPage = async () => {

  const db = await connectDB();
  const feedsCollection = db.collection<Feed>('feeds');

  const feeds = await feedsCollection.find({}).toArray();
  return (
    <div className="max-w-5xl p-4 h-full flex-col">
      <h1 className="text-2xl font-semibold text-center mb-6">Feeds</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feeds.map((feed) => (
          <li key={feed._id.toString()} className="bg-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="aspect-w-4 aspect-h-3/5 ">
              <img
                src={feed.file}
                alt={feed.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium">{feed.title}</h2>
              <p className="text-gray-600">{feed.desc}</p>
              <p className="text-gray-500 text-sm mt-2">Email: {feed.email}</p>
            </div>
            <div className="flex h-8 gap-8 mx-4 justify-between">
                <LikeButton id={feed._id.toString()} />
                <ChatBubbleLeftIcon className="cursor-pointer hover:opacity-80"/>
                <Button>Follow</Button>
            </div>
            <div className='flex my-4 mx-4'>
              <LikedByButton id={feed._id.toString()}/>
              {feed.createdAt.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      <div className="absolute lg:top-1/4 lg:w-1/4 lg:right-0">
        <AdBanner dataAdFormat='auto' dataFullWidthResponsive={true} dataAdSlot='1573170883'/>
      </div>
    </div>
  );
};

export default FeedsPage;
