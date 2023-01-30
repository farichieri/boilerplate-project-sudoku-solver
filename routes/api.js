'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate | !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    if (!solver.checkLength(puzzle)) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (!solver.checkCharacters(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    let validCoordinate = solver.checkCoordinate(coordinate);
    let validValue = solver.checkValue(value);

    if (!validCoordinate) {
      return res.json({ error: 'Invalid coordinate' });
    }
    if (!validValue) {
      return res.json({ error: 'Invalid value' });
    }

    let row = coordinate.split('')[0];
    let col = coordinate.split('')[1];
    let validRow = solver.checkRowPlacement(puzzle, row, col, value);
    let validCol = solver.checkColPlacement(puzzle, row, col, value);
    let validReg = solver.checkRegPlacement(puzzle, row, col, value);
    let conflicts = [];

    if (validRow && validCol && validReg) {
      return res.json({ valid: true });
    } else {
      if (!validRow) {
        conflicts.push('row');
      }
      if (!validCol) {
        conflicts.push('column');
      }
      if (!validReg) {
        conflicts.push('region');
      }
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }
    if (!solver.checkLength(puzzle)) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (!solver.checkCharacters(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    let solution = solver.solve(puzzle);
    if (!solution) {
      return res.json({ error: 'Puzzle cannot be solved' });
    }

    res.json({ solution });
  });
};
