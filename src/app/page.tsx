"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const startPlayback = async () => {
      try {
        video.muted = true;
        video.volume = 1;
        await video.play();
        setNeedsInteraction(true);
      } catch {
        setNeedsInteraction(true);
      }
    };

    const enableSound = async () => {
      video.muted = false;
      video.volume = 1;

      try {
        await video.play();
        setNeedsInteraction(false);
      } catch {
        // Some browsers still require explicit user media permission.
      }
    };

    const markError = () => setHasError(true);

    startPlayback();
    video.addEventListener("error", markError);
    window.addEventListener("pointerdown", enableSound, { passive: true });

    return () => {
      video.removeEventListener("error", markError);
      window.removeEventListener("pointerdown", enableSound);
    };
  }, []);

  return (
    <main className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/site-watermark.png"
      >
        <source src="/videos/mvpcinematicloadingg.mp4" type="video/mp4" />
      </video>

      {!hasError && needsInteraction && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
          toque para ativar o som
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center text-sm font-semibold uppercase tracking-[0.24em] text-white">
          nao foi possivel carregar o video
        </div>
      )}
    </main>
  );
}
