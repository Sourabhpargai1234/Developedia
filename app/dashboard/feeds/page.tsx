import { connectDB } from '@/libs/mongodb';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/outline'
import LikeButton from '@/app/ui/LikeButton';
import LikedByButton from '@/app/ui/LikedByButton';
import Link from 'next/link';
import { Feed } from '@/models/Feed';
import { Like } from '@/models/Like';
import AdUnit from '@/app/ui/ads/AdUnit';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const FeedsPage = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);
  const feeds = await Feed.find()
  .populate('user', 'username')
  .sort({ createdAt: -1 }); // Sort by creation date, newest first
    const filteredFeeds = feeds.filter(feed => feed?.user?.username !== session?.user?.username);

    // Fetch likes count for each feed using Promise.all
    const feedsWithLikes = await Promise.all(
      filteredFeeds.map(async (feed) => {
        const likesCount = await Like.countDocuments({ feed: feed._id }); // Fetch the likes count for each feed
    
        // Check if the current user has liked the post
        const isLikedByCurrentUser = await Like.findOne({
          feed: feed._id,
          user: session?.user?.id, // Assuming session.user.id holds the current user's ID
        });
    
        return {
          ...feed.toObject(),
          likesCount, // Total number of likes
          isLikedByCurrentUser: !!isLikedByCurrentUser, // Boolean value indicating if the current user liked this feed
        };
      })
    );
    
  console.log(feeds)
  console.log(User)

  return (
  <div className="max-w-5xl h-full flex-col">
    <h1 className="text-2xl font-semibold text-center mb-6">Feeds</h1>
    <ul className="grid w-full grid-cols-1 sm:grid-cols-2 gap-6">
      {feedsWithLikes.map((feed) => (
        <li key={feed._id.toString()} className="bg-white rounded-lg shadow-md flex flex-col justify-between w-full sm:w-auto">
          <div className="h-[300px] w-full">
            <img
              src={feed.file}
              alt={feed.content}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-medium">{feed.content}</h2>
            <h2 className="text-gray-600">{feed.desc}</h2>
            <Link href={`/dashboard/feeds/${feed.user._id.toString()}`}>
              <p className="text-gray-600 cursor-pointer">Author: {feed?.user?.username}</p>
            </Link>
          </div>
          <div className="flex h- gap-4 mx-4 items-center justify-between"> {/* Use gap-4 for equal spacing */}
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
              <LikeButton id={feed._id.toString()} isLiked={feed.isLikedByCurrentUser} />
              <p className="text-sm">{feed.likesCount} likes</p> {/* Display the likes count */}
            </div>
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="w-10 h-10 cursor-pointer hover:opacity-80" /> {/* Adjust icon size */}
            </div>
            <div className="flex items-center bg-green-400 rounded-lg hover:bg-green-200 hover:text-white">
              <LikedByButton id={feed._id.toString()} />
            </div>
          </div>
          <div className="float-right w-full text-center">{feed.createdAt.toLocaleString()}</div>
        </li>
      ))}
    </ul>
    <div className="mt-8">
      <AdUnit />
    </div>
  </div>
  );
};

export default FeedsPage;
