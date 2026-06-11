import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DEFAULT_PLAYERS, DEFAULT_QUESTIONS } from './mockData';
import ConfigurationScreen from './components/ConfigurationScreen';
import GameScreen from './components/GameScreen';
import Podium from './components/Podium';
import { HelpCircle, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { playVictorySound, playFailureSound } from './utils/audio';

export default function App() {
  const [view, setView] = useState('config'); // 'config' | 'game'
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [questions, setQuestions] = useState(
    DEFAULT_QUESTIONS.map(q => ({ ...q, used: false }))
  );
  
  const [gameState, setGameState] = useState('wheel'); // 'wheel' | 'turn'
  const [activePlayer, setActivePlayer] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  // Custom notification state
  const [notification, setNotification] = useState(null);
  const [notificationTimeout, setNotificationTimeout] = useState(null);

  // Confirmation modal state
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Show a styled custom in-app notification
  const showNotification = (message, type = 'info') => {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);
    setNotificationTimeout(timer);
  };

  // Open reset defaults confirmation
  const handleOpenResetModal = () => {
    setShowConfirmReset(true);
  };

  // Confirm reset defaults
  const confirmResetToDefault = () => {
    setPlayers([]);
    setQuestions(DEFAULT_QUESTIONS.map(q => ({ ...q, used: false })));
    setGameState('wheel');
    setActivePlayer(null);
    setActiveQuestion(null);
    setActivePlayerIndex(0);
    setView('config');
    setShowConfirmReset(false);
    showNotification('Se restablecieron las preguntas por defecto y se limpiaron los participantes.', 'success');
  };

  const handleStartGame = () => {
    if (players.length === 0) {
      showNotification('Debes agregar al menos un participante.', 'error');
      return;
    }
    if (questions.length === 0) {
      showNotification('Debes cargar al menos una pregunta.', 'error');
      return;
    }
    setView('game');
    setGameState('wheel');
    setActivePlayerIndex(0);
    showNotification('¡Juego iniciado! Buena suerte.', 'success');
  };

  const handleRestartSameConfig = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setQuestions(prev => prev.map(q => ({ ...q, used: false })));
    setActivePlayerIndex(0);
    setGameState('wheel');
    setActivePlayer(null);
    setActiveQuestion(null);
    setView('game');
    showNotification('¡Juego reiniciado con el mismo grupo!', 'success');
  };

  const handleGoToConfigReset = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setQuestions(prev => prev.map(q => ({ ...q, used: false })));
    setActivePlayerIndex(0);
    setGameState('wheel');
    setActivePlayer(null);
    setActiveQuestion(null);
    setView('config');
  };

  // Called when the user clicks the Spin button
  const handleSpinStart = (winnerQuestion, winnerPlayer) => {
    setIsSpinning(true);
    setActivePlayer(winnerPlayer);
    setActiveQuestion(winnerQuestion);
  };

  // Called when the spin animation completes
  const handleSpinComplete = (winnerQuestion, winnerPlayer) => {
    setIsSpinning(false);
    setActivePlayer(winnerPlayer);
    setActiveQuestion(winnerQuestion);
    setGameState('turn');
  };

  // Active Turn "Pass" Handler
  const handlePass = () => {
    setGameState('wheel');
    setActivePlayer(null);
    setActiveQuestion(null);
    // Advance to the next player sequentially
    setActivePlayerIndex(prev => (prev + 1) % players.length);
  };

  // Evaluation Handler (Correct/Incorrect)
  const handleEvaluate = (playerId, questionId, isCorrect) => {
    // 1. Add score if correct
    if (isCorrect) {
      setPlayers(prevPlayers =>
        prevPlayers.map(p => (p.id === playerId ? { ...p, score: p.score + 1 } : p))
      );
      
      // Play victory sound
      playVictorySound();
      
      // Trigger confetti!
      triggerConfetti();
    } else {
      // Play failure sound
      playFailureSound();
    }

    // 2. Mark question as used and check if all are used
    setQuestions(prevQuestions => {
      const updated = prevQuestions.map(q => (q.id === questionId ? { ...q, used: true } : q));
      const unusedCount = updated.filter(q => !q.used).length;
      
      if (unusedCount === 0) {
        setTimeout(() => {
          setView('podium');
        }, 1200);
      }
      return updated;
    });

    // 3. Advance to next player sequentially
    setActivePlayerIndex(prev => (prev + 1) % players.length);

    // 4. Reset turn state and go back to roulette
    setGameState('wheel');
    setActivePlayer(null);
    setActiveQuestion(null);
  };

  // Mid-game player removal handler
  const handleRemovePlayerMidGame = (id) => {
    const playerToRemove = players.find(p => p.id === id);
    if (!playerToRemove) return;

    setPlayers(prev => {
      const updated = prev.filter(p => p.id !== id);
      
      // Update activePlayerIndex to prevent out of bounds and align with new layout
      if (updated.length > 0) {
        setActivePlayerIndex(curr => curr % updated.length);
      } else {
        setActivePlayerIndex(0);
      }

      if (updated.length === 0) {
        // No players left, force return to setup screen
        setView('config');
        setTimeout(() => {
          showNotification('Todos los jugadores se retiraron. Agrega participantes para volver a jugar.', 'error');
        }, 300);
      }
      return updated;
    });

    // If the active player (currently answering) is the one who leaves, cancel the turn
    if (activePlayer && activePlayer.id === id) {
      setGameState('wheel');
      setActivePlayer(null);
      setActiveQuestion(null);
      showNotification(`Turno cancelado porque ${playerToRemove.name} se retiró del juego.`, 'info');
    } else {
      showNotification(`${playerToRemove.name} se retiró del juego.`, 'info');
    }
  };

  // Mid-game player late arrival handler
  const handleAddPlayerMidGame = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    // Helper to clean name from clock/time emojis for duplicate check
    const cleanName = (n) => n.replace(/⏰|🕒|🕰️/g, '').trim().toLowerCase();
    
    if (players.some(p => cleanName(p.name) === trimmed.toLowerCase())) {
      showNotification('¡Ese nombre ya existe!', 'error');
      return false;
    }

    const newPlayer = {
      id: Date.now().toString(),
      name: `${trimmed} ⏰`,
      score: -1
    };

    setPlayers(prev => [...prev, newPlayer]);
    showNotification(`¡${newPlayer.name} se unió tarde con -1 punto!`, 'success');
    return true;
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a78bfa', '#8b5cf6', '#d946ef', '#10b981']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a78bfa', '#8b5cf6', '#d946ef', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Stats: count of answered (used) questions
  const answeredCount = questions.filter(q => q.used).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Navigation / Status bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-lg">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Roulette Study Group
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-full">
            v1.1.0 Stable
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {view === 'config' && (
          <ConfigurationScreen
            players={players}
            setPlayers={setPlayers}
            questions={questions}
            setQuestions={setQuestions}
            onStartGame={handleStartGame}
            resetToDefault={handleOpenResetModal}
            showNotification={showNotification}
          />
        )}
        {view === 'game' && (
          <GameScreen
            players={players}
            questions={questions}
            gameState={gameState}
            activePlayer={activePlayer}
            activeQuestion={activeQuestion}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinComplete={handleSpinComplete}
            onPass={handlePass}
            onEvaluate={handleEvaluate}
            onGoToConfig={handleGoToConfigReset}
            answeredCount={answeredCount}
            onRemovePlayer={handleRemovePlayerMidGame}
            onAddPlayer={handleAddPlayerMidGame}
            nextPlayer={players.length > 0 ? players[activePlayerIndex % players.length] : null}
          />
        )}
        {view === 'podium' && (
          <Podium
            players={players}
            onRestartSame={handleRestartSameConfig}
            onGoToConfig={handleGoToConfigReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-medium relative z-10">
        <p>© 2026 Ruleta de Estudio en Grupo. Creado para el aprendizaje colaborativo.</p>
      </footer>

      {/* Custom Animated Toast Notification */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`w-full pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
                notification.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : notification.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
              }`}
            >
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
              {notification.type !== 'error' && notification.type !== 'success' && <Info className="w-5 h-5 shrink-0 mt-0.5" />}
              
              <div className="flex-1 text-sm font-semibold">
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl text-left"
            >
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertTriangle className="w-8 h-8 shrink-0" />
                <h3 className="text-xl font-bold text-slate-100">¿Restablecer valores?</h3>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                ¿Estás seguro de que quieres restablecer las preguntas por defecto y limpiar la lista de participantes? Se perderán todos los puntajes actuales acumulados.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all font-semibold text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmResetToDefault}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-lg hover:shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
                >
                  Sí, Restablecer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
