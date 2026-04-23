import React, { useState, useEffect, useRef } from "react";
import { AudioFile, CuePoint } from "../types";
import AlbumCover from "./AlbumCover";

interface PlayerDockProps {
  activeFile: AudioFile | null;
  onUpdateFile?: (id: string, updates: Partial<AudioFile>) => void;
}

const CUE_COLORS = [
  "#f43f5e", // Red (1)
  "#f97316", // Orange (2)
  "#eab308", // Yellow (3)
  "#22c55e", // Green (4)
  "#06b6d4", // Cyan (5)
  "#3b82f6", // Blue (6)
  "#8b5cf6", // Violet (7)
  "#d946ef", // Pink (8)
];

const PlayerDock: React.FC<PlayerDockProps> = ({
  activeFile,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayable = activeFile && activeFile.file.size > 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeFile && isPlayable) {
      const objectUrl = URL.createObjectURL(activeFile.file);
      audio.src = objectUrl;
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [activeFile?.id, isPlayable]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio && isPlayable) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const tags = activeFile?.fetchedTags || activeFile?.originalTags;

  return (
    <div 
      className={`fixed left-1/2 -translate-x-1/2 glass-effect rounded-2xl transition-all duration-500 ease-spring z-50 shadow-2xl border border-white/10 flex flex-col overflow-hidden ${
        isMinimized 
          ? 'w-72 h-16 bottom-8 scale-90 opacity-90 hover:scale-100 hover:opacity-100 px-4' 
          : 'w-[95%] max-w-7xl h-24 bottom-6 px-8 opacity-100'
      }`}
    >
      {/* Progress Bar */}
      <div 
        className={`w-full bg-white/5 cursor-pointer group relative shrink-0 transition-all ${isMinimized ? 'h-0.5' : 'h-1'}`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = x / rect.width;
          if (audioRef.current && duration) {
            audioRef.current.currentTime = pct * duration;
          }
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-magenta)] relative transition-all duration-200"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white] transition-opacity"></div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-between">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          crossOrigin="anonymous"
        />

        {/* Left: Track Info */}
        <div className={`flex items-center gap-3 ${isMinimized ? 'w-auto max-w-[60%]' : 'w-1/4'}`}>
          {activeFile ? (
            <>
              <div className={`${isMinimized ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl overflow-hidden border border-white/10 glow-cyan shrink-0 group relative`}>
                <AlbumCover tags={tags} className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden whitespace-nowrap">
                <div className={`font-bold text-white truncate font-heading leading-tight ${isMinimized ? 'text-xs' : 'text-sm'}`}>
                  {tags?.title || activeFile.file.name}
                </div>
                {!isMinimized && (
                  <div className="text-[10px] text-white/40 uppercase tracking-widest truncate font-black mt-0.5">
                    {tags?.artist || "Nieznany Artysta"}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 py-2 opacity-20">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-dashed border-white/20"></div>
              {!isMinimized && <div className="w-24 h-2 bg-white/40 rounded"></div>}
            </div>
          )}
        </div>

        {/* Center: Controls */}
        <div className={`flex items-center ${isMinimized ? 'gap-2' : 'flex-col gap-1'}`}>
          <div className={`flex items-center ${isMinimized ? 'gap-2' : 'gap-8'}`}>
            {!isMinimized && (
              <button className="text-white/30 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={togglePlay}
              disabled={!isPlayable}
              className={`${isMinimized ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-20 glow-white`}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${isMinimized ? 'h-4 w-4' : 'h-6 w-6'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${isMinimized ? 'h-4 w-4 ml-0.5' : 'h-6 w-6 ml-1'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {!isMinimized && (
              <button className="text-white/30 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            )}
          </div>
          {!isMinimized && (
            <div className="flex items-center gap-3 text-[10px] font-mono text-white/30 font-bold uppercase tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-20">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className={`flex items-center justify-end ${isMinimized ? 'gap-2' : 'w-1/4 gap-6'}`}>
          {!isMinimized && (
            <div className="hidden xl:flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.657a1 1 0 01-1.414-1.414A5 5 0 0011 8.586V6.172a7 7 0 012.241 2.241a7 7 0 011.416 6.244z" clipRule="evenodd" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
            </div>
          )}
          
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className={`text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all ${isMinimized ? 'p-2' : 'p-3'}`}
            title={isMinimized ? "Rozwiń" : "Zminimalizuj"}
          >
            {isMinimized ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDock;
