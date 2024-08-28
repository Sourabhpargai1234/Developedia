import { connectDB } from '@/libs/mongodb';
import { Feed } from '@/app/types'; 


const FeedsPage = async () => {
  const db = await connectDB();
  const feedsCollection = db.collection<Feed>('feeds');

  const feeds = await feedsCollection.find({}).toArray();

  return (
    <div className="max-w-5xl p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Feeds</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feeds.map((feed) => (
          <li key={feed._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-4 aspect-h-4">
              <img
                src={feed.image}
                alt={feed.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium">{feed.title}</h2>
              <p className="text-gray-600">{feed.desc}</p>
              <p className="text-gray-500 text-sm mt-2">Email: {feed.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedsPage;
