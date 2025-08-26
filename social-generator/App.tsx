import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { OriginalCardPreview, SocialPostPreview, SocialStoryPreview, WeeklyPostPreview, WeeklyStoryPreview } from './components/previews';
import { Strategy, Gradient, PreviewMode, EditorMode, WeeklyStrategy, WeeklyPreviewMode, ArticleContent } from './types';
import { GRADIENTS } from './constants';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { ClipboardIcon } from './components/icons/ClipboardIcon';
import { generateResearchPoints, generateStoryHook, summarizeResearch } from './services/geminiService';
import { Spinner } from './components/Spinner';
import { WeeklyPreviewControlPanel } from './components/WeeklyPreviewControlPanel';
import { ScheduleIcon } from './components/icons/ScheduleIcon';
import { ScheduleModal } from './components/ScheduleModal';

// Extend the Window interface to include htmlToImage and JSZip
declare global {
  interface Window {
    htmlToImage: any;
    JSZip: any;
  }
}

const initialStrategy: Strategy = {
  title: 'Choice Charter',
  howTo: "<h3>Introduce the Charter</h3><p>Explain that instead of surprise consequences, everyone will pre-commit to two options—an easy path and the hard path.</p><h3>Draft Your Pact</h3><p>Co-create a simple table listing for each student with a default consequence, an easy path, and a deep path.</p><h3>Sign & Post</h3><p>Have students sign their row on the chart and display it where the class can see.</p>",
  research: "<ul><li>Commitment bias signing ahead leverages <strong>consistency drives</strong>, reducing pushback.</li><li>Executive control pre-commitment recruits <strong>prefrontal circuits</strong> for automatic follow-through.</li><li>Social accountability from a public pledge engages <strong>social-brain networks</strong>, boosting compliance.</li></ul>",
};

const initialWeeklyStrategies: WeeklyStrategy[] = [
  {
    id: 1,
    title: 'Think-Pair-Share',
    summary: 'A classic collaborative method to boost engagement and deepen understanding.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    gradient: GRADIENTS[1], // Blue
  },
  {
    id: 2,
    title: 'Jigsaw',
    summary: 'Promote teamwork and individual accountability with this cooperative learning technique.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
    gradient: GRADIENTS[2], // Green
  },
  {
    id: 3,
    title: 'Exit Tickets',
    summary: 'Quickly gauge student comprehension at the end of a lesson with this simple formative assessment.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    gradient: GRADIENTS[3], // Purple
  },
];

const initialArticleContent: ArticleContent = {
  title: '3 New Strategies to Try This Week',
  subtitle: 'A weekly roundup of fresh ideas from the BrainZones community to engage your students and simplify your instruction.',
  image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop'
};


