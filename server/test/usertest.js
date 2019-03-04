import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const user = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  number: '08162990467',
  password: '1940andela',
};

// Test suite for home route
describe('GET /', () => {
  it('Should redirect to home route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.a('string');
        done();
      });
  });
});

// Test suite for non existing route
describe('GET *', () => {
  it('Should throw a 404 error', (done) => {
    chai
      .request(app)
      .get('/dsd')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(404);
        expect(body.error).to.be.a('string');
        done();
      });
  });
});

// Test suite for POST /signup route
describe('POST api/v1/auth/signup', () => {
  it('Should successfully create a user account if inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(201);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
});

// Test suite for POST /signup route invalid
describe('POST api/v1/auth/signup', () => {
  it('Should return an error if signup inputs are invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({})
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.a('object');

        done();
      });
  });
});

describe('POST api/v1/auth/signup', () => {
  it('should return an error if email already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Cynthia',
        lastname: 'Morgan',
        email: 'matti@epics.com',
        number: '08169504447',
        password: 'cent46',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        console.log(body);
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(409);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('user already exists');

        done();
      });
  });
});
