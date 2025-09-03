import { it, describe, expect, beforeEach } from 'vitest';
import Board from './sudoku';

describe('Board creation', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('Creates 9x9 board', () => {
    expect(board.grid).toHaveLength(9);
    expect(board.grid[0]).toHaveLength(9);
  });

  it('Each cell is an instance of class Cell', () => {
    expect(board.grid[0][0]).toBeInstanceOf(Object);
  });

  it('Starts with empty cells', () => {
    expect(board.grid[0][0].value).toBeNull();
  });
});

describe('Adding numbers to cells', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('Adding a valid value', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(8, 5, 7);

    expect(board.grid[0][0].value).toBe(1);
    expect(board.grid[8][5].value).toBe(7);
  });

  describe('Adding an invalid value', () => {
    it('Adding a string', () => {
      expect(() => board.addNumber(0, 0, 'hello')).toThrow();
      expect(() => board.addNumber(0, 0, '2')).toThrow();
    });

    it('Adding a number out of bounds', () => {
      expect(() => board.addNumber(0, 0, 12)).toThrow();
      expect(() => board.addNumber(0, 0, 0)).toThrow();
    });
  });
});

describe('Adding conflicting cells', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it("Adding numbers that don't conflict", () => {
    const firstMove = board.addNumber(0, 0, 1);
    const secondMove = board.addNumber(0, 1, 2);

    expect(firstMove.result).toBe(true);
    expect(secondMove.result).toBe(true);
  });

  describe('Adding conflicting numbers', () => {
    it('Same col', () => {
      board.addNumber(0, 0, 1);
      const conflictingMove = board.addNumber(7, 0, 1);

      expect(conflictingMove.result).toBe(false);
      expect(conflictingMove.conflicts).toHaveLength(2);
      expect(conflictingMove.conflicts[0]).toEqual({ row: 7, col: 0 });
      expect(conflictingMove.conflicts[1]).toEqual({ row: 0, col: 0 });
    });

    it('Same row', () => {
      board.addNumber(0, 0, 1);
      const conflictingMove = board.addNumber(0, 5, 1);

      expect(conflictingMove.result).toBe(false);
      expect(conflictingMove.conflicts).toHaveLength(2);
      expect(conflictingMove.conflicts[0]).toEqual({ row: 0, col: 5 });
      expect(conflictingMove.conflicts[1]).toEqual({ row: 0, col: 0 });
    });

    it('Same block', () => {
      board.addNumber(0, 0, 1);
      const conflictingMove = board.addNumber(2, 2, 1);

      expect(conflictingMove.result).toBe(false);
      expect(conflictingMove.conflicts).toHaveLength(2);
      expect(conflictingMove.conflicts[0]).toEqual({ row: 2, col: 2 });
      expect(conflictingMove.conflicts[1]).toEqual({ row: 0, col: 0 });
    });

    it('Multiple conflicts', () => {
      board.addNumber(0, 0, 1);
      board.addNumber(2, 5, 1);
      board.addNumber(5, 4, 1);

      const conflictingMove = board.addNumber(0, 4, 1);
      expect(conflictingMove.result).toBe(false);
      expect(conflictingMove.conflicts).toHaveLength(4);
      expect(conflictingMove.conflicts[0]).toEqual({ row: 0, col: 4 });
    });
  });
});

