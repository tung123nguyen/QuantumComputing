import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const NUM_STEPS = 12; // Static number of steps horizontally

const CircuitBoard = ({
  numQubits,
  operations,
  onAddQubit,
  onRemoveQubit,
  onPlaceGate,
  selectedGate,
  pendingControl,
}) => {
  // Helper to find existing gate at specific cell
  const getGateDetailsAt = (qubit, step) => {
    return operations.find(
      (op) =>
        op.step === step &&
        (op.qubit === qubit || op.control === qubit || op.target === qubit),
    );
  };

  return (
    <div className="glass-panel p-6 flex flex-col w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Circuit Board</h2>
        <button
          onClick={onAddQubit}
          disabled={numQubits >= 5}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 disabled:opacity-50 transition-colors"
        >
          <PlusCircle size={18} /> Add Qubit
        </button>
      </div>

      <div className="flex flex-col gap-4 relative min-w-max">
        {Array.from({ length: numQubits }).map((_, qubitIdx) => (
          <div
            key={`wire-${qubitIdx}`}
            className="flex items-center gap-4 relative group"
          >
            {/* Qubit Label */}
            <div className="flex items-center justify-between w-20 px-3 py-2 bg-quantum-700 rounded-lg shrink-0">
              <span className="font-mono text-neon-blue font-bold">
                |q{qubitIdx}⟩
              </span>
              {qubitIdx === numQubits - 1 && numQubits > 1 && (
                <button
                  onClick={onRemoveQubit}
                  className="hidden group-hover:block text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Wire line background */}
            <div className="absolute left-[5.5rem] right-0 h-1 bg-white/10 top-1/2 -translate-y-1/2 rounded z-0" />

            {/* Cells on the wire */}
            <div className="flex gap-2 relative z-10">
              {Array.from({ length: NUM_STEPS }).map((_, stepIdx) => {
                const op = getGateDetailsAt(qubitIdx, stepIdx);
                const isPendingControl =
                  pendingControl?.qubit === qubitIdx &&
                  pendingControl?.step === stepIdx;

                let renderContent = null;
                let cellClasses =
                  "opacity-0 group-hover:opacity-100 bg-quantum-900/50 border border-white/5 hover:border-white/30 hover:bg-quantum-700/50";

                if (isPendingControl) {
                  renderContent = (
                    <span className="w-3 h-3 bg-neon-cyan rounded-full shadow-[0_0_10px_#4facfe]"></span>
                  );
                  cellClasses =
                    "bg-quantum-700 border border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(79,172,254,0.3)]";
                } else if (op) {
                  if (op.gateId === "CX") {
                    const isMin = qubitIdx === Math.min(op.control, op.target);
                    const distance = Math.abs(op.control - op.target);

                    const innerDot =
                      op.control === qubitIdx ? (
                        <span className="w-3 h-3 bg-neon-cyan rounded-full z-10"></span>
                      ) : (
                        <span className="text-2xl font-black text-neon-cyan z-10 leading-none">
                          ⊕
                        </span>
                      );

                    renderContent = (
                      <>
                        {isMin && (
                          <div
                            className="absolute top-1/2 left-1/2 w-[2px] bg-neon-cyan -translate-x-1/2 z-0"
                            style={{ height: `${distance * 4}rem` }}
                          />
                        )}
                        {innerDot}
                      </>
                    );
                    cellClasses =
                      "bg-transparent relative h-12 flex items-center justify-center cursor-pointer"; // clear backgrund for visual connector
                  } else if (op.qubit === qubitIdx) {
                    renderContent = (
                      <span className="font-bold text-lg">{op.gateId}</span>
                    );
                    cellClasses =
                      "bg-quantum-700 border border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(79,172,254,0.3)] relative";
                  }
                }

                return (
                  <div
                    key={`cell-${qubitIdx}-${stepIdx}`}
                    onClick={() => onPlaceGate(qubitIdx, stepIdx)}
                    className={`w-12 h-12 flex items-center justify-center rounded cursor-pointer transition-all z-10 ${cellClasses}`}
                  >
                    {renderContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitBoard;
