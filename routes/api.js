'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.status(200).send({ error: 'Required field missing' });
    }

    if (puzzle.length !== 81) {
      return res
        .status(200)
        .send({ error: 'Expected puzzle to be 81 characters long' });
    }

    const regex = /[^0-9.]/g;
    const matches = !regex.test(puzzle);

    if (matches !== true) {
      return res.status(200).send({ error: 'Invalid characters in puzzle' });
    }

    const solution = solver.solve(puzzle);

    if (solution) {
      return res.status(200).send({ solution: solution });
    } else if (!solution) {
      return res.status(200).send({ error: 'Puzzle cannot be solved' });
    }
  });
};
