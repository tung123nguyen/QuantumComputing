import { kron, multiply, pow, sqrt, complex, abs, pow as mathPow } from 'mathjs';
import { GATES } from './gates';

/**
 * Initializes a state vector for n qubits.
 * Initial state is always |0...0>
 * @param {number} numQubits 
 * @returns {Array<Complex>} array representing column vector
 */
export function getInitialState(numQubits) {
  const size = Math.pow(2, numQubits);
  const state = new Array(size).fill(complex(0, 0));
  state[0] = complex(1, 0); // |0...0> state has probability amplitude 1
  return state;
}

/**
 * Applies a single qubit gate to the specific target qubit in an n-qubit system.
 * It computes the Kronecker product: I ⊗ ... ⊗ U ⊗ ... ⊗ I
 * @param {Array<Complex>} state 
 * @param {number} numQubits 
 * @param {number} targetQubit (0-indexed, 0 is the top wire)
 * @param {Object} gate matrix from GATES
 * @returns {Array<Complex>} new state vector
 */
export function applySingleQubitGate(state, numQubits, targetQubit, gate) {
  let operator = null;

  for (let i = 0; i < numQubits; i++) {
    const currentMatrix = (i === targetQubit) ? gate.matrix : GATES.I.matrix;
    if (operator === null) {
      operator = currentMatrix;
    } else {
      operator = kron(operator, currentMatrix);
    }
  }

  // mathjs multiply expects format matching (operator matrix * state column vector)
  // state here is 1D array, mathjs handles 1D array as column vector in multiply
  const newState = multiply(operator, state);
  return newState;
}

/**
 * Applies a CNOT (CX) gate.
 */
export function applyCNOT(state, numQubits, control, target) {
  const newState = [...state];
  const size = Math.pow(2, numQubits);
  
  for (let x = 0; x < size; x++) {
    const isControlSet = ((x >> (numQubits - 1 - control)) & 1) === 1;
    if (isControlSet) {
      const targetMask = 1 << (numQubits - 1 - target);
      const y = x ^ targetMask;
      if (x < y) {
        const temp = newState[x];
        newState[x] = newState[y];
        newState[y] = temp;
      }
    }
  }
  return newState;
}

/**
 * Given a circuit configuration, computes the final state vector.
 * @param {number} numQubits 
 * @param {Array<Object>} operations list of gate operations, e.g. { step: 0, qubit: 0, gateId: 'H' }
 * @returns {Array<Complex>}
 */
export function computeFinalState(numQubits, operations) {
  let state = getInitialState(numQubits);
  if (numQubits === 0) return [];
  
  const sortedOps = [...operations].sort((a, b) => a.step - b.step);
  
  for (const op of sortedOps) {
    if (op.gateId === 'CX') {
      if (op.control !== undefined && op.target !== undefined) {
        state = applyCNOT(state, numQubits, op.control, op.target);
      }
      continue;
    }
    
    const gate = GATES[op.gateId];
    if (!gate) continue;
    state = applySingleQubitGate(state, numQubits, op.qubit, gate);
  }

  return state;
}

/**
 * Get probability of a complex amplitude
 */
export function getProbability(amp) {
  // P = |a+bi|^2 = a^2 + b^2
  return mathPow(abs(amp), 2);
}
