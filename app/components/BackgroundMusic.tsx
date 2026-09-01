'use client';

import { useState, useEffect, useRef } from 'react';

export default function BackgroundMusic({ audioUrl, isOpened }: { audioUrl: string, isOpened: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isOpened && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay diblokir browser:", err));
    }
  }, [isOpened]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!audioUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 z-[9999] w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-110 hover:bg-white ${
          isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
        }`}
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </>
  );
}
