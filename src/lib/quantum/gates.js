import { complex, exp, multiply, pi, sqrt } from 'mathjs';

// Base unit factors
const invSqrt2 = 1 / Math.sqrt(2);
const i = complex(0, 1);

export const GATES = {
  // Identity gate
  I: {
    id: 'I',
    name: 'Identity',
    matrix: [
      [1, 0],
      [0, 1]
    ]
  },
  // Pauli-X (NOT) gate
  X: {
    id: 'X',
    name: 'Pauli-X',
    matrix: [
      [0, 1],
      [1, 0]
    ]
  },
  // Pauli-Y gate
  Y: {
    id: 'Y',
    name: 'Pauli-Y',
    matrix: [
      [0, complex(0, -1)],
      [complex(0, 1), 0]
    ]
  },
  // Pauli-Z gate
  Z: {
    id: 'Z',
    name: 'Pauli-Z',
    matrix: [
      [1, 0],
      [0, -1]
    ]
  },
  // Hadamard gate
  H: {
    id: 'H',
    name: 'Hadamard',
    matrix: [
      [invSqrt2, invSqrt2],
      [invSqrt2, -invSqrt2]
    ]
  },
  // S / Phase gate
  S: {
    id: 'S',
    name: 'Phase (S)',
    matrix: [
      [1, 0],
      [0, i]
    ]
  },
  // T gate (pi/8)
  T: {
    id: 'T',
    name: 'T',
    matrix: [
      [1, 0],
      [0, exp(multiply(i, pi / 4))]
    ]
  },
  // CNOT gate (handled specially in engine)
  CX: {
    id: 'CX',
    name: 'CNOT',
    // matrix is not directly used for CNOT due to multi-qubit complexity
    matrix: null,
    isMultiQubit: true
  }
};
