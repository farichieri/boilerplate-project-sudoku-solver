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

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleInvalidChar })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      });
    done();
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleLInvalidLength })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          'Expected puzzle to be 81 characters long'
        );
      });
    done();
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleNoSolution })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
      });
    done();
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'a1', value: 7 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
      });
    done();
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'a2', value: 4 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
      });
    done();
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'b1', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row', 'region');
      });
    done();
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'a2', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row', 'column', 'region');
      });
    done();
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'b1', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row', 'column', 'region');
      });
    done();
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({})
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
      });
    done();
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleInvalidChar, coordinate: 'b1', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      });
    done();
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleLInvalidLength, coordinate: 'b1', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          'Expected puzzle to be 81 characters long'
        );
      });
    done();
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: '+1', value: 1 })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
      });
    done();
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleValidString, coordinate: 'a1', value: 'a' })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
      });
    done();
  });
});
