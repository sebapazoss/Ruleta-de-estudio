import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Award, Crown, User, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Podium({ players, onRestartSame, onGoToConfig }) {
  // Sort unique scores descending
  const uniqueScores = [...new Set(players.map(p => p.score))].sort((a, b) => b - a);

  // Group players by ranking based on unique scores (Dense Ranking)
  const firstPlace = uniqueScores.length > 0 ? players.filter(p => p.score === uniqueScores[0]) : [];
  const secondPlace = uniqueScores.length > 1 ? players.filter(p => p.score === uniqueScores[1]) : [];
  const thirdPlace = uniqueScores.length > 2 ? players.filter(p => p.score === uniqueScores[2]) : [];

  // Other players (Rank 4 and below)
  const podiumIds = new Set([...firstPlace, ...secondPlace, ...thirdPlace].map(p => p.id));
  const otherPlayers = players
    .filter(p => !podiumIds.has(p.id))
    .sort((a, b) => b.score - a.score);

  // Trigger continuous confetti bursts on mount
  useEffect(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, animate a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent drop-shadow-md">
          ¡Ronda Finalizada!
        </h1>
        <p className="text-slate-400 mt-2 text-base md:text-lg font-medium">
          Resultados finales del grupo de estudio
        </p>
      </motion.div>

      {/* Visual Podium */}
      <div className="w-full grid grid-cols-3 gap-3 md:gap-6 items-end justify-center min-h-[320px] max-w-2xl mb-10 mt-4 px-2">
        
        {/* 2nd Place - Left */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center max-w-full">
            {secondPlace.length > 0 ? (
              secondPlace.map(p => (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  key={p.id}
                  className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl shadow-md mb-1.5"
                >
                  <p className="font-bold text-xs md:text-sm text-slate-200 truncate">{p.name}</p>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-400">{p.score} pts</span>
                </motion.div>
              ))
            ) : (
              <span className="text-xs text-slate-600 font-semibold italic">Vacante</span>
            )}
          </div>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 120 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="w-full bg-gradient-to-t from-slate-900/90 to-slate-800/80 border-t-4 border-slate-400 rounded-t-2xl shadow-xl flex flex-col items-center justify-between py-4 min-w-[70px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-slate-400/5 pointer-events-none"></div>
            <Award className="w-8 h-8 text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.3)]" />
            <div className="text-center z-10">
              <span className="text-3xl md:text-4xl font-black text-slate-400">2°</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Plata</p>
            </div>
          </motion.div>
        </div>

        {/* 1st Place - Center */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center max-w-full">
            {firstPlace.length > 0 ? (
              firstPlace.map(p => (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  key={p.id}
                  className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/5 mb-1.5"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <p className="font-bold text-sm md:text-base text-amber-300 truncate">{p.name}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{p.score} pts</span>
                </motion.div>
              ))
            ) : (
              <span className="text-xs text-slate-600 font-semibold italic">Vacante</span>
            )}
          </div>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 170 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full bg-gradient-to-t from-slate-900/90 to-slate-800/80 border-t-4 border-amber-400 rounded-t-2xl shadow-2xl flex flex-col items-center justify-between py-6 min-w-[70px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-400/5 pointer-events-none"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
            <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse" />
            <div className="text-center z-10">
              <span className="text-4xl md:text-5xl font-black text-amber-400">1°</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mt-1">Oro</p>
            </div>
          </motion.div>
        </div>

        {/* 3rd Place - Right */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center max-w-full">
            {thirdPlace.length > 0 ? (
              thirdPlace.map(p => (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  key={p.id}
                  className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl shadow-md mb-1.5"
                >
                  <p className="font-bold text-xs md:text-sm text-slate-200 truncate">{p.name}</p>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-400">{p.score} pts</span>
                </motion.div>
              ))
            ) : (
              <span className="text-xs text-slate-600 font-semibold italic">Vacante</span>
            )}
          </div>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 90 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="w-full bg-gradient-to-t from-slate-900/90 to-slate-800/80 border-t-4 border-amber-700 rounded-t-2xl shadow-xl flex flex-col items-center justify-between py-3 min-w-[70px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-700/5 pointer-events-none"></div>
            <Award className="w-7 h-7 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.3)]" />
            <div className="text-center z-10">
              <span className="text-2xl md:text-3xl font-black text-amber-700">3°</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-800 mt-0.5">Bronce</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Other Players List */}
      {otherPlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md bg-slate-900/40 rounded-2xl border border-slate-850 p-4 mb-10"
        >
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">
            Resto de la tabla
          </h3>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {otherPlayers.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 bg-slate-850/50 rounded-xl border border-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold w-4">{idx + 4}</span>
                  <div className="p-1 bg-violet-500/10 text-violet-400 rounded-lg">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-violet-400">{p.score} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
      >
        <button
          onClick={onGoToConfig}
          className="px-6 py-3.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-1/2 active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Configurar Nuevos</span>
        </button>

        <button
          onClick={onRestartSame}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-600/20 transition-all cursor-pointer w-full sm:w-1/2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Volver a Empezar</span>
        </button>
      </motion.div>
    </div>
  );
}
