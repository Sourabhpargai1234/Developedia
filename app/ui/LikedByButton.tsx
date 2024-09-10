"use client";
import { fetchLikes } from "../actions/fetchLikes";
import { useState } from "react";

interface LikedByButtonProps {
  id: string;
}

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

const LikedByButton: React.FC<LikedByButtonProps> = ({ id }) => {
  const [likedBy, setLikedBy] = useState<User[]>([]); // Set likedBy to an array of users
  const [error, setError] = useState<string | null>(null);

  const handleLikedBy = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    console.log("Button clicked");

    try {
      const databaseObject = await fetchLikes(id);
      console.log("Object=", databaseObject);

      // Check if data exists and set likedBy to an array of users
      if (databaseObject && databaseObject.length > 0) {
        const users = databaseObject.map((item: any) => ({
          _id: item?.user?._id,
          username: item?.user?.username,
          profilePicture: item?.user?.profilePicture,
        }));

        setLikedBy(users); // Update the state with the array of users
        console.log("Liked by users =", users);
      } else {
        console.log("No data found");
        setLikedBy([]); // Clear the likedBy array if no data is found
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
      setError("Failed to fetch likes.");
    }
  };

  return (
    <div className="w-3/4 flex items-center justify-center flex-col">
      <span
        className="text-white px-4 py-4 cursor-pointer w-28 mr-auto hover:text-black"
        onClick={handleLikedBy}
      >
        Liked by
      </span>

      {/* Render the list of users who liked */}
      {likedBy.length > 0 && (
        <div className="w-full flex flex-col bg-blue-500 justify-between items-center">
          {likedBy.map((user) => (
            <div
              key={user._id}
              className="w-full flex justify-between items-center mb-2 p-2 bg-blue-600 rounded"
            >
              <p className="float-left">{user.username}</p>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={`${user.username}'s profile`}
                  className="w-10 h-10 rounded-full float-right"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LikedByButton;
