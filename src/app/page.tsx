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
  initValue,
  isRandom = false,
}: {
  initValue: number; // O el tipo que corresponda
  isRandom?: boolean; // Este parámetro es opcional
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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center my-6">Conway&apos;s Game of Life</h1>
      <div className="border-t border-gray-300 my-4"></div>

      <p className="text-lg mb-6">
        The <strong>Game of Life</strong>, is a {' '}
        <a
          href={links.automaton}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >cellular automaton</a> devised by the British mathematician
        <a
          href={links.author}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        > John Horton Conway</a> in 1970. It is a
        <a
          href={links.zeroPlayerGame}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        > zero-player game</a>, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is
        <a
          href={links.turingComplete}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        > Turing complete</a> and can simulate a
        <a
          href={links.universalConstructor}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        > universal constructor</a> or any other
        <a
          href={links.turingMachine}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        > Turing machine</a>.
      </p>

      <div className="border-t border-gray-300 my-4"></div>

      <h5 className="text-2xl font-semibold mb-4">Rules</h5>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules list */}
        <ul className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
          <li className="text-gray-800 font-medium">
            <strong>1.-</strong> Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          </li>
          <li className="text-gray-800 font-medium">
            <strong>2.-</strong> Any live cell with two or three live neighbours lives on to the next generation.
          </li>
          <li className="text-gray-800 font-medium">
            <strong>3.-</strong> Any live cell with more than three live neighbours dies, as if by overpopulation.
          </li>
          <li className="text-gray-800 font-medium">
            <strong>4.-</strong> Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          </li>
        </ul>
        {/* Card section */}
        <div className="bg-blue-gray-900 text-white p-6 rounded-lg shadow-lg">
          <p>
            The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight
            <a
              href={links.neighborhood}
              className="text-blue-400 underline"
            > neighbours</a>, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
          </p>
        </div>
      </div>


      <div className="flex gap-4 my-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          onClick={() => {
            setGrid(generateGrid({ isRandom: true }));
          }}
        >
          Random Generation
        </button>
        <button
          className={`px-4 py-2 rounded shadow ${running ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
          onClick={() => {
            setGrid(generateGrid({ initValue: 0 }));
            setGeneration(0);
          }}
        >
          Clear
        </button>
      </div>


      <div className="flex flex-col justify-center items-center">
        <h3 className="text-lg font-medium mb-4">Generation: {generation}</h3>

        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${numCols}, 10px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                className={`w-[10px] h-[10px] ${grid[i][k] ? "bg-black" : "bg-white"
                  } `}
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

      <footer className="bg-gray-900 text-gray-300 py-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            Created by <span className="font-semibold text-white">Jaime Simental</span> |
            <a
              href="https://missionjimmy.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-blue-400 underline ml-1"
            > 🔗 missionjimmy.rocks
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
