import React from 'react';
import { format } from 'mathjs';
import { getProbability } from '../../lib/quantum/engine';

const StateVectorResult = ({ stateVector, numQubits }) => {
  // Convert decimal to binary string padded to numQubits length
  // Using convention that qubit 0 is MSB, so index matches directly.
  const toBinary = (index) => {
    return index.toString(2).padStart(numQubits, '0');
  };

  const formatAmplitudeToSymbolic = (amp) => {
    const TOLERANCE = 1e-5;
    const mapVal = (val, isImag) => {
      const absVal = Math.abs(val);
      let sym = '';
      if (absVal < TOLERANCE) return '0';
      if (Math.abs(absVal - 1) < TOLERANCE) sym = isImag ? 'i' : '1';
      else if (Math.abs(absVal - 0.70710678) < TOLERANCE) sym = isImag ? 'i/√2' : '1/√2';
      else if (Math.abs(absVal - 0.5) < TOLERANCE) sym = isImag ? 'i/2' : '1/2';
      else if (Math.abs(absVal - 0.35355339) < TOLERANCE) sym = isImag ? 'i/(2√2)' : '1/(2√2)';
      else if (Math.abs(absVal - 0.25) < TOLERANCE) sym = isImag ? 'i/4' : '1/4';
      else sym = Number(absVal.toFixed(3)).toString() + (isImag ? 'i' : '');
      return val < 0 ? '-' + sym : sym;
    };

    if (Math.abs(amp.re) < TOLERANCE && Math.abs(amp.im) < TOLERANCE) return '0';
    
    const reStr = mapVal(amp.re, false);
    const imStr = mapVal(amp.im, true);
    
    if (reStr === '0') return imStr;
    if (imStr === '0') return reStr;
    
    if (imStr.startsWith('-')) return `${reStr} - ${imStr.substring(1)}`;
    return `${reStr} + ${imStr}`;
  };

  if (!stateVector || stateVector.length === 0) return null;

  // Build full equation
  const equationParts = stateVector.map((amp, index) => {
    const sym = formatAmplitudeToSymbolic(amp);
    if (sym === '0') return null;
    const isComplex = sym.includes('+') || (sym.includes('-') && !sym.startsWith('-'));
    const term = isComplex ? `(${sym})` : sym;
    return `${term}|${toBinary(index)}⟩`;
  }).filter(Boolean);

  let equationString = equationParts.length > 0 ? equationParts.join(' + ').replace(/\+ -/g, '- ') : '0';

  return (
    <div className="glass-panel p-6 w-full mt-6">
      <h2 className="text-xl font-bold text-white mb-4">State Vector & Probabilities</h2>
      
      {/* equation display */}
      <div className="bg-quantum-900/50 border border-white/10 rounded-lg p-4 mb-6 text-center shadow-inner overflow-x-auto">
        <span className="font-mono text-neon-blue font-bold text-lg whitespace-nowrap">
          |ψ⟩ = {equationString}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stateVector.map((amplitude, index) => {
          const prob = getProbability(amplitude);
          const probPerc = (prob * 100).toFixed(1);
          
          // Using the symbolic formatter for display inside cards too!
          let ampStr = formatAmplitudeToSymbolic(amplitude);
          if (ampStr === '0') {
             // Fallback for full precision if it's very small but we want to show it?
             // Actually, 0 is fine.
          }

          // Skip almost zero probabilities to keep UI clean if too many qubits
          // But since max qubits is 5, we can show them or fade them out
          const isZero = prob < 0.001;

          return (
            <div 
              key={`sv-${index}`} 
              className={`p-4 rounded-xl border border-white/10 ${isZero ? 'bg-quantum-900/40 opacity-50' : 'bg-quantum-800/80 shadow-[0_0_15px_rgba(161,140,209,0.3)]'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-neon-purple font-bold text-lg">
                  |{toBinary(index)}⟩
                </span>
                <span className="text-sm font-semibold text-white/80">{probPerc}%</span>
              </div>
              
              <div className="text-xs text-gray-400 font-mono mb-3 truncate" title={ampStr}>
                Amp: {ampStr}
              </div>

              <div className="w-full bg-quantum-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${probPerc}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StateVectorResult;
