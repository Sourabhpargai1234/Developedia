'use client';

import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useState } from 'react';

interface LikeButtonProps {
  id: string;
  isLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ id, isLiked: initialLikedState }) => {
  const [liked, setLiked] = useState(initialLikedState);
  const { data: session } = useSession();

  const handleLike = async () => {
    try {
      console.log("Button clicked");
      const likedBy = session?.user?.id;
      console.log("User=",likedBy)
      const liked = id;
      console.log("liked=",liked);

      // Ensure both `liked` and `likedBy` are valid before proceeding
      if (!liked || !likedBy) {
        console.error("Missing data for like or likedBy");
        setLiked(false);
        return;
      }

      const formData = new FormData();
      formData.append("liked", liked);
      formData.append("likedBy", likedBy);
      console.log(formData);
      const response = await axios.post("/api/auth/Likes", formData, {
        headers: {
          'Authorization': `Bearer ${session}`, // Use an appropriate token if needed
          'Content-Type': 'multipart/form-data',
        },
      }); 

      if(response?.data?.message=="Like deleted successfully") setLiked(false);
      else setLiked(true);
      console.log(response.data); // Adjust the log to show response data
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <HandThumbUpIcon
      className={`cursor-pointer hover:opacity-80 ${liked ? 'text-blue-500' : 'text-gray-500'}`}
      onClick={handleLike}
      fill={liked ? 'blue' : 'gray'} // Change the fill color based on the liked state
    />
  );
};

export default LikeButton;
