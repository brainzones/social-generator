import React, { forwardRef, useState, useMemo } from 'react';
import type { WeeklyStrategy, ArticleContent } from '../../types';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface WeeklyPostPreviewProps {
  strategies: WeeklyStrategy[];
  article: ArticleContent;
}

export const WeeklyPostPreview = forwardRef<HTMLDivElement, WeeklyPostPreviewProps>(
  ({ strategies, article }, ref) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = useMemo(() => [
        { type: 'article', ...article },
        ...strategies.map(s => ({ type: 'strategy', ...s })),
        { type: 'cta' }
    ], [strategies, article]);

    const totalSlides = slides.length;
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    const renderSlideContent = (slide: any) => {
        switch (slide.type) {
            case 'article':
                return (
                    <div className="w-full h-full flex flex-col justify-center items-center text-center text-white relative p-8">
                         {slide.image && <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110" />}
                         <div className="absolute inset-0 bg-slate-800/60" />
                         <div className="relative z-10">
                            <img 
                                src="https://cdn.prod.website-files.com/5d9c866859eb47e3e2d770a7/5faad37c516c84b162dc21c2_logo-lg.png" 
                                alt="BrainZones Logo" 
                                className="w-10 h-10 mx-auto mb-4" 
                            />
                            <p className="font-semibold text-white/80 mb-2 uppercase tracking-wider text-sm">From our Substack</p>
                            <h1 className="text-5xl font-extrabold drop-shadow-md">{slide.title}</h1>
                            <p className="text-lg text-white/90 drop-shadow max-w-lg mx-auto mt-4">{slide.subtitle}</p>
                         </div>
                    </div>
                );
            case 'strategy':
                return (
                    <div className="w-full h-full flex flex-col bg-white">
                        <div className="w-full h-1/2 relative overflow-hidden">
                           {slide.image && <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />}
                           <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient.class} opacity-70`} />
                        </div>
                        <div className="w-full h-1/2 flex flex-col justify-center p-8 text-center" style={{ backgroundColor: slide.gradient.color }}>
                            <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">{slide.title}</h2>
                            <p className="text-lg text-white/90 drop-shadow-sm mt-2">{slide.summary}</p>
                        </div>
                    </div>
                );
            case 'cta':
                 return (
                    <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center bg-white">
                        <img 
                            src="https://cdn.prod.website-files.com/5d9c866859eb47e3e2d770a7/5faad37c516c84b162dc21c2_logo-lg.png" 
                            alt="BrainZones Logo" 
                            className="w-12 h-12 mb-4" 
                        />
                    <p className="text-2xl font-bold text-slate-700">Find more strategies at</p>
                    <h2 className="text-4xl font-extrabold mt-2" style={{ color: '#13a0e9' }}>brainzones.org</h2>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
      <div className="relative w-full aspect-square">
        <div ref={ref} className="w-full aspect-square overflow-hidden rounded-2xl shadow-lg bg-white">
            <div 
                className="w-full h-full flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="social-post-slide w-full h-full flex-shrink-0 relative font-sans">
                       {renderSlideContent(slide)}
                    </div>
                ))}
            </div>
        </div>
        
         {/* Navigation */}
        <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-slate-700 transition z-20">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-slate-700 transition z-20">
            <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${currentSlide === i ? 'bg-slate-700' : 'bg-slate-300'}`} />
            ))}
        </div>
      </div>
    );
  }
);