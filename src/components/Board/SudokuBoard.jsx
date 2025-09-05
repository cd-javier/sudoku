import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import styles from './SudokuBoard.module.css';

import Board from '../../utils/sudoku';
import Keyboard from '../Keyboard/Keyboard';
import WinModal from '../WinModal/WinModal';

function Cell({ cell, selected, selectCell, conflicts, isNotesMode }) {
  const { value, row, col, locked } = cell;
  function handleClick() {
    selectCell(row, col);
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectCell(row, col);
    }
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      className={classNames(styles.cell, {
        [styles.selected]: selected,
        [styles.locked]: locked,
        [styles.conflict]: conflicts,
        [styles.notesMode]: isNotesMode,
      })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {value &&
        (typeof value === 'number' ? (
          value
        ) : (
          <div className={styles.cellNotesGrid}>
            {numbers.map((num) => {
              return (
                <div className={styles.cellNote} key={num}>
                  {value.includes(num) && num}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}

// Divides 81 cells in 9 blocks of 9
function groupCellsByBlock(grid) {
  const blocks = Array.from({ length: 9 }, () => []);

  grid.flat().forEach((cell) => {
    const blockRow = Math.floor(cell.row / 3);
    const blockCol = Math.floor(cell.col / 3);
    const blockIndex = blockRow * 3 + blockCol;

    blocks[blockIndex].push(cell);
  });

  return blocks;
}

export default function SudokuBoard() {
  const { mode } = useParams();
  const [board, setBoard] = useState(new Board(mode));
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [conflicts, setConflicts] = useState([]);
  const blocks = groupCellsByBlock(board.grid);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (board.isComplete()) {
      setSelectedCell({ row: null, col: null });
      setIsFinished(true);
      return;
    }
    setIsFinished(false);
  }, [board]);

  function selectCell(row, col) {
    if (isFinished) return;
    if (row === selectedCell.row && col === selectedCell.col) {
      setSelectedCell({ row: null, col: null });
      return;
    }
    setSelectedCell({ row, col });
  }

  // Finds conflicts on the board after every move
  function findConflicts(board) {
    setConflicts(board.findAllConflicts());
  }

  // Each cell checks if it's in the conflicts array
  function doesHaveConflicts(row, col) {
    return conflicts.some((coord) => coord.row === row && coord.col === col);
  }

  // Adds a number to the cell
  function addNumber(number) {
    const { row, col } = selectedCell;

    if (row === null && col === null) return;
    if (board.board[row][col].locked) return;

    setBoard((prevBoard) => {
      const newBoard = prevBoard.clone();
      newBoard.addNumber(row, col, number);
      findConflicts(newBoard);
      return newBoard;
    });
  }

  // Removes number from cell
  function deleteNumber() {
    const { row, col } = selectedCell;

    if (row === null && col === null) return;
    if (board.board[row][col].locked) return;

    setBoard((prevBoard) => {
      const newBoard = prevBoard.clone();
      newBoard.removeNumber(row, col);
      findConflicts(newBoard);
      return newBoard;
    });
  }

  // Event for physical keyboard usage
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key >= '1' && e.key <= '9') {
        const number = Number(e.key);
        addNumber(number);
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteNumber();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  // Functions for UI Keyboard
  function undo() {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.clone();
      newBoard.undo();
      findConflicts(newBoard);
      return newBoard;
    });
  }

  function clear() {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.clone();
      newBoard.clear();
      findConflicts(newBoard);
      return newBoard;
    });
  }

  function switchNotes() {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.clone();
      newBoard.switchNotes();
      findConflicts(newBoard);
      return newBoard;
    });
  }

  return (
    <div>
      {isFinished && <WinModal mode={mode} />}
      <div className={styles.grid}>
        {blocks.map((block, index) => {
          return (
            <div className={styles.block} key={index}>
              {block.map((cell, index) => {
                return (
                  <Cell
                    cell={cell}
                    key={index}
                    selected={
                      cell.row === selectedCell.row &&
                      cell.col === selectedCell.col
                    }
                    conflicts={doesHaveConflicts(cell.row, cell.col)}
                    selectCell={selectCell}
                    isNotesMode={board.notesMode}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <Keyboard
        handleNumber={addNumber}
        handleDelete={deleteNumber}
        handleUndo={undo}
        handleNotes={switchNotes}
        handleClear={clear}
        isNumberDisabled={
          selectedCell.row === null && selectedCell.col === null
        }
        isUndoDisabled={board.log.length === 0}
        isNotesMode={board.notesMode}
      />
    </div>
  );
}
