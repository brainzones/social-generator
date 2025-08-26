

import React, { useState } from 'react';
import type { Strategy, Gradient } from '../types';
import { GRADIENTS } from '../constants';
import { UploadIcon } from './icons/UploadIcon';
import ReactQuill from 'react-quill';
import { Spinner } from './Spinner';

interface ControlPanelProps {
  strategy: Strategy;
  setStrategy: (strategy: Strategy) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUrlChange: (url: string) => void;
  selectedGradient: Gradient;
  setSelectedGradient: (gradient: Gradient) => void;
  isGenerating: boolean;
  handleGenerateResearch: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  strategy,
  setStrategy,
  handleImageUpload,
  handleImageUrlChange,
  selectedGradient,
  setSelectedGradient,
  isGenerating,
  handleGenerateResearch,
}) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleFieldChange = (field: keyof Strategy, value: string) => {
    setStrategy({ ...strategy, [field]: value });
  };
  
  const handleApplyUrl = () => {
    if (imageUrl.trim()) {
      handleImageUrlChange(imageUrl.trim());
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [3, false] }], // Use a dropdown for H3 or Normal text
      ['bold', 'italic'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ],
  };

  return (
    <div className="space-y-8">
      {/* Content Editing Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">1. Edit Your Content</h3>
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={strategy.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h4 className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">How-To</h4>
          <div className="bg-white dark:bg-slate-800 rounded-lg">
             <ReactQuill
                theme="snow"
                value={strategy.howTo}
                onChange={(html) => handleFieldChange('howTo', html)}
                modules={quillModules}
             />
          </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
            <h4 className="block text-sm font-bold text-slate-700 dark:text-slate-300">Research</h4>
            <button 
              onClick={handleGenerateResearch} 
              disabled={isGenerating}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isGenerating ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Generating...
                </>
              ) : (
                "✨ Generate with AI"
              )}
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg">
             <ReactQuill
                theme="snow"
                value={strategy.research}
                onChange={(html) => handleFieldChange('research', html)}
                modules={quillModules}
             />
          </div>
        </div>
      </div>

      {/* Style Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
            2. Customize Style
          </h3>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Background Image
          </label>
          <label htmlFor="image-upload" className="group cursor-pointer w-full p-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition">
            <UploadIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 mb-2 transition" />
            <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">Click to upload or replace</span>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <div className="mt-4">
            <label htmlFor="image-url" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Or paste image URL</label>
            <div className="flex gap-2">
                <input
                  id="image-url"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="flex-grow p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyUrl}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
                >
                  Apply
                </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Color Gradient
          </label>
          <div className="grid grid-cols-5 gap-2">
            {GRADIENTS.map((gradient) => (
              <button
                key={gradient.name}
                onClick={() => setSelectedGradient(gradient)}
                className={`w-full h-12 rounded-lg ${gradient.preview} ${selectedGradient.name === gradient.name ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-800' : 'ring-1 ring-inset ring-black/10'}`}
                title={gradient.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};