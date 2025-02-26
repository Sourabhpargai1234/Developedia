import React from 'react';
import { Metadata } from 'next';
import EditorPanel from '@/app/ui/CodeEditor/EditorPanel';

export const metadata: Metadata = {
    title: 'About',
};
  
  export default function CodeEditor() {
    return (
      <div className="w-full h-full p-8 bg-gray-100 text-gray-900">
        <EditorPanel />
      </div>
    );
  }