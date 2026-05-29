import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, HelpCircle, User, Award, SkipForward } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden"
      >
        {/* Decorative corner light */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none"></div>

        {/* Turn Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20 shadow-inner">
              <User className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Turno Activo</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
                Le toca a: <span className="text-violet-400 font-extrabold">{player.name}</span>
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700/30">
            Pregunta {questionNumber} / {totalQuestions}
          </span>
        </div>

        {/* Question Area */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <HelpCircle className="w-6 h-6 text-violet-500 shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-1.5">Pregunta</h4>
              <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
                {question.pregunta}
              </p>
            </div>
          </div>

          {/* Answer Area (Conditional reveal) */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-5 rounded-2xl bg-slate-800/50 border border-slate-800 flex gap-3">
                  <Award className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Respuesta Correcta</h4>
                    <p className="text-slate-300 whitespace-pre-line text-base leading-relaxed">
                      {question.respuesta}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          {!showAnswer ? (
            <>
              {/* Pass Turn Button */}
              <button
                onClick={handlePass}
                className="px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all duration-300 font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <SkipForward className="w-5 h-5 text-slate-500" />
                Pasar Turno
              </button>

              {/* Reveal Answer Button */}
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] cursor-pointer w-full sm:w-auto active:scale-95"
              >
                <Eye className="w-5 h-5" />
                Ver Respuesta
              </button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
              {/* Mark Incorrect Button */}
              <button
                onClick={() => handleEvaluate(false)}
                className="px-6 py-3.5 rounded-xl border border-rose-500/20 hover:border-rose-500/50 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition-all duration-300 font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto active:scale-95"
              >
                <X className="w-5 h-5" />
                Incorrecto
              </button>

              {/* Mark Correct Button */}
              <button
                onClick={() => handleEvaluate(true)}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer w-full sm:w-auto active:scale-95"
              >
                <Check className="w-5 h-5" />
                Correcto (+1)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
