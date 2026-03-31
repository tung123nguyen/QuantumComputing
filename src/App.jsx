import React, { useState, useEffect, useMemo } from "react";
import GatePalette from "./components/Palette/GatePalette";
import CircuitBoard from "./components/Circuit/CircuitBoard";
import StateVectorResult from "./components/Results/StateVectorResult";
import { computeFinalState } from "./lib/quantum/engine";

const App = () => {
  const [numQubits, setNumQubits] = useState(1);
  const [selectedGate, setSelectedGate] = useState("");
  const [operations, setOperations] = useState([]);
  const [pendingControl, setPendingControl] = useState(null);
  const [stateVector, setStateVector] = useState([]);
  const [error, setError] = useState(null);

  // Compute state vector whenever circuit changes
  useEffect(() => {
    try {
      const finalState = computeFinalState(numQubits, operations);
      setStateVector(finalState);
      setError(null);
    } catch (err) {
      console.error("Quantum Calculation Error:", err);
      setError("Calculation failed.");
    }
  }, [numQubits, operations]);

  // Clear pending control if gate selection changes
  useEffect(() => {
    setPendingControl(null);
  }, [selectedGate]);

  const handleAddQubit = () => {
    if (numQubits < 5) {
      setNumQubits((prev) => prev + 1);
    }
  };

  const handleRemoveQubit = () => {
    if (numQubits > 1) {
      // Remove operations associated with removed qubit
      setOperations((prev) => prev.filter((op) => op.qubit < numQubits - 1));
      setNumQubits((prev) => prev - 1);
    }
  };

  const handlePlaceGate = (qubit, step) => {
    if (selectedGate === "CX") {
      if (!pendingControl) {
        setPendingControl({ qubit, step });
      } else {
        if (pendingControl.step !== step) {
          setError("CNOT Target must be on the same step as Control.");
          setPendingControl(null);
          return;
        }
        if (pendingControl.qubit === qubit) {
          setPendingControl(null);
          return;
        }

        const filteredOps = operations.filter(
          (op) =>
            !(
              op.step === step &&
              (op.qubit === pendingControl.qubit ||
                op.qubit === qubit ||
                op.control === pendingControl.qubit ||
                op.target === pendingControl.qubit ||
                op.control === qubit ||
                op.target === qubit)
            ),
        );

        filteredOps.push({
          step,
          gateId: "CX",
          control: pendingControl.qubit,
          target: qubit,
        });

        setOperations(filteredOps);
        setPendingControl(null);
        setError(null);
      }
      return;
    }

    const existingGateIdx = operations.findIndex(
      (op) =>
        op.step === step &&
        (op.qubit === qubit || op.control === qubit || op.target === qubit),
    );

    if (existingGateIdx !== -1) {
      const newOps = [...operations];
      if (
        !selectedGate ||
        operations[existingGateIdx].gateId === selectedGate
      ) {
        newOps.splice(existingGateIdx, 1);
      } else {
        newOps[existingGateIdx] = { qubit, step, gateId: selectedGate };
      }
      setOperations(newOps);
    } else if (selectedGate) {
      setOperations([...operations, { qubit, step, gateId: selectedGate }]);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple inline-block">
            Quantum Circuit Simulator
          </h1>
          <p className="text-gray-400 mt-2">
            Build circuits, observe wave functions.
          </p>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Gate Palette */}
          <div className="lg:col-span-1">
            <GatePalette
              selectedGate={selectedGate}
              onSelectGate={setSelectedGate}
            />
          </div>

          {/* Right Main Panel - Circuit & Results */}
          <div className="lg:col-span-3 flex flex-col items-start w-full">
            <CircuitBoard
              numQubits={numQubits}
              operations={operations}
              onAddQubit={handleAddQubit}
              onRemoveQubit={handleRemoveQubit}
              onPlaceGate={handlePlaceGate}
              selectedGate={selectedGate}
              pendingControl={pendingControl}
            />

            <StateVectorResult
              stateVector={stateVector}
              numQubits={numQubits}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
