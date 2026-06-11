import React from 'react';
import Leaderboard from './Leaderboard';
import RouletteWheel from './RouletteWheel';
import QuestionCard from './QuestionCard';

export default function GameScreen({
  players,
  questions,
  gameState, // 'wheel' | 'turn'
  activePlayer,
  activeQuestion,
  isSpinning,
  onSpinStart,
  onSpinComplete,
  onPass,
  onEvaluate,
  onGoToConfig,
  answeredCount,
  onRemovePlayer,
  onAddPlayer,
  nextPlayer
}) {
  const totalQuestions = questions.length;
  
  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-2 flex-grow flex flex-col">
      {/* Game Header */}
      <div className="flex flex-row items-center justify-between gap-base mb-sm pb-xs border-b border-white/10">
        <div className="flex items-center gap-base">
          <button
            onClick={onGoToConfig}
            className="p-1.5 bg-transparent border border-white/10 text-outline hover:text-secondary rounded-md transition-colors cursor-pointer flex items-center justify-center"
            title="Volver a Configuración"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-on-surface leading-tight">
              Sesión de Juego
            </h2>
            <p className="font-data-sm text-[9px] text-outline uppercase tracking-wider">
              Partida en curso
            </p>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-secondary">menu_book</span>
            <span className="text-xs font-semibold text-slate-300">
              Preguntas: <span className="text-secondary font-bold font-mono">{answeredCount} / {totalQuestions}</span>
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start flex-grow">
        {/* Left Side: Scoreboard / Leaderboard */}
        <aside className="md:col-span-5 lg:col-span-4 min-w-[300px] flex flex-col gap-sm">
          <Leaderboard players={players} onRemovePlayer={onRemovePlayer} onAddPlayer={onAddPlayer} />
        </aside>

        {/* Right Side: Primary Play Area (Always keep RouletteWheel mounted) */}
        <section className="md:col-span-7 lg:col-span-8 flex flex-col items-center justify-center relative min-h-[320px]">
          <div className="absolute top-0 right-0 font-label-caps text-[8px] text-outline/30 flex items-center gap-xs pointer-events-none">
            <span className="material-symbols-outlined text-[10px]">sensors</span>
            SYSTEM_ID: GAME_INSTANCE_V4
          </div>
          <RouletteWheel
            players={players}
            questions={questions}
            onSpinStart={onSpinStart}
            onSpinComplete={onSpinComplete}
            isSpinning={isSpinning}
            nextPlayer={nextPlayer}
          />
        </section>
      </div>

      {/* Active Turn Question Overlay Modal */}
      {gameState === 'turn' && activePlayer && activeQuestion && (
        <QuestionCard
          player={activePlayer}
          question={activeQuestion}
          onPass={onPass}
          onEvaluate={onEvaluate}
          questionNumber={answeredCount + 1}
          totalQuestions={totalQuestions}
        />
      )}
    </div>
  );
}
