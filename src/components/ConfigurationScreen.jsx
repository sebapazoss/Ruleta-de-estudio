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
    <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-2">
      {/* Hero Header */}
      <div className="mb-sm text-center md:text-left">
        <span className="font-label-caps text-label-caps text-primary mb-xs inline-block uppercase tracking-widest text-[9px]">
          Configuración de Partida
        </span>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">
          Ruleta de estudio en grupo
        </h2>
        <p className="text-on-surface-variant max-w-xl text-xs">
          Prepara tu sesión de estudio competitiva. Agrega a tus compañeros y carga el banco de preguntas para comenzar el desafío.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-sm">
        {/* Card 1: Companion List */}
        <section className="md:col-span-7 glass-panel rounded-xl p-sm flex flex-col gap-sm shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-primary">Compañeros</h3>
              <p className="text-on-surface-variant font-data-sm text-data-sm uppercase">
                {players.length.toString().padStart(2, '0')} Miembros Activos
              </p>
            </div>
            <span className="font-data-lg text-data-lg text-secondary opacity-50">#01</span>
          </div>

          {/* Input Group Form */}
          <form onSubmit={addPlayer} className="relative mt-xs">
            <input
              type="text"
              value={playerNameInput}
              onChange={(e) => {
                // Only allow letters, accents, spaces, and ñ/ü (Spanish names)
                const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]/g, '');
                setPlayerNameInput(cleaned.slice(0, 15));
              }}
              placeholder="Escribe un nombre..."
              className="w-full bg-black/40 border-b border-secondary/50 focus:border-secondary focus:ring-0 text-on-surface py-2 px-base rounded-t-lg transition-all placeholder:text-outline-variant font-body-md text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-base top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-on-secondary shadow-[0_0_15px_rgba(76,215,246,0.5)] hover:scale-105 active:scale-95 transition-transform border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
            </button>
          </form>

          {/* Scrollable List */}
          <div className="flex flex-col gap-xs max-h-44 overflow-y-auto pr-xs">
            {players.map((p, index) => {
              // Cycle through primary, secondary, tertiary for avatars
              const avatarColors = [
                'bg-primary/20 text-primary border-primary/40',
                'bg-secondary/20 text-secondary border-secondary/40',
                'bg-tertiary/20 text-tertiary border-tertiary/40'
              ];
              const avatarClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-base bg-white/5 rounded-lg border border-white/5 hover:border-secondary/30 transition-all group"
                >
                  <div className="flex items-center gap-base">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${avatarClass}`}>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    </div>
                    <span className="text-xs text-on-surface">{p.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlayer(p.id)}
                    className="text-outline hover:text-error transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              );
            })}

            {players.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-outline-variant py-8">
                <span className="material-symbols-outlined text-3xl mb-1">group</span>
                <p className="text-xs">No hay participantes agregados</p>
              </div>
            )}
          </div>
        </section>

        {/* Card 2: JSON Upload */}
        <section className="md:col-span-5 glass-panel rounded-xl p-sm flex flex-col gap-sm shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <span className="material-symbols-outlined text-[80px]">terminal</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-secondary">Banco de Preguntas</h3>
          
          <div
            onClick={triggerFileSelect}
            className={`flex-grow border border-dashed rounded-xl flex flex-col items-center justify-center p-md text-center hover:border-secondary/50 hover:bg-white/5 transition-all cursor-pointer group ${
              jsonSuccess ? 'border-emerald-500/40 bg-emerald-500/5' : jsonError ? 'border-rose-500/40 bg-rose-500/5' : 'border-white/10'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-sm group-hover:scale-110 transition-transform ${
              jsonSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : jsonError ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-secondary/10 text-secondary neon-glow-cyan'
            }`}>
              <span className="material-symbols-outlined text-xl">upload_file</span>
            </div>
            <p className="font-data-lg text-xs text-on-surface mb-0">
              {jsonSuccess ? '¡Archivo cargado!' : jsonError ? 'Error de archivo' : 'Cargar archivo JSON'}
            </p>
            <p className="text-outline-variant text-[11px] mt-xs">
              {jsonSuccess ? `Se cargaron ${questions.length} preguntas` : jsonError ? 'Haz clic para reintentar' : 'Arrastra y suelta tu archivo aquí'}
            </p>
          </div>

          <div className="bg-black/20 p-base rounded-lg border border-white/5">
            <div className="flex items-center gap-xs mb-xs">
              <span className="material-symbols-outlined text-xs text-tertiary">info</span>
              <span className="font-label-caps text-[9px] text-tertiary">FORMATO REQUERIDO</span>
            </div>
            <code className="font-data-sm text-[10px] text-outline-variant block overflow-x-auto whitespace-nowrap">
              [ &#123; "pregunta": "...", "respuesta": "..." &#125; ]
            </code>
          </div>

          {/* Feedback & Error Banner */}
          {jsonError && (
            <div className="flex items-start gap-1 text-[11px] text-rose-400 bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20 mt-1">
              <span className="material-symbols-outlined text-xs mt-0.5">error</span>
              <span>{jsonError}</span>
            </div>
          )}
        </section>
      </div>

      {/* Control Buttons */}
      <div className="mt-base flex flex-row gap-3 justify-center items-center">
        {/* Reset to defaults */}
        <button
          onClick={resetToDefault}
          className="group relative px-4 py-2 rounded-lg border border-white/10 text-outline hover:text-on-surface hover:bg-white/5 transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <span className="material-symbols-outlined text-xs">replay</span>
          <span>Restablecer</span>
        </button>

        {/* Start Game */}
        <button
          onClick={onStartGame}
          disabled={players.length === 0 || questions.length === 0}
          className="group relative px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg flex items-center justify-center gap-sm shadow-[0_0_20px_rgba(208,188,255,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border-none cursor-pointer text-xs"
        >
          <span className="relative z-10 font-bold">EMPEZAR JUEGO</span>
          <span className="material-symbols-outlined relative z-10 text-sm transition-transform group-hover:translate-x-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
          <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
}
