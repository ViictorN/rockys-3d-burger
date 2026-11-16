import React from 'react';
import { Play, Pause, RotateCw, Eye, Sparkles } from 'lucide-react';

export default function TourControlBar({
  tourPlaying = false,
  onToggleTour,
  tourProgress = 0,
  activeAngle = 'hero',
  onSelectAngle,
  showLines = true,
  onToggleLines,
  showCallouts = true,
  onToggleCallouts,
  onResetRotation,
}) {
  const angles = [
    { id: 'hero', label: '3/4 HERO' },
    { id: 'top', label: 'TOP-DOWN' },
    { id: 'macro', label: 'MACRO' },
    { id: 'side', label: 'SIDE' },
  ];

  return (
    <div
      className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2 max-w-[94vw]"
      role="region"
      aria-label="3D Camera and Inspection Controls"
    >
      {tourPlaying && (
        <div className="w-56 sm:w-80 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100 ease-linear shadow-[0_0_8px_#f59e0b]"
            style={{ width: `${(tourProgress % 1) * 100}%` }}
          />
        </div>
      )}

      <div className="glass-panel px-2.5 sm:px-4 py-2 rounded-full shadow-2xl flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 border border-white/15">
        <button
          type="button"
          onClick={onToggleTour}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            tourPlaying
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          aria-pressed={tourPlaying}
          title="Play automated 3D cinematic video tour"
        >
          {tourPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE TOUR</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PLAY 3D TOUR</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5 hidden sm:block" />

        <div className="flex items-center gap-1">
          {angles.map((ang) => {
            const isSelected = activeAngle === ang.id && !tourPlaying;
            return (
              <button
                type="button"
                key={ang.id}
                onClick={() => onSelectAngle(ang.id)}
                aria-pressed={isSelected}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {ang.label}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5 hidden sm:block" />

        <button
          type="button"
          onClick={onToggleLines}
          aria-pressed={showLines}
          aria-label={showLines ? 'Hide Animated Kinetic Lines' : 'Show Animated Kinetic Lines'}
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            showLines
              ? 'text-amber-400 bg-amber-400/15'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={showLines ? 'Hide Animated Kinetic Lines' : 'Show Animated Kinetic Lines'}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleCallouts}
          aria-pressed={showCallouts}
          aria-label={showCallouts ? 'Hide Ingredient Callouts' : 'Show Ingredient Callouts'}
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            showCallouts
              ? 'text-amber-400 bg-amber-400/15'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={showCallouts ? 'Hide Ingredient Callouts' : 'Show Ingredient Callouts'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetRotation}
          aria-label="Reset 3D camera rotation"
          className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Reset to default angle"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