const App: React.FC = () => {
  // Global State
  const [editorMode, setEditorMode] = useState<EditorMode>('single');
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  
  // Single Strategy State
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy);
  const [image, setImage] = useState<string | null>('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop');
  const [selectedGradient, setSelectedGradient] = useState<Gradient>(GRADIENTS[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('card');
  const [storyHook, setStoryHook] = useState<string>('');
  const [isGeneratingHook, setIsGeneratingHook] = useState<boolean>(false);

  // Weekly Preview State
  const [weeklyStrategies, setWeeklyStrategies] = useState<WeeklyStrategy[]>(initialWeeklyStrategies);
  const [weeklyArticle, setWeeklyArticle] = useState<ArticleContent>(initialArticleContent);
  const [weeklyPreviewMode, setWeeklyPreviewMode] = useState<WeeklyPreviewMode>('post');
  
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const postContainerRef = useRef<HTMLDivElement>(null);
  const weeklyPostRef = useRef<HTMLDivElement>(null);
  const weeklyStoryContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGenerateResearch = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedResearch = await generateResearchPoints(strategy.title, strategy.howTo);
      setStrategy(prev => ({
        ...prev,
        research: `<ul>${generatedResearch}</ul>`
      }));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during AI generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [strategy.title, strategy.howTo]);

  const handleSummarizeResearch = useCallback(async () => {
    setIsSummarizing(true);
    setError(null);
    try {
        const summarizedResearch = await summarizeResearch(strategy.research);
        setStrategy(prev => ({
            ...prev,
            research: `<ul>${summarizedResearch}</ul>`
        }));
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred while summarizing.');
        }
    } finally {
        setIsSummarizing(false);
    }
  }, [strategy.research]);

  const handleGenerateHook = useCallback(async () => {
    setIsGeneratingHook(true);
    setError(null);
    try {
      const hook = await generateStoryHook(strategy.title, strategy.howTo);
      setStoryHook(hook);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Could not generate story hook.');
      }
    } finally {
      setIsGeneratingHook(false);
    }
  }, [strategy.title, strategy.howTo]);

  useEffect(() => {
    if (editorMode === 'single' && previewMode === 'story' && !storyHook && !isGeneratingHook) {
      handleGenerateHook();
    }
  }, [editorMode, previewMode, storyHook, isGeneratingHook, handleGenerateHook]);


  // Download Logic
  const handleDownload = useCallback(async (target: 'single' | 'weekly-post-zip' | 'weekly-story-zip') => {
      setIsDownloading(true);
      setError(null);
      
      const titleSlug = (editorMode === 'single' ? strategy.title : 'weekly-preview').toLowerCase().replace(/\s+/g, '-').slice(0, 50) || 'strategy';
      const imageOptions = { cacheBust: true, fetchRequestInit: { mode: 'cors' as RequestMode } };

      try {
          if (target === 'single' && previewMode === 'card' && cardRef.current) {
              const dataUrl = await window.htmlToImage.toPng(cardRef.current, { ...imageOptions, pixelRatio: 2 });
              downloadDataUrl(dataUrl, `${titleSlug}-card.png`);
          } else if (target === 'single' && previewMode === 'story' && storyRef.current) {
              const dataUrl = await window.htmlToImage.toPng(storyRef.current, { ...imageOptions, pixelRatio: 2 });
              downloadDataUrl(dataUrl, `${titleSlug}-story.png`);
          } else if (target === 'single' && previewMode === 'post' && postContainerRef.current) {
              await downloadSlidesAsZip(postContainerRef.current, `${titleSlug}-post-carousel.zip`);
          } else if (target === 'weekly-post-zip' && weeklyPostRef.current) {
              await downloadSlidesAsZip(weeklyPostRef.current, `${titleSlug}-post-carousel.zip`);
          } else if (target === 'weekly-story-zip' && weeklyStoryContainerRef.current) {
              await downloadSlidesAsZip(weeklyStoryContainerRef.current, `${titleSlug}-story-carousel.zip`);
          } else {
              throw new Error(`Could not find the element to download.`);
          }
      } catch (err) {
          console.error('Oops, something went wrong!', err);
          setError('Could not generate image(s). Please try again.');
      } finally {
          setIsDownloading(false);
          setIsDropdownOpen(false);
      }
  }, [editorMode, previewMode, strategy.title]);

  const downloadDataUrl = (dataUrl: string, filename: string) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
  };

  const downloadSlidesAsZip = async (container: HTMLElement, filename: string) => {
      const zip = new window.JSZip();
      const slideElements = container.querySelectorAll('.social-post-slide');
      const imageOptions = { cacheBust: true, fetchRequestInit: { mode: 'cors' as RequestMode }, pixelRatio: 2.5 };
      
      for (let i = 0; i < slideElements.length; i++) {
          const slide = slideElements[i] as HTMLElement;
          const dataUrl = await window.htmlToImage.toPng(slide, imageOptions);
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          zip.file(`slide-${i + 1}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(zipBlob);
      link.click();
      URL.revokeObjectURL(link.href);
  };

  const isCarouselPreview = editorMode === 'weekly' || (editorMode === 'single' && previewMode === 'post');
  
  const getActiveCarouselContainer = (): HTMLElement | null => {
    if (editorMode === 'weekly') {
      return weeklyPreviewMode === 'post' ? weeklyPostRef.current : weeklyStoryContainerRef.current;
    }
    if (editorMode === 'single' && previewMode === 'post') {
      return postContainerRef.current;
    }
    return null;
  };

  const handleSchedulePost = async (caption: string) => {
      const container = getActiveCarouselContainer();
      if (!container) {
          setError('Could not find the carousel content to schedule.');
          return;
      }

      setIsScheduling(true);
      setError(null);

      try {
          const slideElements = container.querySelectorAll('.social-post-slide');
          const imageOptions = { cacheBust: true, fetchRequestInit: { mode: 'cors' as RequestMode }, pixelRatio: 2.5 };
          const images: string[] = [];

          for (let i = 0; i < slideElements.length; i++) {
              const slide = slideElements[i] as HTMLElement;
              const dataUrl = await window.htmlToImage.toPng(slide, imageOptions);
              images.push(dataUrl);
          }

          const response = await fetch('/api/scheduleWithZoho', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ caption, images }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Scheduling failed. Check the server logs.');
          }

          const result = await response.json();
          alert(result.message); // Simple success feedback
          setIsScheduleModalOpen(false);

      } catch (err) {
          console.error('Scheduling failed:', err);
          if (err instanceof Error) {
            setError(`Scheduling failed: ${err.message}`);
          } else {
            setError('An unknown error occurred during scheduling.');
          }
      } finally {
          setIsScheduling(false);
      }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result as string); };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleImageUrlChange = (url: string) => { setImage(url); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const renderSingleModePreviews = () => (
    <>
      <div className="mb-4 flex justify-center border-b border-slate-300 dark:border-slate-700">
          <button onClick={() => setPreviewMode('card')} className={`px-4 py-2 text-sm font-semibold ${previewMode === 'card' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Card</button>
          <button onClick={() => setPreviewMode('post')} className={`px-4 py-2 text-sm font-semibold ${previewMode === 'post' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Post (1:1)</button>
          <button onClick={() => setPreviewMode('story')} className={`px-4 py-2 text-sm font-semibold ${previewMode === 'story' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Story (9:16)</button>
      </div>
      {previewMode === 'story' && (
        <div className="mb-4 flex justify-center">
          <button onClick={handleGenerateHook} disabled={isGeneratingHook} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {isGeneratingHook ? <><Spinner className="w-4 h-4" />Generating...</> : "✨ Regenerate Story Hook"}
          </button>
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        {previewMode === 'card' && <div className="w-full max-w-5xl"><OriginalCardPreview ref={cardRef} strategy={strategy} image={image} gradientClass={selectedGradient.class} /></div>}
        {previewMode === 'post' && <div className="w-full max-w-lg"><SocialPostPreview ref={postContainerRef} strategy={strategy} gradient={selectedGradient} image={image} gradientClass={selectedGradient.class} isSummarizing={isSummarizing} handleSummarizeResearch={handleSummarizeResearch} /></div>}
        {previewMode === 'story' && <div className="w-full max-w-[280px]"><SocialStoryPreview ref={storyRef} strategy={strategy} image={image} gradientClass={selectedGradient.class} hook={storyHook} isLoadingHook={isGeneratingHook} /></div>}
      </div>
    </>
  );

  const renderWeeklyModePreviews = () => (
    <>
      <div className="mb-4 flex justify-center border-b border-slate-300 dark:border-slate-700">
        <button onClick={() => setWeeklyPreviewMode('post')} className={`px-4 py-2 text-sm font-semibold ${weeklyPreviewMode === 'post' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Post (1:1)</button>
        <button onClick={() => setWeeklyPreviewMode('story')} className={`px-4 py-2 text-sm font-semibold ${weeklyPreviewMode === 'story' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Story (9:16)</button>
      </div>
      <div className="w-full flex items-center justify-center">
        {weeklyPreviewMode === 'post' && <div className="w-full max-w-lg"><WeeklyPostPreview ref={weeklyPostRef} strategies={weeklyStrategies} article={weeklyArticle} /></div>}
        {weeklyPreviewMode === 'story' && <div className="w-full max-w-[280px]"><WeeklyStoryPreview ref={weeklyStoryContainerRef} strategies={weeklyStrategies} /></div>}
      </div>
    </>
  );

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      <header className="w-full lg:hidden p-4 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2"><div className="bg-blue-500 p-2 rounded-lg"><ClipboardIcon className="w-6 h-6 text-white"/></div><h1 className="text-xl font-bold">Strategy Card Generator</h1></div>
      </header>

      <div className="w-full lg:w-[450px] lg:min-w-[450px] bg-white dark:bg-slate-800 lg:h-full overflow-y-auto p-6 flex flex-col gap-6">
        <div className="hidden lg:flex items-center gap-3"><div className="bg-blue-500 p-2 rounded-lg"><ClipboardIcon className="w-6 h-6 text-white"/></div><h1 className="text-xl font-bold">Strategy Card Generator</h1></div>
        
        <div className="flex w-full rounded-lg bg-slate-200 dark:bg-slate-700 p-1">
          <button onClick={() => setEditorMode('single')} className={`flex-1 p-2 text-sm font-bold rounded-md transition-colors ${editorMode === 'single' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-600/50'}`}>Strategy Card</button>
          <button onClick={() => setEditorMode('weekly')} className={`flex-1 p-2 text-sm font-bold rounded-md transition-colors ${editorMode === 'weekly' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-600/50'}`}>Weekly Preview</button>
        </div>
        
        <div className="flex-grow">
            {editorMode === 'single' ? (
              <ControlPanel strategy={strategy} setStrategy={setStrategy} handleImageUpload={handleImageUpload} handleImageUrlChange={handleImageUrlChange} selectedGradient={selectedGradient} setSelectedGradient={setSelectedGradient} isGenerating={isGenerating} handleGenerateResearch={handleGenerateResearch} />
            ) : (
              // FIX: `setArticle` was passed instead of `setWeeklyArticle`. The state setter from useState is `setWeeklyArticle`.
              <WeeklyPreviewControlPanel strategies={weeklyStrategies} setStrategies={setWeeklyStrategies} article={weeklyArticle} setArticle={setWeeklyArticle} setError={setError} />
            )}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 bg-slate-100 dark:bg-slate-900/80 overflow-y-auto">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-5xl" role="alert">{error} <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 font-bold">X</button></div>}
        <div className="w-full max-w-5xl">
          {editorMode === 'single' ? renderSingleModePreviews() : renderWeeklyModePreviews()}
        </div>
        
        <div className="mt-8 flex gap-4 pb-8">
           <div className="dropdown" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(prev => !prev)} disabled={isDownloading} className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900">
                  {isDownloading ? <Spinner className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
                  {isDownloading ? 'Packaging...' : 'Download'}
              </button>
              <div className={`dropdown-content ${isDropdownOpen ? 'block' : 'hidden'}`}>
                  {editorMode === 'single' ? (
                    <>
                      <button onClick={() => handleDownload('single')} disabled={previewMode !== 'card'}>Original Card (.png)</button>
                      <button onClick={() => handleDownload('single')} disabled={previewMode !== 'post'}>Social Post Carousel (.zip)</button>
                      <button onClick={() => handleDownload('single')} disabled={previewMode !== 'story'}>Social Story (.png)</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleDownload('weekly-post-zip')}>Weekly Post Carousel (.zip)</button>
                      <button onClick={() => handleDownload('weekly-story-zip')}>Weekly Story Carousel (.zip)</button>
                    </>
                  )}
              </div>
            </div>
            {isCarouselPreview && (
                 <button onClick={() => setIsScheduleModalOpen(true)} disabled={isScheduling} className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900">
                    <ScheduleIcon className="w-5 h-5"/>
                    Schedule
                </button>
            )}
        </div>
      </main>

      {isScheduleModalOpen && (
          <ScheduleModal 
              onClose={() => setIsScheduleModalOpen(false)}
              onSchedule={handleSchedulePost}
              isScheduling={isScheduling}
          />
      )}
    </div>
  );
};

export default App;
