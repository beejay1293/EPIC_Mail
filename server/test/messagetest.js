import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const validMessage = {
  sender: 'matti@epics.com',
  subject: 'Welcome home',
  message: 'New message',
  status: 'sent',
  reciever: 'Layne80@hotmail.com',
};

const invalidMessage = {
  sender: 'matti@epics.com',
  subject: 'Welcome home',
  message: 'New message',
  status: 'sent',
  reciever: 'Layne80@hotmailwrong.com',
};

// test route for POST /messages if inputs are valid
describe('POST api/v1/messages', () => {
  it('Should successfully create a message if inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .send(validMessage)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(201);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.an('object');
        done();
      });
  });
});

// test route for POST /messages reciever does not exist
describe('POST api/v1/messages', () => {
  it('Should return an error if reciever does not exist', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .send(invalidMessage)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(404);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('Reciever address was not recognized');
        done();
      });
  });
});

// Test suite for POST /messages route invalid
describe('POST api/v1/messages', () => {
  it('Should return an error if message inputs are invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
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
