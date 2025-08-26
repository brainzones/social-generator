

import React, { forwardRef } from 'react';
import type { Strategy } from '../../types';
import { Spinner } from '../Spinner';

interface SocialStoryPreviewProps {
  strategy: Strategy;
  image: string | null;
  gradientClass: string;
  hook: string;
  isLoadingHook: boolean;
}

export const SocialStoryPreview = forwardRef<HTMLDivElement, SocialStoryPreviewProps>(
  ({ strategy, image, gradientClass, hook, isLoadingHook }, ref) => {

    return (
      <div 
        ref={ref} 
        className="w-full aspect-[9/16] font-sans flex flex-col justify-between p-6 bg-slate-800 rounded-2xl overflow-hidden shadow-lg relative text-white"
      >
        {image && (
            <img src={image} alt="Strategy background" className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
        
        <div className="relative z-10 flex flex-col justify-center flex-grow text-center">
             <img 
                src="https://cdn.prod.website-files.com/5d9c866859eb47e3e2d770a7/5faad37c516c84b162dc21c2_logo-lg.png" 
                alt="BrainZones Logo" 
                className="w-10 h-10 mx-auto mb-4" 
              />
             <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg">{strategy.title}</h1>
             <div className="mt-4 text-lg text-white/90 drop-shadow-md h-20 flex items-center justify-center">
                {isLoadingHook ? (
                    <Spinner className="w-6 h-6" />
                ) : (
                    <p>{hook}</p>
                )}
             </div>
        </div>
        
        <div className="relative z-10 text-center">
            <p className="text-sm font-semibold text-white/80">A new strategy from</p>
            <p className="text-xl font-bold">BrainZones</p>
        </div>
      </div>
    );
  }
);
