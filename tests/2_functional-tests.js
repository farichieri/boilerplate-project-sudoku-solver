const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const {
  puzzlesAndSolutions,
  puzzlesAndInsolutions,
} = require('../controllers/puzzle-strings.js');
const puzzleValidString = puzzlesAndSolutions[0][0];
const puzzleSolution = puzzlesAndSolutions[0][1];

const puzzleInvalidChar = puzzlesAndInsolutions[0][0];
const puzzleLInvalidLength = puzzlesAndInsolutions[1][0];

const puzzleNoSolution = puzzlesAndInsolutions[2][0];

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleValidString })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzleSolution);
      });
    done();
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
      });
    done();
  });
});
