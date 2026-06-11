import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Podium({ players, onRestartSame, onGoToConfig }) {
  // Sort unique scores descending, strictly greater than 0
  const uniqueScores = [...new Set(players.map(p => p.score))]
    .filter(score => score > 0)
    .sort((a, b) => b - a);

  // Group players by ranking based on unique scores (Dense Ranking)
  const firstPlace = uniqueScores.length > 0 ? players.filter(p => p.score === uniqueScores[0]) : [];
  const secondPlace = uniqueScores.length > 1 ? players.filter(p => p.score === uniqueScores[1]) : [];
  const thirdPlace = uniqueScores.length > 2 ? players.filter(p => p.score === uniqueScores[2]) : [];

  // All players on the podium
  const podiumIds = new Set([
    ...firstPlace.map(p => p.id),
    ...secondPlace.map(p => p.id),
    ...thirdPlace.map(p => p.id)
  ]);

  // Count how many players qualified and occupy the podium
  const podiumCount = firstPlace.length + secondPlace.length + thirdPlace.length;

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
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow pt-2 pb-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full relative">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="font-display-lg text-display-lg text-primary mb-xs uppercase tracking-widest text-[22px]">
          Podio Final
        </h1>
        <p className="text-on-surface-variant font-data-sm text-[10px]">
          RESULTADOS DE LA SESIÓN DE ESTUDIO COMPETITIVA
        </p>
      </header>

      {/* Visual Podium Section */}
      <section className="grid grid-cols-3 items-end gap-base md:gap-gutter mb-md relative max-w-4xl mx-auto px-4">
        {/* 2nd Place - Left */}
        <div className="flex flex-col items-center">
          {secondPlace.length > 0 ? (
            <>
              <div className="relative z-10 mb-xs animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex -space-x-3 items-center justify-center">
                  {secondPlace.map(player => (
                    <div key={player.id} className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border border-slate-400 overflow-hidden neon-silver p-0.5 bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-400 text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-400 text-surface font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs z-20">
                  2
                </div>
              </div>
              <div className="glass-panel w-full h-20 md:h-28 rounded-t-lg flex flex-col items-center justify-center border-b-0 py-1">
                <div className="flex flex-col items-center gap-0.5 w-full px-1 overflow-y-auto max-h-12">
                  {secondPlace.map(player => (
                    <span key={player.id} className="text-xs text-on-surface truncate w-full text-center font-semibold">
                      {player.name}
                    </span>
                  ))}
                </div>
                <span className="font-label-caps text-[10px] text-secondary mt-0.5">
                  {secondPlace[0].score} PTS
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-20 md:h-28 opacity-20 flex items-center justify-center font-body-md text-[10px] italic text-outline border border-dashed border-white/10 rounded-t-lg">
              Vacante
            </div>
          )}
        </div>

        {/* 1st Place - Center */}
        <div className="flex flex-col items-center">
          {firstPlace.length > 0 ? (
            <>
              <div className="relative z-10 mb-xs animate-float">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse z-20">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </div>
                <div className="flex -space-x-3 items-center justify-center">
                  {firstPlace.map(player => (
                    <div key={player.id} className="relative w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-yellow-500 overflow-hidden neon-gold p-0.5 bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-yellow-500 text-3xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-surface font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm z-20">
                  1
                </div>
              </div>
              <div className="glass-panel w-full h-28 md:h-40 rounded-t-lg flex flex-col items-center justify-center border-b-0 bg-primary/5 py-1">
                <div className="flex flex-col items-center gap-0.5 w-full px-1 overflow-y-auto max-h-16">
                  {firstPlace.map(player => (
                    <span key={player.id} className="text-xs md:text-sm text-primary font-bold truncate w-full text-center">
                      {player.name}
                    </span>
                  ))}
                </div>
                <span className="font-data-lg text-xs text-tertiary mt-1 font-bold">
                  {firstPlace[0].score} PTS
                </span>
                <div className="mt-1 px-2 py-0.5 bg-tertiary/20 rounded-full border border-tertiary/30">
                  <span className="font-label-caps text-[8px] text-tertiary">INVENCIBLE</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-28 md:h-40 opacity-20 flex items-center justify-center font-body-md text-[10px] italic text-outline border border-dashed border-white/10 rounded-t-lg">
              Vacante
            </div>
          )}
        </div>

        {/* 3rd Place - Right */}
        <div className="flex flex-col items-center">
          {thirdPlace.length > 0 ? (
            <>
              <div className="relative z-10 mb-xs animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex -space-x-3 items-center justify-center">
                  {thirdPlace.map(player => (
                    <div key={player.id} className="relative w-10 h-10 md:w-14 md:h-14 rounded-full border border-orange-700 overflow-hidden neon-bronze p-0.5 bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-amber-700 text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-orange-700 text-surface font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] z-20">
                  3
                </div>
              </div>
              <div className="glass-panel w-full h-16 md:h-20 rounded-t-lg flex flex-col items-center justify-center border-b-0 py-1">
                <div className="flex flex-col items-center gap-0.5 w-full px-1 overflow-y-auto max-h-8">
                  {thirdPlace.map(player => (
                    <span key={player.id} className="text-xs text-on-surface truncate w-full text-center font-semibold">
                      {player.name}
                    </span>
                  ))}
                </div>
                <span className="font-label-caps text-[10px] text-secondary mt-0.5">
                  {thirdPlace[0].score} PTS
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-16 md:h-20 opacity-20 flex items-center justify-center font-body-md text-[10px] italic text-outline border border-dashed border-white/10 rounded-t-lg">
              Vacante
            </div>
          )}
        </div>
      </section>

      {/* Full Results Table */}
      {otherPlayers.length > 0 && (
        <section className="max-w-xl mx-auto glass-panel rounded-xl overflow-hidden mb-md w-full">
          <div className="py-2 px-3 border-b border-white/10 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="text-xs font-bold text-on-surface">Tabla Completa</h3>
            <span className="font-label-caps text-[9px] text-outline">{players.length} ESTUDIANTES</span>
          </div>
          <div className="divide-y divide-white/5">
            {otherPlayers.map((p, index) => (
              <div key={p.id} className="p-base flex items-center gap-base hover:bg-white/5 transition-colors">
                <span className="font-data-lg text-xs text-outline-variant w-6">{podiumCount + 1 + index}</span>
                <div className="w-7 h-7 rounded-full bg-surface-container border border-white/10 overflow-hidden flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xs">person</span>
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-on-surface">{p.name}</p>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">{p.score}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex flex-row justify-center items-center gap-sm mb-base w-full max-w-lg mx-auto">
        <button
          onClick={onRestartSame}
          className="group relative px-6 py-2.5 rounded-lg overflow-hidden primary-glow active:scale-95 transition-all duration-200 w-full md:w-auto cursor-pointer border-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-inverse-primary"></div>
          <div className="absolute inset-[2px] bg-surface rounded-[6px] group-hover:bg-transparent transition-colors"></div>
          <div className="relative flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-on-surface text-base group-hover:text-on-primary-fixed transition-colors">replay</span>
            <span className="text-xs font-bold text-on-surface group-hover:text-on-primary-fixed transition-colors">
              Jugar de nuevo
            </span>
          </div>
        </button>

        <button
          onClick={onGoToConfig}
          className="group relative px-6 py-2.5 rounded-lg overflow-hidden secondary-glow active:scale-95 transition-all duration-200 w-full md:w-auto cursor-pointer border-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-container"></div>
          <div className="absolute inset-[2px] bg-surface rounded-[6px] group-hover:bg-transparent transition-colors"></div>
          <div className="relative flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-secondary text-base group-hover:text-on-secondary-fixed transition-colors">home</span>
            <span className="text-xs font-bold text-secondary group-hover:text-on-secondary-fixed transition-colors">
              Volver al inicio
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
