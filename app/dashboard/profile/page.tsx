"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";
import { applyHoverScale, revertScale } from "@/app/ui/gsap/SizeAnimations";
import { fetchFeed } from "@/app/actions/fetchFeed";
import DashboardSkeleton from "@/app/ui/skeletons";

export default function Home() {
  const linkRef1 = useRef<HTMLAnchorElement | null>(null);

  const { status, data: session } = useSession();
  console.log("Session=",session)
  const [feeds, setFeed] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  console.log("id: ",session?.user?.id)
  useEffect(() => {
    const getFeeds = async () => {
      if (session?.user?.id) {
        try {
          const fetchedFeeds = await fetchFeed(session?.user?.id);
          setFeed(fetchedFeeds);
        } catch (error) {
          setError("Failed to fetch feeds");
        }
      }
    };
    getFeeds();
  }, [session]);
  console.log("Feeds: ",feeds)
  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="w-full">
          <div className="float-left">
            <h1 className="text-3xl">Welcome {session?.user?.username}</h1>
            <h1>{session?.user?.email}</h1>
            <h1>{session?.user?.bio || "No bio available"}</h1>
          </div>
          <img
                src={session?.user?.image}
                alt='Profile pic'
                height={100}
                width={100}
                className="float-right rounded-full"
              />
        </div>
      );
    } else if (status === "loading") {
      return (
        <div>
            <h1 className="text-2xl font-semibold text-center mb-6 mr-auto w-3/5">Your Uploads</h1>
            <DashboardSkeleton />
        </div>
      );
    } else {
      return (
        <Link
          href="/ui/login"
          ref={linkRef1}
          className="font-bold text-2xl text-[#888] inline-block mt-7 ml-[-58px] md:ml-0 transition duration-150 ease hover:text-white flex justify-center items-center top-1/2 left-1/2 absolute hover:bg-green-400 transition-transform duration-300 ease-in-out transform hover:scale-200 hover:rounded-xl"
          onMouseEnter={() => applyHoverScale(linkRef1.current)}
          onMouseLeave={() => revertScale(linkRef1.current)}
        >
          Login here
        </Link>
      );
    }
  };

  console.log("Feeds", feeds);
  return (
    <main className="flex flex-col h-screen sm:h-full w-full relative">
      {showSession()}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="max-w-5xl p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">{session?(feeds.length==0?"You haven't uploaded anything yet":"Your uploads"):""}</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feeds.map((feed:any) => (
          <li key={feed._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-4 aspect-h-4">
              <img
                src={feed.file}
                alt={feed.content}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium">{feed.content}</h2>
              <p className="text-gray-600">{feed.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </main>
  );
}
