const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const {
  puzzlesAndSolutions,
  puzzlesAndInsolutions,
} = require('../controllers/puzzle-strings.js');
const puzzleValidString = puzzlesAndSolutions[0][0];
const puzzleSolution = puzzlesAndSolutions[0][1];

const puzzleInvalidChar = puzzlesAndInsolutions[0][0];
const puzzleLInvalidLength = puzzlesAndInsolutions[1][0];

const puzzleNoSolution = puzzlesAndInsolutions[2][0];

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.equal(solver.checkCharacters(puzzleInvalidChar), false);
    assert.equal(puzzleInvalidChar.length, 81);
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    console.log({ puzzleLInvalidLength });
    assert.equal(solver.checkLength(puzzleLInvalidLength), false);
    assert.notEqual(puzzleLInvalidLength.length, 81);
  });

  test('Logic handles a valid row placement', () => {
    assert.equal(
      solver.checkRowPlacement(puzzleValidString, 'a', '1', '3'),
      true
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles an invalid row placement', () => {
    assert.equal(
      solver.checkRowPlacement(puzzleValidString, 'a', '1', '4'),
      false
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles a valid column placement', () => {
    assert.equal(
      solver.checkColPlacement(puzzleValidString, 'a', '1', '7'),
      true
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles an invalid column placement', () => {
    assert.equal(
      solver.checkColPlacement(puzzleValidString, 'b', '1', '1'),
      false
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.equal(
      solver.checkRegPlacement(puzzleValidString, 'a', '2', '3'),
      true
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.equal(
      solver.checkRegPlacement(puzzleValidString, 'a', '2', '6'),
      false
    );
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.equal(solver.solve(puzzleNoSolution), false);
    assert.equal(puzzleValidString.length, 81);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(puzzleValidString), puzzleSolution);
    assert.equal(puzzleValidString.length, 81);
  });
});
