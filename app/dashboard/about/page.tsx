import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
};

export default function Aboutpage() {
  return (
    <div className="w-full h-auto p-8 bg-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg mb-6">
          Welcome to <span className="font-semibold">Devlopedia</span>, the ultimate social platform built by developers, for developers!
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          Our mission is to create a vibrant community where developers can:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <span className="font-semibold">Share Knowledge:</span> Whether it’s a new coding technique, a blog post, or an open-source project, DevConnect is the place to share your ideas and get feedback from fellow developers.
          </li>
          <li className="mb-2">
            <span className="font-semibold">Collaborate:</span> Find like-minded developers to collaborate on projects, hackathons, or learning new technologies. DevConnect makes it easy to connect with peers who share your interests.
          </li>
          <li className="mb-2">
            <span className="font-semibold">Learn Together:</span> Stay ahead of the curve by learning from others. Discover tutorials, articles, and discussions that can help you enhance your skills and stay up-to-date with the latest in tech.
          </li>
          <li>
            <span className="font-semibold">Showcase Your Work:</span> Use your profile to showcase your projects, code snippets, and achievements. Let the world see what you're building!
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Why DevConnect?</h2>
        <p className="text-lg mb-6">
          <span className="font-semibold">Developer-Centric:</span> Unlike other social platforms, DevConnect is built specifically for developers. Every feature is designed with developers in mind, from code sharing to project collaboration.
        </p>
        <p className="text-lg mb-6">
          <span className="font-semibold">Supportive Community:</span> Our community is made up of developers who are eager to help each other succeed. Whether you’re asking for advice, sharing a project, or providing feedback, you’ll find a supportive environment here.
        </p>
        <p className="text-lg">
          <span className="font-semibold">Continuous Improvement:</span> We are constantly improving and adding new features based on feedback from our users. Your input helps shape the future of DevConnect!
        </p>
      </div>
    </div>
  );
}

