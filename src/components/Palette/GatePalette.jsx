import React from 'react';
import { GATES } from '../../lib/quantum/gates';

const GatePalette = ({ selectedGate, onSelectGate }) => {
  return (
    <div className="glass-panel p-4 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Quantum Gates</h2>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(GATES).map((gate) => {
          if (gate.id === 'I') return null; // Identity is default empty wire
          const isSelected = selectedGate === gate.id;
          
          return (
            <button
              key={gate.id}
              onClick={() => onSelectGate(isSelected ? null : gate.id)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-neon-cyan bg-quantum-700 shadow-[0_0_15px_rgba(79,172,254,0.5)]' 
                  : 'border-white/10 bg-quantum-800 hover:border-white/30 hover:bg-quantum-700'
                }
              `}
            >
              <div className="text-2xl font-black text-neon-cyan mb-1">{gate.id}</div>
              <div className="text-xs text-gray-400 text-center">{gate.name}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-8 text-sm text-gray-400">
        <p className="mb-2">1. Select a gate from the palette.</p>
        <p>2. Click on the circuit board to place the gate.</p>
      </div>
    </div>
  );
};

export default GatePalette;
