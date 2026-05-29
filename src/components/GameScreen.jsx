import React from 'react';
import { ArrowLeft, BookOpen, RotateCcw } from 'lucide-react';
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
  nextPlayer
}) {
  const totalQuestions = questions.length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToConfig}
            className="p-2 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Volver a Configuración"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Ruleta de Estudio
            </h1>
            <p className="text-xs text-slate-500 font-semibold">PARTIDA EN CURSO</p>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-4 bg-slate-800/40 px-4 py-2.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-slate-300">
              Preguntas: <span className="text-violet-400 font-bold">{answeredCount} / {totalQuestions}</span>
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Scoreboard / Leaderboard */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Leaderboard players={players} onRemovePlayer={onRemovePlayer} />
        </div>

        {/* Right Side: Primary Play Area */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col justify-center min-h-[450px]">
          {gameState === 'wheel' ? (
            <div className="flex flex-col items-center justify-center bg-slate-800/20 rounded-3xl border border-slate-800 p-6 shadow-lg min-h-[450px]">
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                  Fase de Selección
                </span>
                <h3 className="text-xl font-bold text-slate-200 mt-2">
                  Le toca girar a: <span className="text-violet-400 font-extrabold">{nextPlayer?.name}</span>
                </h3>
              </div>
              <RouletteWheel
                players={players}
                questions={questions}
                onSpinStart={onSpinStart}
                onSpinComplete={onSpinComplete}
                isSpinning={isSpinning}
                nextPlayer={nextPlayer}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[450px]">
              {activePlayer && activeQuestion && (
                <div className="w-full">
                  <QuestionCard
                    player={activePlayer}
                    question={activeQuestion}
                    onPass={onPass}
                    onEvaluate={onEvaluate}
                    questionNumber={answeredCount + 1}
                    totalQuestions={totalQuestions}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
