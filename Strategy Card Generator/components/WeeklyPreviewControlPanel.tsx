import React, { useState, useCallback } from 'react';
import type { WeeklyStrategy, ArticleContent } from '../types';
import { GRADIENTS } from '../constants';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './Spinner';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { generateStrategySummary } from '../services/geminiService';

interface WeeklyPreviewControlPanelProps {
  strategies: WeeklyStrategy[];
  setStrategies: (strategies: WeeklyStrategy[]) => void;
  article: ArticleContent;
  setArticle: (article: ArticleContent) => void;
  setError: (error: string | null) => void;
}

const ArticleEditor: React.FC<{ article: ArticleContent; onUpdate: (article: ArticleContent) => void; }> = ({ article, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [imageUrl, setImageUrl] = useState('');

    const handleFieldChange = (field: keyof ArticleContent, value: any) => {
        onUpdate({ ...article, [field]: value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            handleFieldChange('image', event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleApplyUrl = () => {
        if (imageUrl.trim()) {
            handleFieldChange('image', imageUrl.trim());
        }
    };

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/80 rounded-t-lg">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Article Preview Content</h4>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Article Title</label>
                        <input type="text" value={article.title} onChange={(e) => handleFieldChange('title', e.target.value)} className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Article Subtitle</label>
                        <textarea value={article.subtitle} onChange={(e) => handleFieldChange('subtitle', e.target.value)} rows={3} className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Header Image</label>
                        <label htmlFor="article-image-upload" className="group cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 transition">
                            <UploadIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Click to upload</span>
                            <input id="article-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <div className="mt-2 flex gap-2">
                            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="flex-grow p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                            <button onClick={handleApplyUrl} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


interface StrategyEditorProps {
  strategy: WeeklyStrategy;
  onUpdate: (updatedStrategy: WeeklyStrategy) => void;
  setError: (error: string | null) => void;
  defaultOpen: boolean;
}

const StrategyEditor: React.FC<StrategyEditorProps> = ({ strategy, onUpdate, setError, defaultOpen }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleFieldChange = (field: keyof WeeklyStrategy, value: any) => {
    onUpdate({ ...strategy, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleFieldChange('image', event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (imageUrl.trim()) {
      handleFieldChange('image', imageUrl.trim());
    }
  };

  const handleGenerateSummary = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const summary = await generateStrategySummary(strategy.title);
        handleFieldChange('summary', summary);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('Could not generate summary.');
        }
    } finally {
        setIsGenerating(false);
    }
  }, [strategy.title]);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-t-lg">
        <h4 className="font-bold text-slate-800 dark:text-slate-200">Strategy #{strategy.id}</h4>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={strategy.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Summary</label>
                <button onClick={handleGenerateSummary} disabled={isGenerating} className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 transition">
                    {isGenerating ? <><Spinner className="w-3 h-3" /> Gen...</> : "✨ AI Gen"}
                </button>
            </div>
            <textarea
              value={strategy.summary}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              rows={3}
              className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Image</label>
            <label htmlFor={`image-upload-${strategy.id}`} className="group cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 transition">
              <UploadIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Click to upload</span>
              <input id={`image-upload-${strategy.id}`} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <div className="mt-2 flex gap-2">
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="flex-grow p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
              <button onClick={handleApplyUrl} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Apply</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Color</label>
            <div className="grid grid-cols-7 gap-2">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.name}
                  onClick={() => handleFieldChange('gradient', gradient)}
                  className={`w-full h-10 rounded-lg ${gradient.preview} ${strategy.gradient.name === gradient.name ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-800' : 'ring-1 ring-inset ring-black/10'}`}
                  title={gradient.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export const WeeklyPreviewControlPanel: React.FC<WeeklyPreviewControlPanelProps> = ({ strategies, setStrategies, article, setArticle, setError }) => {
  
  const handleUpdateStrategy = (updatedStrategy: WeeklyStrategy) => {
    setStrategies(
      strategies.map(s => s.id === updatedStrategy.id ? updatedStrategy : s)
    );
  };

  return (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Weekly Preview Content</h3>
        <ArticleEditor article={article} onUpdate={setArticle} />
        <div className="space-y-4">
            {strategies.map((strategy, index) => (
                <StrategyEditor 
                    key={strategy.id}
                    strategy={strategy}
                    onUpdate={handleUpdateStrategy}
                    setError={setError}
                    defaultOpen={index === 0}
                />
            ))}
        </div>
    </div>
  );
};