"use client";
import { fetchLikes } from "../actions/fetchLikes";
import { useState, useEffect } from "react";

interface LikedByButtonProps {
  id: string;
}

const LikedByButton: React.FC<LikedByButtonProps> = ({ id }) => {
  const handleLikedBy = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    console.log("Button clicked");
    try {
      const DatabaseObject = await fetchLikes(id);
      // Extract the likedBy field
      const likedBy = DatabaseObject?.likedBy;

      if (likedBy) {
        console.log("likedBy field =", likedBy);
      } else {
        console.log("No likedBy field found");
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  return (
    <span className='text-blue-400 px-4 py-4 cursor-pointer w-28 mr-auto' onClick={handleLikedBy}>
      Liked by
    </span>
  );
};

export default LikedByButton;
