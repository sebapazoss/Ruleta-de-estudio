import React, { useState } from 'react';
import { Trophy, User, Medal, Trash2, Plus, Check, X } from 'lucide-react';

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
    <div className="glass-panel rounded-xl p-4 shadow-xl w-full border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-violet-400">
          <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          Tabla de Posiciones
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
          {players.length} Jugadores
        </span>
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {sortedPlayers.map((player, index) => {
          const isLeader = player.score > 0 && player.score === highestScore;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-300 ${
                isLeader
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Ranking Position */}
                <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs bg-slate-700/50 text-slate-300">
                  {index === 0 && player.score > 0 ? (
                    <Medal className="w-4 h-4 text-amber-400" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Player Name and Avatar */}
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${
                    isLeader ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/10 text-violet-400'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 truncate max-w-[120px]">
                    {player.name}
                  </span>
                </div>
              </div>

              {/* Score and optional Remove button */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <span className={`text-base font-bold ${
                    isLeader ? 'text-amber-400' : 'text-violet-300'
                  }`}>
                    {player.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">pts</span>
                </div>

                {onRemovePlayer && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Retirar jugador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm">
            No hay jugadores todavía.
          </div>
        )}
      </div>

      {onAddPlayer && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded-lg border border-dashed border-violet-500/30 hover:border-violet-500/60 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400 hover:text-violet-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Unir Compañero Tarde ⏰</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                      setNewPlayerName(cleaned.slice(0, 15));
                    }}
                    placeholder="Nombre..."
                    className="w-full pl-3 pr-12 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    autoFocus
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                    -1 pt
                  </span>
                </div>
                
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Confirmar"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewPlayerName('');
                  }}
                  className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
