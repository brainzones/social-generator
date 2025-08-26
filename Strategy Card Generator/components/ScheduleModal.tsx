import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface ScheduleModalProps {
  onClose: () => void;
  onSchedule: (caption: string) => Promise<void>;
  isScheduling: boolean;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSchedule, isScheduling }) => {
  const [caption, setCaption] = useState('');

  const handleScheduleClick = () => {
    onSchedule(caption);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Schedule to Zoho Social</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
        </div>
        <div className="mt-4">
          <label htmlFor="caption" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Post Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Write your caption here..."
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isScheduling}
            className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleScheduleClick} 
            disabled={isScheduling || !caption.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800"
          >
            {isScheduling ? <><Spinner className="w-5 h-5"/> Scheduling...</> : 'Confirm & Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
