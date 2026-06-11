import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
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

  // Colors palette
  const colors = [
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#d946ef', // Fuchsia
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#f43f5e', // Rose
    '#6366f1', // Indigo
    '#0ea5e9', // Sky
  ];

  // Helper to draw SVG slices
  const getCoordinatesForPercent = (percent) => {
    const x = cx + radius * Math.cos(2 * Math.PI * percent);
    const y = cy + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // Shift angle by -90 deg so slice 0 starts at top
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

    // Find original index in the complete questions array for labeling (1-based)
    const originalIndex = questions.findIndex(q => q.id === question.id);
    const label = `Preg. ${originalIndex + 1}`;

    // Normalize angle to [0, 360) range
    const normAngle = ((midAngleDegrees % 360) + 360) % 360;
    // Flip text if it is in the left hemisphere (between 90 and 270 degrees) to keep it right side up
    const textRotation = (normAngle > 90 && normAngle < 270) ? normAngle + 180 : normAngle;

    return {
      pathData,
      color: colors[originalIndex % colors.length],
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

    // Pick winning question randomly from unused questions
    const winnerIndex = Math.floor(Math.random() * N);
    const winnerQuestion = unusedQuestions[winnerIndex];

    // Notify parent to lock interface and register winner
    onSpinStart(winnerQuestion, nextPlayer);

    // Play ticking sound
    playSlowingTicks();

    // Calculate rotation to make the winner index land at the top pointer (270 degrees)
    const sliceAngle = 360 / N;
    const midAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
    
    const spinRounds = 5;
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.5);
    const relativeTargetRotation = 360 - midAngle + jitter;
    const targetRotation = currentRotation + (spinRounds * 360) + relativeTargetRotation;

    // Set target values for the completion callback
    setSpinTarget({ question: winnerQuestion, player: nextPlayer });

    // Set rotation to trigger Framer Motion animation
    setCurrentRotation(targetRotation);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Outer rim decoration */}
      <div className="relative w-[300px] h-[300px] rounded-full flex items-center justify-center bg-slate-900 border-4 border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        
        {/* Top Pointer Indicator */}
        <div className="absolute -top-3 z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-500 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Outer glowing ring */}
        <div className="absolute inset-0.5 rounded-full border-2 border-dashed border-violet-500/30 animate-spin-slow"></div>

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
          className="w-[260px] h-[260px] rounded-full overflow-hidden shadow-2xl relative bg-slate-800"
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
                      stroke="#0f172a"
                      strokeWidth={N > 1 ? "2" : "0"}
                    />
                    
                    {/* Rotated text */}
                    <text
                      x={slice.textX}
                      y={slice.textY}
                      fill="#ffffff"
                      fontSize={N > 8 ? "9" : "10"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${slice.textRotation}, ${slice.textX}, ${slice.textY})`}
                      className="tracking-wide drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]"
                    >
                      {slice.label}
                    </text>
                  </g>
                ))}
              </g>
              {/* Inner ring */}
              <circle cx={cx} cy={cy} r="25" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />
            </svg>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-semibold text-center p-6">
              No quedan preguntas en el pool
            </div>
          )}
        </motion.div>

        {/* Centered Hub Cap */}
        <div className="absolute w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-lg pointer-events-none z-10">
          <div className="w-4 h-4 rounded-full bg-violet-500 animate-pulse"></div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || N === 0 || !nextPlayer}
        className={`mt-4 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2.5 transition-all duration-300 transform active:scale-95 shadow-lg text-sm ${
          isSpinning || N === 0 || !nextPlayer
            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-100 hover:scale-[1.02]'
        }`}
      >
        <Play className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? 'Girando...' : '¡GIRAR RULETA!'}
      </button>
    </div>
  );
}
