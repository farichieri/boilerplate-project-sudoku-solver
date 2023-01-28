'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    const letterRegex = /[a-iA-I]/;
    const numberRegex = /[1-9]/;
    const puzzleRegex = /[^0-9.]/g;

    const matches = (val, regex) => {
      return regex.test(val);
    };

    const matchesPuzzle = (puzzle) => {
      return matches(puzzle, puzzleRegex);
    };

    const matchesCoordinate = (coordinate) => {
      const number = coordinate.split('')[1];
      const match =
        matches(letter, letterRegex) && matches(number, numberRegex);
      return match && coordinate.length === 2;
    };

    const matchesValue = (value) => {
      const number = value;
      const match = matches(number, numberRegex);
      return match && value.length === 1;
    };

    if (!puzzle || !coordinate || !value) {
      return res.status(200).send({ error: 'Required field(s) missing' });
    }

    if (puzzle.length !== 81) {
      return res
        .status(200)
        .send({ error: 'Expected puzzle to be 81 characters long' });
    }

    if (!matchesPuzzle(puzzle)) {
      return res.status(200).send({ error: 'Invalid characters in puzzle' });
    }

    const letter = coordinate.split('')[0];

    if (!matchesCoordinate(coordinate)) {
      return res.status(200).send({ error: 'Invalid coordinate' });
    }

    if (!matchesValue(value)) {
      return res.status(200).send({ error: 'Invalid value' });
    }
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
