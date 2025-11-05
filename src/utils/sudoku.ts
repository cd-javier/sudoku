import shuffle from './shuffle';

type CellOptions = {
  value?: number | null;
  locked?: boolean;
  notes?: Set<number>;
  row?: number;
  col?: number;
};

class Cell {
  value: number | null;
  locked: boolean;
  notes: Set<number>;
  row: number;
  col: number;

  constructor({
    value = null,
    locked = false,
    notes = new Set(),
    row = 0,
    col = 0,
  }: CellOptions = {}) {
    this.value = value;
    this.locked = locked;
    this.notes = notes;
    this.row = row;
    this.col = col;
  }

  /**
   * Checks if the number is out of bounds or invalid
   *
   * @param num Number that will go in the cell
   * @returns undefined.
   */
  checkValidity(num: number) {
    if (typeof num !== 'number' || num < 1 || num > 9) {
      throw new Error('Only numbers between 1 and 9 allowed');
    }
  }

  /**
   * Adds number to the cell
   *
   * @param num Number to be added
   * @returns undefined
   */
  addNumber(num: number) {
    if (this.locked) return;
    this.checkValidity(num);
    this.notes = new Set();
    this.value = num;
  }

  removeNumber() {
    if (this.locked) return;
    this.value = null;
  }

  /**
   * Adds number to the notes.
   *
   * If the notes already contain the number, the number is removed
   *
   * @param num Number to be added to notes
   * @returns undefined
   */
  addNote(num: number) {
    if (this.locked) return;
    this.checkValidity(num);
    this.value = null;
    if (this.notes.has(num)) this.notes.delete(num);
    else this.notes.add(num);
  }

  clear() {
    if (this.locked) return;
    this.value = null;
    this.notes = new Set();
  }
}

type Modes = 'test' | 'blank' | 'easy' | 'medium' | 'hard';

class Board {
  notesMode: boolean;
  log: Cell[][][];
  board: Cell[][];

  constructor(mode: Modes = 'blank') {
    this.notesMode = false;
    this.log = [];
    if (mode === 'blank') {
      this.board = this.createEmptyGrid();
    } else {
      this.board = this.createPrefilledGrid(mode);
    }
  }

  /**
   * Transforms the complex board into a 2D Array that shows the numbers or notes each cell contains
   */
  get grid() {
    return this.board.map((row) =>
      row.map((cell) => ({
        value: cell.value ?? (cell.notes.size ? [...cell.notes].sort() : null),
        locked: cell.locked,
        row: cell.row,
        col: cell.col,
      }))
    );
  }

  switchNotes() {
    this.notesMode = !this.notesMode;
  }

