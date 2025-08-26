import React, { forwardRef, useState, useMemo } from 'react';
import type { WeeklyStrategy } from '../../types';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface WeeklyStoryPreviewProps {
  strategies: WeeklyStrategy[];
}

export const WeeklyStoryPreview = forwardRef<HTMLDivElement, WeeklyStoryPreviewProps>(
  ({ strategies }, ref) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = useMemo(() => [
      { type: 'intro' },
      ...strategies.map(s => ({ type: 'strategy', ...s })),
      { type: 'cta' }
    ], [strategies]);

    const totalSlides = slides.length;
    const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

    return (
      <div className="relative w-full aspect-[9/16]">
        <div ref={ref} className="w-full aspect-[9/16] overflow-hidden rounded-2xl shadow-lg bg-white">
          <div
            className="w-full h-full flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="social-post-slide w-full h-full flex-shrink-0 relative text-white font-sans flex flex-col justify-between p-6">
                {slide.type === 'intro' && (
                  <>
                    <img src={strategies[0]?.image || ''} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110" />
                    <div className="absolute inset-0 bg-slate-800/60" />
                    <div className="relative z-10 flex flex-col justify-center items-center text-center flex-grow">
                      <p className="font-semibold text-white/80">THIS WEEK ON BRAINZONES</p>
                      <h1 className="text-4xl font-extrabold mt-2 drop-shadow-lg">3 New Strategies</h1>
                    </div>
                  </>
                )}
                {slide.type === 'strategy' && 'gradient' in slide && (
                  <>
                    {slide.image && <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110" />}
                    <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient.class}`} />
                    <div className="relative z-10 flex flex-col justify-center text-center flex-grow">
                        <h2 className="text-4xl font-extrabold leading-tight drop-shadow-lg">{slide.title}</h2>
                        <p className="mt-4 text-lg text-white/90 drop-shadow-md">{slide.summary}</p>
                    </div>
                  </>
                )}
                 {slide.type === 'cta' && (
                  <>
                    <div className="absolute inset-0 bg-white" />
                     <div className="relative z-10 flex flex-col justify-center items-center text-center flex-grow">
                         <img src="https://cdn.prod.website-files.com/5d9c866859eb47e3e2d770a7/5faad37c516c84b162dc21c2_logo-lg.png" alt="BrainZones Logo" className="w-12 h-12 mb-4" />
                        <p className="text-2xl font-bold text-slate-700">Find more strategies at</p>
                        <h2 className="text-4xl font-extrabold mt-2" style={{ color: '#13a0e9' }}>brainzones.org</h2>
                     </div>
                  </>
                )}

                 {/* Shared Footer */}
                 <div className="relative z-10 text-center">
                    {(slide.type === 'intro' || slide.type === 'strategy') && (
                        <>
                            <p className="text-sm font-semibold text-white/80">A new strategy from</p>
                            <p className="text-xl font-bold">BrainZones</p>
                        </>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-slate-700 transition z-20 disabled:opacity-0" disabled={currentSlide === 0}>
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-slate-700 transition z-20 disabled:opacity-0" disabled={currentSlide === totalSlides - 1}>
            <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {slides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${currentSlide >= i ? 'bg-white/80' : 'bg-white/40'}`} style={{width: `${(1 / totalSlides) * 100}%`}}/>
            ))}
        </div>
      </div>
    );
  }
);
