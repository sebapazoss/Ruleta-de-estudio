import React, { useState } from 'react';

export default function Leaderboard({ players, onRemovePlayer, onAddPlayer }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highestScore = Math.max(...players.map(p => p.score), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    const success = onAddPlayer(trimmed);
    if (success) {
      setNewPlayerName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-col gap-xs">
        <span className="font-label-caps text-label-caps text-secondary-container tracking-widest flex items-center gap-xs text-[9px]">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
          PARTICIPANTES EN VIVO
        </span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold">Puntajes</h2>
      </div>

      <div className="flex flex-col gap-xs max-h-[380px] overflow-y-auto pr-xs">
        {sortedPlayers.map((player, index) => {
          const isLeader = player.score > 0 && player.score === highestScore;
          
          return (
            <div
              key={player.id}
              className={`glass-panel py-2 px-3 flex items-center gap-3 transition-all duration-300 hover:translate-x-2 border-l-4 ${
                isLeader
                  ? 'border-primary neon-violet-glow'
                  : 'border-transparent opacity-90 hover:opacity-100'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 ${
                isLeader ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
              }`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
              </div>

              {/* Name & Position */}
              <div className="flex-grow min-w-0">
                <p className={`text-sm truncate font-semibold ${isLeader ? 'font-bold text-primary' : 'text-on-surface'}`}>
                  {player.name}
                </p>
                <p className="font-data-sm text-[10px] text-outline mt-0.5">
                  Posición #{index + 1}
                </p>
              </div>

              {/* Score / PTS */}
              <div className="text-right shrink-0">
                <span className={`font-data-lg text-sm block ${isLeader ? 'text-primary font-bold' : 'text-on-surface'}`}>
                  {player.score}
                </span>
                <p className="font-label-caps text-[9px] text-outline uppercase tracking-tighter">PTS</p>
              </div>

              {/* Delete Button */}
              {onRemovePlayer && (
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-outline hover:text-error transition-colors border-none bg-transparent cursor-pointer p-0.5 shrink-0"
                  title="Retirar jugador"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              )}
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="text-center py-6 text-outline text-xs">
            No hay jugadores todavía.
          </div>
        )}
      </div>

      {onAddPlayer && (
        <div className="mt-xs pt-xs border-t border-white/10">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-1.5 rounded-lg border border-dashed border-secondary/30 hover:border-secondary/60 bg-secondary/5 hover:bg-secondary/10 text-secondary hover:text-secondary-container font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xs">person_add</span>
              <span>Unir Compañero Tarde ⏰</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-1.5 items-center mt-1">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]/g, '');
                  setNewPlayerName(cleaned.slice(0, 15));
                }}
                placeholder="Nombre..."
                className="flex-1 bg-black/40 border-b border-secondary/50 focus:border-secondary focus:ring-0 text-on-surface py-1.5 px-2 text-xs rounded-t-lg transition-all focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 bg-secondary rounded-lg text-on-secondary shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer border-none flex items-center justify-center"
                title="Confirmar"
              >
                <span className="material-symbols-outlined text-xs">check</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPlayerName('');
                }}
                className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-outline cursor-pointer flex items-center justify-center"
                title="Cancelar"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
