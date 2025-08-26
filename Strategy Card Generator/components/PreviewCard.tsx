import React, { forwardRef } from 'react';
import type { Strategy } from '../../types';

interface PreviewCardProps {
  strategy: Strategy;
  image: string | null;
  gradientClass: string;
}

export const OriginalCardPreview = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ strategy, image, gradientClass }, ref) => {

    return (
      <div 
        ref={ref} 
        className="w-full font-sans flex flex-col gap-8"
      >
        {/* Card 1: Image Header */}
        <div className="relative w-full h-64 md:h-72 rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white">
           {image && (
            <img src={image} alt="Strategy background" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
        </div>

        {/* Content Cards Container */}
        <div className="w-full flex flex-col lg:flex-row gap-8">
            
            {/* Card 2: How-To */}
            <div className="lg:w-2/3 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-10">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8">{strategy.title}</h2>
                <div
                  className="how-to-content"
                  dangerouslySetInnerHTML={{ __html: strategy.howTo }}
                />
            </div>
            
            {/* Card 3: Research */}
            <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">🔬 Research</h3>
                <div
                  className="research-content"
                  dangerouslySetInnerHTML={{ __html: strategy.research }}
                />
            </div>
        </div>
      </div>
    );
  }
);