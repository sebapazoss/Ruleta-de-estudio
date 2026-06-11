import React, { useState, useRef } from 'react';
import { UserPlus, Trash2, FileJson, AlertCircle, CheckCircle2, Play, Users, BookOpen, RefreshCw } from 'lucide-react';

export default function ConfigurationScreen({
  players,
  setPlayers,
  questions,
  setQuestions,
  onStartGame,
  resetToDefault,
  showNotification
}) {
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const addPlayer = (e) => {
    e.preventDefault();
    const trimmed = playerNameInput.trim();
    if (!trimmed) return;
    
    // Check if player name already exists
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      showNotification('¡Ese nombre ya existe!', 'error');
      return;
    }

    setPlayers([...players, { id: Date.now().toString(), name: trimmed, score: 0 }]);
    setPlayerNameInput('');
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJsonError('');
    setJsonSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate JSON structure
        if (!Array.isArray(data)) {
          throw new Error('El archivo debe ser un arreglo de preguntas.');
        }

        const validQuestions = data.map((item, idx) => {
          if (!item.pregunta || !item.respuesta) {
            throw new Error(`La pregunta en la posición ${idx + 1} debe contener las propiedades "pregunta" y "respuesta".`);
          }
          return {
            id: `upload-${Date.now()}-${idx}`,
            pregunta: item.pregunta,
            respuesta: item.respuesta,
            used: false
          };
        });

        if (validQuestions.length === 0) {
          throw new Error('El archivo JSON no contiene preguntas válidas.');
        }

        setQuestions(validQuestions);
        setJsonSuccess(true);
      } catch (err) {
        setJsonError(err.message || 'Error al procesar el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Title Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent drop-shadow-md">
          Ruleta de Estudio en Grupo
        </h1>
        <p className="text-slate-400 mt-1 text-sm font-medium max-w-xl mx-auto">
          Configura tus participantes y carga tus preguntas para empezar un repaso interactivo y competitivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left Side: Players Setup */}
        <div className="glass-panel p-4 rounded-xl border border-slate-700/50 shadow-xl flex flex-col">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-violet-400">
            <Users className="w-5 h-5" />
            1. Participantes
          </h2>

          {/* Add Player Form */}
          <form onSubmit={addPlayer} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={playerNameInput}
                onChange={(e) => {
                  // Only allow letters, accents, and ñ/ü (Spanish names)
                  const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                  setPlayerNameInput(cleaned.slice(0, 15));
                }}
                placeholder="Nombre..."
                className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </form>

          {/* Players List */}
          <div className="flex-1 min-h-[150px] max-h-[200px] overflow-y-auto space-y-1.5 pr-1">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 bg-slate-800/40 border border-slate-800 hover:border-slate-700/50 rounded-lg transition-all group"
              >
                <span className="font-semibold text-sm text-slate-200">{p.name}</span>
                <button
                  onClick={() => removePlayer(p.id)}
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Eliminar participante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {players.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-6">
                <Users className="w-8 h-8 mb-1.5 stroke-[1.5] text-slate-600" />
                <p className="text-xs">No hay participantes agregados</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Questions Upload */}
        <div className="glass-panel p-4 rounded-xl border border-slate-700/50 shadow-xl flex flex-col">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-violet-400">
            <BookOpen className="w-5 h-5" />
            2. Preguntas y Respuestas
          </h2>

          <p className="text-slate-400 text-xs mb-3">
            Sube un archivo JSON con formato: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400 font-mono">{'[{"pregunta": "...", "respuesta": "..."}]'}</code>
          </p>

          {/* File Upload Area */}
          <div
            onClick={triggerFileSelect}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 flex-1 min-h-[100px] ${
              jsonSuccess
                ? 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
                : jsonError
                ? 'border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10'
                : 'border-slate-700 bg-slate-800/20 hover:border-violet-500/50 hover:bg-slate-800/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <FileJson className={`w-8 h-8 stroke-[1.5] ${
              jsonSuccess ? 'text-emerald-400' : jsonError ? 'text-rose-400' : 'text-slate-400'
            }`} />
            
            <div>
              <p className="text-xs font-semibold text-slate-300">
                {jsonSuccess ? '¡Archivo cargado correctamente!' : 'Haz clic para seleccionar archivo JSON'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                JSON de preguntas y respuestas (.json)
              </p>
            </div>
          </div>

          {/* Feedback & Stats */}
          <div className="mt-3 min-h-[36px]">
            {jsonError && (
              <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{jsonError}</span>
              </div>
            )}
            {jsonSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cargadas {questions.length} preguntas correctamente.</span>
              </div>
            )}
            {!jsonError && !jsonSuccess && (
              <div className="text-xs text-slate-500 bg-slate-800/30 p-2 rounded-lg border border-slate-800/50 flex justify-between items-center">
                <span>Usando preguntas actuales del pool.</span>
                <span className="font-bold text-violet-400">{questions.length} preguntas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* Reset to defaults */}
        <button
          onClick={resetToDefault}
          className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all font-semibold flex items-center gap-2 cursor-pointer text-xs w-full sm:w-auto justify-center"
        >
          <RefreshCw className="w-4 h-4" />
          Restablecer Valores Iniciales
        </button>

        {/* Start Game */}
        <button
          onClick={onStartGame}
          disabled={players.length === 0 || questions.length === 0}
          className={`px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm w-full sm:w-auto cursor-pointer shadow-lg ${
            players.length === 0 || questions.length === 0
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          Comenzar Juego
        </button>
      </div>
    </div>
  );
}
