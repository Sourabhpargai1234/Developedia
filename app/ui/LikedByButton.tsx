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
  const [likedBy, setLikedBy] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLikedBy = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    console.log("Button clicked");

    try {
      const databaseObject = await fetchLikes(id);
      console.log("Object=", databaseObject);

      // Assuming the fetched data is an array and you want the first object
      if (databaseObject && databaseObject.length > 0) {
        const user = databaseObject[0]?.user;

        if (user) {
          setLikedBy({
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
          });
          console.log("Liked by field =", user);
        } else {
          console.log("No user field found in the object");
        }
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
      setError("Failed to fetch likes.");
    }
  };

  return (
    <div className="w-3/4 flex items-center justify-center flex-col">
      <span
        className="text-blue-400 px-4 py-4 cursor-pointer w-28 mr-auto"
        onClick={handleLikedBy}
      >
        Liked by
      </span>

      {likedBy && (
        <div className="w-full flex bg-blue-500 justify-between items-center">
          <p className="float-left">{likedBy.username}</p>
          {likedBy.profilePicture && (
            <img
              src={likedBy.profilePicture}
              alt={`${likedBy.username}'s profile`}
              className="w-10 h-10 rounded-full float-right"
            />
          )}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LikedByButton;
