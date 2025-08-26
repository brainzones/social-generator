import React, { forwardRef, useState, useMemo } from 'react';
import type { Strategy, Gradient } from '../../types';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { Spinner } from '../Spinner';

interface SocialPostPreviewProps {
  strategy: Strategy;
  gradient: Gradient;
  image: string | null;
  gradientClass: string;
  isSummarizing: boolean;
  handleSummarizeResearch: () => void;
}

// A simple utility to strip HTML tags from a string.
const cleanHtml = (htmlString: string): string => {
    if(!htmlString) return "";
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
};

const parseHowToSlides = (htmlContent: string): { title: string; content: string }[] => {
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  const slides: { title: string; content: string }[] = [];
  let currentSlideContent = { title: '', content: '' };

  container.childNodes.forEach(node => {
    if (node.nodeName === 'H3') {
      // If we have content for a previous slide, push it
      if (currentSlideContent.title || currentSlideContent.content) {
        slides.push(currentSlideContent);
      }
      // Start a new slide
      currentSlideContent = { title: (node as HTMLElement).innerHTML, content: '' };
    } else if (node.nodeType === Node.ELEMENT_NODE) { // any other element
      currentSlideContent.content += (node as HTMLElement).outerHTML;
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) { // any text
      currentSlideContent.content += `<p>${node.textContent}</p>`;
    }
  });
  // Push the last slide
  if (currentSlideContent.title || currentSlideContent.content) {
    slides.push(currentSlideContent);
  }
  return slides;
};


export const SocialPostPreview = forwardRef<HTMLDivElement, SocialPostPreviewProps>(
  ({ strategy, gradient, image, gradientClass, isSummarizing, handleSummarizeResearch }, ref) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = useMemo(() => {
        const howToSlides = parseHowToSlides(strategy.howTo);
        
        const allSlides = [
            { type: 'title', title: '', content: '' },
            ...howToSlides.map(s => ({...s, type: 'howTo' })),
        ];

        if (strategy.research && cleanHtml(strategy.research).trim()) {
            allSlides.push({ type: 'research', title: '🔬 Research', content: strategy.research });
        }

        allSlides.push({ type: 'cta', title: '', content: '' });
        
        return allSlides;
    }, [strategy.howTo, strategy.research]);

    const totalSlides = slides.length;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    
    return (
        <div className="relative w-full aspect-square">
            <div ref={ref} className="w-full aspect-square overflow-hidden rounded-2xl shadow-lg bg-white">
                <div 
                    className="w-full h-full flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="social-post-slide w-full h-full flex-shrink-0 relative">
                            {slide.type === 'title' && (
                                <div className="relative w-full h-full flex flex-col justify-center items-center p-8 text-center text-white">
                                    {image && (
                                        <img src={image} alt="Strategy background" className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110" />
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
                                    <div className="relative z-10">
                                        <p className="text-xl font-semibold text-white/80 mb-2">A BrainZones Strategy</p>
                                        <h1 className="text-5xl font-extrabold drop-shadow-md">{strategy.title}</h1>
                                    </div>
                                </div>
                            )}
                            {slide.type === 'howTo' && (
                                <div className="w-full h-full flex flex-col justify-center items-center p-12 text-center bg-white">
                                <h3 className="text-3xl font-bold mb-6" style={{ color: gradient.color }} dangerouslySetInnerHTML={{ __html: slide.title }} />
                                <div className="text-slate-600 text-xl how-to-content" dangerouslySetInnerHTML={{ __html: slide.content }} />
                                </div>
                            )}
                            {slide.type === 'research' && (
                                <div className="w-full h-full flex flex-col justify-center items-start p-12 bg-white">
                                    <h3 className="text-3xl font-bold mb-6 w-full text-center" style={{ color: gradient.color }} dangerouslySetInnerHTML={{ __html: slide.title }} />
                                    <div className="text-slate-600 text-xl research-content w-full" dangerouslySetInnerHTML={{ __html: slide.content }} />
                                    <div className="absolute bottom-4 right-4 z-10">
                                        <button 
                                            onClick={handleSummarizeResearch}
                                            disabled={isSummarizing}
                                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-100/50 hover:bg-blue-100 rounded-full px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            title="Simplify research with AI"
                                        >
                                            {isSummarizing ? (
                                                <>
                                                    <Spinner className="w-4 h-4" />
                                                    Simplifying...
                                                </>
                                            ) : (
                                                "✨ Simplify with AI"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {slide.type === 'cta' && (
                                <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center bg-white">
                                    <img 
                                        src="https://cdn.prod.website-files.com/5d9c866859eb47e3e2d770a7/5faad37c516c84b162dc21c2_logo-lg.png" 
                                        alt="BrainZones Logo" 
                                        className="w-12 h-12 mb-4" 
                                    />
                                <p className="text-2xl font-bold text-slate-700">Find more strategies at</p>
                                <h2 className="text-4xl font-extrabold mt-2" style={{ color: '#13a0e9' }}>brainzones.org</h2>
                                </div>
                            )}
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