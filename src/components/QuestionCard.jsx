import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({
  player,
  question,
  onPass,
  onEvaluate,
  questionNumber,
  totalQuestions
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleEvaluate = (isCorrect) => {
    onEvaluate(player.id, question.id, isCorrect);
    setShowAnswer(false);
  };

  const handlePass = () => {
    onPass();
    setShowAnswer(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="glass-panel max-w-lg w-full p-md flex flex-col gap-sm relative overflow-hidden shadow-2xl rounded-2xl"
      >
        {/* Decorative corner badge */}
        <div className="absolute top-2.5 right-3 bg-secondary/10 px-2.5 py-0.5 rounded-full font-label-caps text-secondary text-[9px] tracking-wider">
          PREGUNTA {questionNumber} / {totalQuestions}
        </div>

        {/* Turn Header */}
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            help
          </span>
          <h3 className="text-sm font-bold text-on-surface">
            Pregunta para <span className="text-secondary">{player.name}</span>
          </h3>
        </div>

        {/* Question Area */}
        <p className="text-xs leading-relaxed text-on-surface-variant my-sm">
          {question.pregunta}
        </p>

        {/* Answer Area (Conditional reveal) */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-sm rounded-lg bg-slate-800/40 border border-slate-700/30 flex flex-col gap-xs mb-sm">
                <div className="flex items-center gap-xs text-emerald-400 mb-0.5">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                  <span className="font-label-caps text-[9px] uppercase">RESPUESTA CORRECTA</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                  {question.respuesta}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex flex-row gap-xs mt-sm">
          {!showAnswer ? (
            <>
              {/* Pass Turn Button */}
              <button
                onClick={handlePass}
                className="flex-1 px-sm py-1.5 rounded-lg bg-transparent border border-secondary text-secondary font-label-caps text-[10px] uppercase tracking-wider hover:bg-secondary/10 transition-colors cursor-pointer border-solid"
              >
                Pasar turno
              </button>

              {/* Reveal Answer Button */}
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 px-sm py-1.5 rounded-lg bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-wider neon-violet-glow hover:neon-violet-intense transition-all active:scale-95 duration-200 cursor-pointer border-none"
              >
                Ver respuesta
              </button>
            </>
          ) : (
            <>
              {/* Mark Incorrect Button */}
              <button
                onClick={() => handleEvaluate(false)}
                className="flex-1 px-sm py-1.5 rounded-lg bg-transparent border border-rose-500 text-rose-400 font-label-caps text-[10px] uppercase tracking-wider hover:bg-rose-500/10 transition-colors cursor-pointer border-solid"
              >
                Incorrecto
              </button>

              {/* Mark Correct Button */}
              <button
                onClick={() => handleEvaluate(true)}
                className="flex-1 px-sm py-1.5 rounded-lg bg-emerald-600 text-white font-label-caps text-[10px] uppercase tracking-wider hover:bg-emerald-500 transition-colors cursor-pointer border-none shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95 duration-200"
              >
                Correcto (+1)
              </button>
            </>
          )}
        </div>

        {/* Technical footer */}
        <div className="mt-xs pt-xs border-t border-white/10 flex justify-end">
          <span className="font-data-sm text-[10px] text-primary">
            +1 PUNTO
          </span>
        </div>
      </motion.div>
    </div>
  );
}
