import React from 'react';
import { Trophy, User, Medal, Trash2 } from 'lucide-react';

export default function Leaderboard({ players, onRemovePlayer }) {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highestScore = Math.max(...players.map(p => p.score), 0);

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl w-full border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-violet-400">
          <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          Tabla de Posiciones
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
          {players.length} Jugadores
        </span>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {sortedPlayers.map((player, index) => {
          const isLeader = player.score > 0 && player.score === highestScore;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 ${
                isLeader
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Ranking Position */}
                <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs bg-slate-700/50 text-slate-300">
                  {index === 0 && player.score > 0 ? (
                    <Medal className="w-4 h-4 text-amber-400" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Player Name and Avatar */}
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${
                    isLeader ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/10 text-violet-400'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-200 truncate max-w-[120px]">
                    {player.name}
                  </span>
                </div>
              </div>

              {/* Score and optional Remove button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`text-lg font-bold ${
                    isLeader ? 'text-amber-400' : 'text-violet-300'
                  }`}>
                    {player.score}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">pts</span>
                </div>

                {onRemovePlayer && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
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
          <div className="text-center py-8 text-slate-500 text-sm">
            No hay jugadores todavía.
          </div>
        )}
      </div>
    </div>
  );
}
