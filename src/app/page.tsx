'use client';

import { useState, useCallback, useRef } from "react";
import { produce } from "immer";
import {
  NUM_ROWS as numRows,
  NUM_COLS as numCols,
  TIMEOUT as timeout,
  RANDOM_PROBABILITY as randomProbability,
} from "@/app/config";
import links from "@/app/links";

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

const generateGrid = ({
  initValue = 0, // Valor por defecto
  isRandom = false,
}: {
  initValue?: number; // Ahora es opcional
  isRandom?: boolean;
}): number[][] => {
  const rows: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () =>
        !isRandom
          ? initValue
          : Math.random() > randomProbability
            ? 1
            : 0
      )
    );
  }
  return rows;
};

export default function Home() {
  const [generation, setGeneration] = useState(0);
  const [grid, setGrid] = useState(() => generateGrid({ initValue: 0 }));
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) =>
      produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    );
    setGeneration((g) => g + 1);
    setTimeout(runSimulation, timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a0f3e] to-[#0a0e27] relative overflow-hidden">
      {/* Synthwave grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(cyan 1px, transparent 1px),
          linear-gradient(90deg, cyan 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl relative z-10">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold neon-pink mb-4 tracking-wider">
            CONWAY&apos;S GAME OF LIFE
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full"></div>
        </header>

        {/* Introduction */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-[#1a0f3e]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-cyan-500/30">
            <p className="text-base sm:text-lg text-cyan-200 leading-relaxed">
              The <strong className="text-pink-400 neon-pink">Game of Life</strong>, is a {' '}
              <a
                href={links.automaton}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >cellular automaton</a> devised by the British mathematician{' '}
              <a
                href={links.author}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >John Horton Conway</a> in 1970. It is a{' '}
              <a
                href={links.zeroPlayerGame}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >zero-player game</a>, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is{' '}
              <a
                href={links.turingComplete}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >Turing complete</a> and can simulate a{' '}
              <a
                href={links.universalConstructor}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >universal constructor</a> or any other{' '}
              <a
                href={links.turingMachine}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
              >Turing machine</a>.
            </p>
          </div>
        </section>

        {/* Rules Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 neon-cyan mb-6 tracking-wider">RULES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Rules list */}
            <div className="bg-[#1a0f3e]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-purple-500/30">
              <ul className="space-y-4">
                <li className="text-cyan-200 font-medium leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold mr-3 text-sm border border-cyan-400/50">1</span>
                  Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                </li>
                <li className="text-cyan-200 font-medium leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 font-bold mr-3 text-sm border border-pink-400/50">2</span>
                  Any live cell with two or three live neighbours lives on to the next generation.
                </li>
                <li className="text-cyan-200 font-medium leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 font-bold mr-3 text-sm border border-yellow-400/50">3</span>
                  Any live cell with more than three live neighbours dies, as if by overpopulation.
                </li>
                <li className="text-cyan-200 font-medium leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold mr-3 text-sm border border-purple-400/50">4</span>
                  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                </li>
              </ul>
            </div>
            {/* Card section */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-pink-500/30">
              <p className="text-cyan-200 leading-relaxed">
                The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight{' '}
                <a
                  href={links.neighborhood}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors neon-cyan"
                >neighbours</a>, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
              </p>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-[#0a0e27] px-6 py-3 rounded-xl shadow-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-cyan-400/50 tracking-wider"
              onClick={() => {
                setGrid(generateGrid({ isRandom: true }));
              }}
            >
              RANDOM GENERATION
            </button>
            <button
              className={`w-full sm:w-auto px-6 py-3 rounded-xl shadow-lg font-bold text-[#0a0e27] transition-all duration-200 transform hover:scale-105 active:scale-95 tracking-wider border-2 ${running
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 border-pink-400/50"
                : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 border-cyan-400/50"
                }`}
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "STOP" : "START"}
            </button>
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-[#0a0e27] px-6 py-3 rounded-xl shadow-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-purple-400/50 tracking-wider"
              onClick={() => {
                setGrid(generateGrid({ initValue: 0 }));
                setGeneration(0);
              }}
            >
              CLEAR
            </button>
          </div>
        </section>

        {/* Game Grid */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col items-center">
            <div className="bg-[#1a0f3e]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-cyan-500/30 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 neon-cyan mb-2 text-center tracking-wider">
                GENERATION: <span className="text-pink-400 neon-pink">{generation}</span>
              </h3>
            </div>

            <div className="bg-[#1a0f3e]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-purple-500/30 overflow-x-auto w-full">
              <div className="flex justify-center">
                <div
                  className="inline-grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${numCols}, minmax(8px, 1fr))`,
                  }}
                >
                  {grid.map((rows, i) =>
                    rows.map((col, k) => (
                      <div
                        key={`${i}-${k}`}
                        className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-sm transition-all duration-150 cursor-pointer ${grid[i][k]
                          ? "bg-cyan-400 border border-cyan-300"
                          : "bg-[#0a0e27] border border-purple-500/20"
                          } hover:opacity-80 hover:scale-110`}
                        onClick={() => {
                          const newGrid = produce(grid, (gridCopy) => {
                            gridCopy[i][k] = grid[i][k] ? 0 : 1;
                          });
                          setGrid(newGrid);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#050815]/90 backdrop-blur-sm text-cyan-300 py-6 sm:py-8 rounded-2xl shadow-2xl border-2 border-cyan-500/30">
          <div className="container mx-auto text-center px-4">
            <p className="text-sm sm:text-base font-medium">
              Created by <span className="font-bold text-pink-400 neon-pink">Jaime Simental</span> |{' '}
              <a
                href="https://missionjimmy.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors neon-cyan"
              >
                🔗 missionjimmy.rocks
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