  createEmptyGrid() {
    const grid = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Cell())
    );

    grid.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        cell.row = rowIndex;
        cell.col = colIndex;
      })
    );

    return grid;
  }

  createPrefilledGrid(mode: Modes): Cell[][] {
    let blanks = Math.floor(Math.random() * 10);
    if (mode === 'easy') blanks += 30;
    if (mode === 'medium') blanks += 40;
    if (mode === 'hard') blanks += 50;
    if (mode === 'test') blanks = 1;

    const board = Board.generateFullBoard();

    let count = 0;
    let safeguard = 0;

    while (count < blanks && safeguard < 300) {
      // Find cell at random
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const targetCell = board.board[row][col];

      // IF the cell is already empty, continue
      if (targetCell.value === null) continue;

      // Make a backup of the value of the cell
      const backup = targetCell.value;

      // Unlock the cell
      targetCell.locked = false;
      // Remove the value
      targetCell.value = null;

      // Check if the board has a unique solution or not
      const isUnique = board.hasUniqueSolution();

      if (isUnique) {
        // If it does, log on the counter
        count++;
      } else {
        safeguard++; // To avoid an endless loop
        // Put the original value back and lock the cell
        targetCell.value = backup;
        targetCell.locked = true;
      }
    }

    if (count === blanks) return board.board;

    return this.createPrefilledGrid(mode);
  }

  findConflicts(
    row: number,
    col: number,
    num: number
  ): { result: boolean; conflicts?: { row: number; col: number }[] } {
    const conflicts: { row: number; col: number }[] = [];

    for (let i = 0; i < 9; i++) {
      // Check same number on row
      if (i === col) continue; // Skip own cell
      if (this.board[row][i].value === num) {
        conflicts.push({ row: row, col: i });
      }
    }
    for (let i = 0; i < 9; i++) {
      // Check same number on col
      if (i === row) continue; // Skip own cell
      if (this.board[i][col].value === num) {
        conflicts.push({ row: i, col: col });
      }
    }

    // Calculate the cells in the same block
    const [startingRow, startingCol] = [
      Math.floor(row / 3) * 3,
      Math.floor(col / 3) * 3,
    ];

    for (let i = startingRow; i < startingRow + 3; i++) {
      if (i === row) continue; // Skip the row that's already been checked
      for (let j = startingCol; j < startingCol + 3; j++) {
        if (j === col) continue; // Skip the col that's already been checked
        if (this.board[i][j].value === num) {
          conflicts.push({ row: i, col: j });
        }
      }
    }

    if (conflicts.length > 0)
      return { result: false, conflicts: [{ row, col }, ...conflicts] };
    return { result: true };
  }

  findAllConflicts() {
    // Returns an array with all the cells that have a conflict
    const conflicts: { row: number; col: number }[] = [];

    // Loop throw all the cells of the board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Early exit if the cell has already been discovered to have a conflict
        if (conflicts.some((cell) => cell.row === i && cell.col === j))
          continue;
        const targetCell = this.board[i][j];
        // Exit if the cell is empty
        if (targetCell.value === null) continue;
        const hasConflicts = !this.findConflicts(i, j, targetCell.value).result;
        // If it has conflicts, the coords are pushed to the conflicts array
        if (hasConflicts) conflicts.push({ row: i, col: j });
      }
    }

    return conflicts;
  }

  addNumber(row: number, col: number, num: number) {
    // Adds the current board to the log
    this.addToLog();

    if (this.notesMode) {
      this.board[row][col].addNote(num);
      return { result: true };
    }

    if (this.board[row][col].value === num) {
      this.board[row][col].removeNumber();
      return { result: true };
    }

    const validity = this.findConflicts(row, col, num);

    this.board[row][col].addNumber(num);

    return validity;
  }

  removeNumber(row: number, col: number) {
    this.addToLog();
    this.board[row][col].clear();
  }

  clear() {
    this.addToLog();
    this.board.forEach((row) => row.forEach((cell) => cell.clear()));
  }

  print(grid = this.board) {
    console.log(
      grid
        .map((row) => row.map((cell) => cell.value || '_').join(' '))
        .join('\n')
    );
  }

  clone() {
    const newBoard = new Board();
    newBoard.board = this.board.map((row) =>
      row.map((cell) => {
        const cellOptions: CellOptions = {
          value: cell.value,
          locked: cell.locked,
          notes: new Set([...cell.notes]),
          row: cell.row,
          col: cell.col,
        };
        const c = new Cell(cellOptions);
        return c;
      })
    );
    newBoard.notesMode = this.notesMode;
    newBoard.log = this.log;
    return newBoard;
  }

  addToLog() {
    const logBoard = this.board.map((row) =>
      row.map((cell) => {
        const cellOptions: CellOptions = {
          value: cell.value,
          locked: cell.locked,
          notes: new Set([...cell.notes]),
          row: cell.row,
          col: cell.col,
        };
        const c = new Cell(cellOptions);
        return c;
      })
    );
    this.log.push(logBoard);
  }

  undo() {
    const previous = this.log.pop();
    if (previous) {
      this.board = previous;
    }
  }

  solve(cell = 0, board = this.clone()): { result: boolean; board?: Board } {
    // Base case: If we've reached beyond the last cell, the board is filled
    if (cell >= 81) return { result: true, board };

    // Convert cell index into coords
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    const targetCell = board.board[row][col];

    // If the cell is locked, continue
    if (targetCell.locked) return this.solve(cell + 1, board);

    // Find a match with random numbers 1-9
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i of nums) {
      // Skip the numbers that would cause conflict
      if (!board.findConflicts(row, col, i).result) continue;

      // Temporarily add the number
      targetCell.addNumber(i);
      const next = this.solve(cell + 1, board); // Continue with the next cell
      if (next.result) return next;
      // If there's no solution with that number, remove and continue with the next
      targetCell.removeNumber();
    }

    return { result: false };
  }

  static generateFullBoard(): Board {
    const blankBoard = new Board('blank');
    const solved = blankBoard.solve(); // returns { result, board }

    if (!solved.board) return this.generateFullBoard();

    solved.board.board.forEach((row) =>
      row.forEach((cell) => (cell.locked = true))
    );
    return solved.board;
  }

  hasUniqueSolution(
    cell = 0,
    board = this.clone(),
    count = { total: 0 }
  ): boolean {
    // Base case: if we've reached beyond the last cell, the board is fully filled
    if (cell >= 81) {
      count.total++; // We've found one valid solution
      return count.total === 1; // Return false to keep searching (we're not done yet)
    }

    // Convert cell index into coords
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    const targetCell = board.board[row][col];

    // If the current cell already has a value, skip to the next cell
    if (targetCell.value !== null) {
      return this.hasUniqueSolution(cell + 1, board, count);
    }

    // Try placing numbers 1 through 9 in the current empty cell
    for (let i = 1; i <= 9; i++) {
      // Skip numbers that would cause a conflict
      if (!board.findConflicts(row, col, i).result) continue;

      // Temporarily place the number
      targetCell.addNumber(i);

      // Recursively try to solve the next cell
      if (!this.hasUniqueSolution(cell + 1, board, count)) {
        // If we already found more than one solution, stop early
        return false;
      }

      // Backtrack: remove the number and try the next one
      targetCell.removeNumber();
    }

    // After trying all numbers, check if we've found exactly one solution
    return count.total === 1;
  }

  isComplete() {
    let result = true;

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (!cell.value) {
          result = false;
        } else if (!cell.locked) {
          const findConflicts = this.findConflicts(
            rowIndex,
            cellIndex,
            cell.value
          );
          if (findConflicts.conflicts) result = false;
        }
      });
    });

    return result;
  }
}

export default Board;
