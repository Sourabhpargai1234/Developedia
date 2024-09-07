'use client';

import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface LikeButtonProps {
  id: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ id }) => {
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

      console.log(response.data); // Adjust the log to show response data
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <HandThumbUpIcon
      className="cursor-pointer hover:opacity-80"
      onClick={handleLike}
    />

  );
};

export default LikeButton;
