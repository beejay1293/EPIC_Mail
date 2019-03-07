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

// Test suite for GET /messages
describe('GET api/v1/messages', () => {
  it('Should return all received messages', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data[0]).to.be.a('object');

        done();
      });
  });
});

// Test suite for GET /messages/unread
describe('GET api/v1/messages/unread', () => {
  it('Should return all unread received messages if there is any', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/unread')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data).to.be.a('array');

        done();
      });
  });
});

// Test suite for GET /messages/sent
describe('GET api/v1/messages/sent', () => {
  it('Should return all sent messages', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/sent')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data[0]).to.be.a('object');

        done();
      });
  });
});

// Test suite for GET /messages/messageId
describe('GET api/v1/messages/messageId', () => {
  it('Should return a specific message', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/12')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data).to.be.an('array');
        expect(body.data.length).to.be.equal(1);

        done();
      });
  });
});

// Test suite for DELETE /messages/messageId
describe('DELETE api/v1/messages/messageId', () => {
  it('Should delete a specific message', (done) => {
    chai
      .request(app)
      .delete('/api/v1/messages/13')
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data).to.be.an('array');
        expect(body.data[0]).to.be.a('object');
        expect(body.data.length).to.be.equal(1);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.a('string');

        done();
      });
  });
});