describe('Adding notes', () => {
  let board;

  beforeEach(() => {
    board = new Board();
    board.notesMode = true;
  });

  it('Adding one note', () => {
    board.addNumber(0, 0, 1);

    expect(board.grid[0][0].value).toBeInstanceOf(Array);
    expect(board.grid[0][0].value).toHaveLength(1);
    expect(board.grid[0][0].value[0]).toBe(1);
  });

  it('Adding two notes in consecutive order', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 0, 2);

    expect(board.grid[0][0].value).toBeInstanceOf(Array);
    expect(board.grid[0][0].value).toHaveLength(2);
    expect(board.grid[0][0].value[0]).toBe(1);
    expect(board.grid[0][0].value[1]).toBe(2);
  });

  it('Adding notes out of order still keeps the array in order', () => {
    board.addNumber(0, 0, 9);
    board.addNumber(0, 0, 1);
    board.addNumber(0, 0, 5);
    board.addNumber(0, 0, 3);

    expect(board.grid[0][0].value).toBeInstanceOf(Array);
    expect(board.grid[0][0].value).toHaveLength(4);
    expect(board.grid[0][0].value[0]).toBe(1);
    expect(board.grid[0][0].value[1]).toBe(3);
    expect(board.grid[0][0].value[2]).toBe(5);
    expect(board.grid[0][0].value[3]).toBe(9);
  });

  it('Adding a normal number after note removes the notes', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 1, 2);

    expect(board.grid[0][0].value).toBeInstanceOf(Array);
    expect(board.grid[0][0].value).toHaveLength(1);
    expect(board.grid[0][0].value[0]).toBe(1);

    board.notesMode = false;
    board.addNumber(0, 0, 2);

    expect(board.grid[0][0].value).toBe(2);

    expect(board.grid[0][1].value).toBeInstanceOf(Array);
    expect(board.grid[0][1].value).toHaveLength(1);
    expect(board.grid[0][1].value[0]).toBe(2);
  });
});

describe('Clear method', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('Clears all values', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 1, 2);
    board.addNumber(8, 8, 7);
    board.addNumber(5, 5, 6);

    expect(board.grid[0][0].value).toBe(1);
    expect(board.grid[0][1].value).toBe(2);
    expect(board.grid[8][8].value).toBe(7);
    expect(board.grid[5][5].value).toBe(6);

    board.clear();

    expect(board.grid[0][0].value).toBeNull();
    expect(board.grid[0][1].value).toBeNull();
    expect(board.grid[8][8].value).toBeNull();
    expect(board.grid[5][5].value).toBeNull();
  });

  it("Doesn't clear locked cells", () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 1, 2);
    board.board[0][1].locked = true;
    board.addNumber(8, 8, 7);
    board.board[8][8].locked = true;
    board.addNumber(5, 5, 6);

    expect(board.grid[0][0].value).toBe(1);
    expect(board.grid[0][1].value).toBe(2);
    expect(board.grid[8][8].value).toBe(7);
    expect(board.grid[5][5].value).toBe(6);

    board.clear();

    expect(board.grid[0][0].value).toBeNull();
    expect(board.grid[0][1].value).toBe(2);
    expect(board.grid[8][8].value).toBe(7);
    expect(board.grid[5][5].value).toBeNull();
  });
});

describe('Undo method', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('Doing undo on the first step does nothing', () => {
    expect(() => board.undo()).not.toThrow();
  });

  it('Undo one step', () => {
    board.addNumber(0, 0, 1);

    expect(board.grid[0][0].value).toBe(1);

    board.undo();

    expect(board.grid[0][0].value).toBeNull();
  });

  it('Undo two steps on same cell', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 0, 2);
    expect(board.grid[0][0].value).toBe(2);

    board.undo();
    expect(board.grid[0][0].value).toBe(1);
    board.undo();
    expect(board.grid[0][0].value).toBeNull();
  });

  it('Undo two steps on different cells', () => {
    board.addNumber(0, 0, 1);
    board.addNumber(0, 2, 2);
    expect(board.grid[0][0].value).toBe(1);
    expect(board.grid[0][2].value).toBe(2);

    board.undo();
    expect(board.grid[0][0].value).toBe(1);
    expect(board.grid[0][2].value).toBeNull();

    board.undo();
    expect(board.grid[0][0].value).toBeNull();
    expect(board.grid[0][2].value).toBeNull();
  });

  it('Undo one step on notes', () => {
    board.notesMode = true;
    board.addNumber(5, 5, 1);
    board.addNumber(5, 5, 2);
    board.addNumber(5, 5, 3);

    expect(board.grid[5][5].value).toHaveLength(3);

    board.undo();
    expect(board.grid[5][5].value).toHaveLength(2);

    board.undo();
    expect(board.grid[5][5].value).toHaveLength(1);

    board.undo();
    expect(board.grid[5][5].value).toBeNull();
  });
});
