"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function FileUpload() {
    const { data: session } = useSession();
    
    const [file, setFile] = useState<File | null>(null);
    const [videofile, setVideoFile] = useState<File | null>(null);
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70 MB

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            alert("File size too large");
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        if (session?.user?.id) {
            formData.append("user", session.user.id);
          }
        formData.append("user", session?.user?.id || "");
        formData.append("content", title);
        formData.append("desc", desc);
        if (file) formData.append("file", file);
        if (videofile) formData.append("videofile", videofile);

        formData.append("email", email);
        try {
            const response = await axios.post("/api/auth/Feeds", formData, {
                headers: {
                    'Authorization': `Bearer ${session}`, // Adjust as needed
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error("Error during feed creation:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 h-screen">
            {file && <p>Selected image: {file.name}</p>}
            {videofile && <p>Selected video: {videofile.name}</p>}
            <h1 className="text-2xl font-bold mb-4">Upload Feed</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload(Optional)</label>
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full p-2 bg-blue-500 text-white font-bold rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
}
