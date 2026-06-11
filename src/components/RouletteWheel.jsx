import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playTickSound } from '../utils/audio';

export default function RouletteWheel({
  players,
  questions,
  onSpinStart,
  onSpinComplete,
  isSpinning,
  nextPlayer
}) {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinTarget, setSpinTarget] = useState(null);

  // Filter unused questions to display on the wheel
  const unusedQuestions = questions.filter(q => !q.used);
  const N = unusedQuestions.length;
  
  const radius = 140;
  const cx = 150;
  const cy = 150;

  // Mockup themed colors (matching bg-primary/20, bg-secondary/20, bg-tertiary/20, bg-error/20)
  const colors = [
    'rgba(208, 188, 255, 0.25)', // primary/25
    'rgba(76, 215, 246, 0.25)',  // secondary/25
    'rgba(145, 219, 42, 0.25)',  // tertiary/25
    'rgba(255, 180, 171, 0.25)', // error/25
  ];

  const strokeColors = [
    '#d0bcff', // primary
    '#4cd7f6', // secondary
    '#91db2a', // tertiary
    '#ffb4ab', // error
  ];

  // Helper to draw SVG slices
  const getCoordinatesForPercent = (percent) => {
    const x = cx + radius * Math.cos(2 * Math.PI * percent);
    const y = cy + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  function startXVal(percent) {
    return percent - 0.25;
  }

  const slices = unusedQuestions.map((question, i) => {
    const startPercent = i / N;
    const endPercent = (i + 1) / N;
    
    const [startX, startY] = getCoordinatesForPercent(startXVal(startPercent));
    const [endX, endY] = getCoordinatesForPercent(startXVal(endPercent));
    
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    
    const pathData = N === 1 
      ? `M ${cx} ${cy} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`
      : `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

    const midAngleDegrees = (i * (360 / N)) + (180 / N) - 90;
    const midAngleRadians = (midAngleDegrees * Math.PI) / 180;
    
    const textRadius = radius * 0.65;
    const textX = cx + textRadius * Math.cos(midAngleRadians);
    const textY = cy + textRadius * Math.sin(midAngleRadians);

    const originalIndex = questions.findIndex(q => q.id === question.id);
    const label = `Preg. ${originalIndex + 1}`;

    const normAngle = ((midAngleDegrees % 360) + 360) % 360;
    const textRotation = (normAngle > 90 && normAngle < 270) ? normAngle + 180 : normAngle;

    return {
      pathData,
      color: colors[originalIndex % colors.length],
      strokeColor: strokeColors[originalIndex % strokeColors.length],
      textX,
      textY,
      textRotation,
      label,
      question,
    };
  });

  const playSlowingTicks = () => {
    const totalDuration = 4500;
    const startTime = Date.now();
    
    const nextTick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= totalDuration) return;
      
      const t = elapsed / totalDuration;
      const speed = Math.pow(1 - t, 3.5);
      
      if (speed < 0.015) return;
      
      const delay = 45 + (1 - speed) * 550;
      const freq = 800 + speed * 400;
      
      playTickSound(freq);
      
      setTimeout(nextTick, delay);
    };
    
    nextTick();
  };

  const spin = () => {
    if (isSpinning || N === 0 || !nextPlayer) return;

    const winnerIndex = Math.floor(Math.random() * N);
    const winnerQuestion = unusedQuestions[winnerIndex];

    onSpinStart(winnerQuestion, nextPlayer);
    playSlowingTicks();

    const sliceAngle = 360 / N;
    const midAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
    
    const spinRounds = 5;
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.5);
    const relativeTargetRotation = 360 - midAngle + jitter;
    const targetRotation = currentRotation + (spinRounds * 360) + relativeTargetRotation;

    setSpinTarget({ question: winnerQuestion, player: nextPlayer });
    setCurrentRotation(targetRotation);
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full mt-6">
      {/* The Roulette Body Container */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        {/* Outer Ring Glow */}
        <div className="absolute inset-0 rounded-full border-[8px] border-surface-container-high/40 shadow-[0_0_30px_rgba(76,215,246,0.15)] pointer-events-none z-10"></div>

        {/* Outer Ring Dashed Deco */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-secondary/20 animate-spin-slow pointer-events-none z-10"></div>

        {/* The rotating wheel */}
        <motion.div
          animate={{ rotate: currentRotation }}
          transition={{
            duration: isSpinning ? 4.5 : 0,
            ease: isSpinning ? [0.1, 0.8, 0.15, 1] : "linear",
          }}
          onAnimationComplete={() => {
            if (isSpinning && spinTarget) {
              onSpinComplete(spinTarget.question, spinTarget.player);
            }
          }}
          className="w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-secondary/30 relative bg-surface-container shadow-2xl z-0"
        >
          {N > 0 ? (
            <svg viewBox="0 0 300 300" className="w-full h-full select-none">
              <g>
                {slices.map((slice, i) => (
                  <g key={i}>
                    {/* Slice path */}
                    <path
                      d={slice.pathData}
                      fill={slice.color}
                      className="transition-colors duration-300 hover:opacity-90"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={N > 1 ? "1.5" : "0"}
                    />
                    
                    {/* Rotated text */}
                    <text
                      x={slice.textX}
                      y={slice.textY}
                      fill={slice.strokeColor}
                      fontSize={N > 8 ? "9" : "10"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${slice.textRotation}, ${slice.textX}, ${slice.textY})`}
                      className="tracking-wider font-mono"
                    >
                      {slice.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-semibold text-center p-4">
              No quedan preguntas en el pool
            </div>
          )}
        </motion.div>

        {/* Center Point - Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning || N === 0 || !nextPlayer}
          className="absolute z-20 w-16 h-16 rounded-full bg-surface-container-high border-2 border-secondary flex flex-col items-center justify-center neon-cyan-glow group active:scale-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-solid"
        >
          <span className="material-symbols-outlined text-secondary text-xl group-hover:animate-spin">
            casino
          </span>
          <span className="font-label-caps text-secondary text-[8px] font-bold">GIRAR</span>
        </button>

        {/* Indicator Needle */}
        <div className="absolute -top-5 z-20 text-secondary drop-shadow-[0_0_10px_rgba(76,215,246,0.8)]">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="mt-base flex gap-gutter bg-surface-container-low/40 p-base rounded-xl border border-white/5 shadow-lg max-w-xs w-full justify-center">
        <div className="text-center flex-1">
          <p className="font-label-caps text-outline text-[9px] uppercase tracking-widest mb-xs">PREGUNTAS RESTANTES</p>
          <p className="font-data-lg text-sm text-secondary tracking-tighter">{N} / {questions.length}</p>
        </div>
        <div className="w-px h-8 bg-white/10 self-center"></div>
        <div className="text-center flex-1">
          <p className="font-label-caps text-outline text-[9px] uppercase tracking-widest mb-xs">SIGUIENTE GIRO</p>
          <p className="font-data-lg text-sm text-primary tracking-tighter truncate max-w-[100px] mx-auto" title={nextPlayer?.name || '-'}>
            {nextPlayer?.name || '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
