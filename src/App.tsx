import { useSnake } from './useSnake';
import { useMusicPlayer } from './useMusicPlayer';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function App() {
  const {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    gridSize,
    resetGame,
  } = useSnake();

  const {
    currentTrack,
    isPlaying,
    togglePlay,
    handleSkipNext,
    handleSkipPrev,
  } = useMusicPlayer();

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;

        let bgClass = 'bg-transparent';
        if (isSnakeHead) bgClass = 'bg-[var(--color-cyan-neon)] shadow-[0_0_8px_var(--color-cyan-neon)]';
        else if (isSnakeBody) bgClass = 'bg-[var(--color-cyan-neon)] opacity-60';
        else if (isFood) bgClass = 'bg-[var(--color-magenta-neon)] shadow-[0_0_8px_var(--color-magenta-neon)] animate-pulse';

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`w-full h-full border border-[var(--color-cyan-neon)]/10 ${bgClass}`}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-[100dvh] bg-black crt noise flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="absolute inset-0 screen-tear pointer-events-none z-10" />

      {/* HEADER: Score and Status */}
      <header className="mb-6 z-20 flex flex-col items-center gap-1 w-full max-w-lg px-4 text-center">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-pixel glitch-text tracking-widest text-wrap uppercase"
          data-text="SYNDICATE_SERPENT"
        >
          SYNDICATE_SERPENT
        </h1>
        <div className="flex w-full justify-between mt-4 text-lg md:text-xl font-bold border-b border-[var(--color-cyan-neon)] pb-2 text-[var(--color-magenta-neon)]">
          <div>DATA_COLLECTED: {score}</div>
          <div>
            STATUS: 
            <span className={gameOver ? 'text-red-500 animate-pulse' : isPaused ? 'text-yellow-500' : 'text-[var(--color-cyan-neon)]'}>
              {gameOver ? ' SYSTEM_FAIL' : isPaused ? ' SUSPENDED' : ' ACTIVE'}
            </span>
          </div>
        </div>
      </header>

      {/* GAME BOARD */}
      <div className="z-20 relative p-2 md:p-3 border-4 border-double border-[var(--color-cyan-neon)] shadow-[0_0_20px_var(--color-cyan-neon)] bg-[var(--color-screen)]">
        
        {gameOver && (
          <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center animate-pulse">
            <h2 className="text-4xl text-[var(--color-magenta-neon)] glitch-text mb-4" data-text="GAME OVER">GAME OVER</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border-2 border-[var(--color-cyan-neon)] text-[var(--color-cyan-neon)] hover:bg-[var(--color-cyan-neon)] hover:text-black transition-colors shadow-[0_0_10px_var(--color-cyan-neon)]"
            >
              REBOOT_SYSTEM_
            </button>
          </div>
        )}

        <div 
          className="grid gap-[1px]" 
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {renderGrid()}
        </div>
      </div>

      <div className="mt-4 z-20 text-xs sm:text-sm opacity-60 text-center uppercase tracking-widest">
        USE W-A-S-D or ARROWS TO NAVIGATE <br/>
        SPACE TO SUSPEND
      </div>

      {/* MUSIC PLAYER */}
      <footer className="mt-6 z-20 border border-[var(--color-magenta-neon)] p-4 max-w-sm w-[90%] md:w-full shadow-[0_0_15px_var(--color-magenta-neon)] bg-[#0f0f0f]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3 border-b border-[var(--color-magenta-neon)]/30 pb-2">
          <div className="flex items-center gap-2 text-[var(--color-magenta-neon)]">
            <Volume2 size={18} className={isPlaying ? "animate-pulse" : ""} />
            <span className="text-xs tracking-widest font-bold">AUDIO_CHANNEL</span>
          </div>
          <div className="text-[10px] bg-[var(--color-magenta-neon)]/20 px-2 py-1 rounded-sm text-[var(--color-magenta-neon)]">
            {isPlaying ? 'ON_AIR' : 'OFFLINE'}
          </div>
        </div>

        <div className="text-sm truncate mb-4 opacity-90 relative">
          <span className="animate-pulse mr-2">»</span>
          {currentTrack?.title}
        </div>

        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={handleSkipPrev} 
            className="hover:text-[var(--color-magenta-neon)] transition-all hover:scale-110 focus:outline-none"
          >
            <SkipBack fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay} 
            className="text-[var(--color-cyan-neon)] hover:text-[var(--color-magenta-neon)] transition-all hover:scale-110 focus:outline-none border-2 border-current p-2 rounded-full shadow-[0_0_10px_currentcolor]"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={handleSkipNext} 
            className="hover:text-[var(--color-magenta-neon)] transition-all hover:scale-110 focus:outline-none"
          >
            <SkipForward fill="currentColor" />
          </button>
        </div>
      </footer>
    </div>
  );
}

