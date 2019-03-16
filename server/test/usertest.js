import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';
import messageData from '../data/messages.json';

const { id } = messageData[0];

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const validMessage = {
  id: 26,
  sender: 'andela.giwa1@epic.com',
  subject: 'Welcome home',
  message: 'New message',
  status: 'sent',
  reciever: 'matti@epics.com',
};

const invalidMessage = {
  sender: 'matti@epics.com',
  subject: 'Welcome home',
  message: 'New message',
  status: 'sent',
  reciever: 'Layne80@hotmailwrong.com',
};

// const user = {
//   firstname: faker.name.firstName(),
//   lastname: faker.name.lastName(),
//   email: faker.internet.email(),
//   number: '08162990467',
//   password: '1940andela',
// };

let UserToken;
let DbToken;
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

// ========================USERS TEST=====================
// Test suite for POST /signup route
describe('POST api/v1/auth/signup', () => {
  it('Should successfully create a user account if inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        number: '0816957689',
        password: 'dele1989',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        UserToken = body.data[0].token;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(201);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
});

// Test suite for POST /signup db route
describe('POST api/v2/auth/signup', () => {
  it('Should successfully create a user account if inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'dele1989',
        number: '66778',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        DbToken = body.data[0].token;
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

// Test suite for POST /signup db route invalid
describe('POST api/v2/auth/signup', () => {
  it('Should return an error if signup inputs are invalid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
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

// test suite for POST /signup user already exists
describe('POST api/v1/auth/signup', () => {
  it('should return an error if email already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Matti',
        lastname: 'Mobolaji',
        email: 'andela.matti@eeeepic.com',
        number: '0816957689',
        password: 'dele1989',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(409);
        expect(body.error).to.be.a('string');
        done();
      });
  });
});

// test suite for POST /signup db user already exists
describe('POST api/v2/auth/signup', () => {
  it('should return an error if email already exists', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'Matti',
        lastname: 'Mobolaji',
        email: 'andela.matti@eeeepic.com',
        number: '0816957689',
        password: 'dele1989',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(409);
        expect(body.error).to.be.a('string');
        done();
      });
  });
});

// test for POST /login suite
describe('POST api/v1/auth/login', () => {
  it('should login successfully if user inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'andela.giwa1@epic.com',
        password: 'dele1989',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        UserToken = body.data[0].token;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');

        done();
      });
  });
});

// test for POST /login DB suite
describe('POST api/v2/auth/login', () => {
  it('should login successfully if user inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'Darryl99@hotmail.com',
        password: 'dele1989',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');

        done();
      });
  });
});
// Test suite for POST /login user email does not exists
describe('POST api/v1/auth/login', () => {
  it('Should return an error if login email inputs is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'wrongemail@epicmail.com',
        password: 'cent46',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(404);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('User does not exist');
        done();
      });
  });
});

// Test suite for POST /login Db user email does not exists
describe('POST api/v2/auth/login', () => {
  it('Should return an error if login email inputs is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'wrongemail@epicmail.com',
        password: 'cent46',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(404);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('User not Found');
        done();
      });
  });
});

// Test suite for POST /login password invalid
describe('POST api/v1/auth/login', () => {
  it('Should return an error if login password inputs is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'matti@epics.com',
        password: 'wrongpassword',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(401);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('Invalid Email/Password');
        done();
      });
  });
});

// Test suite for POST /login DB password invalid
describe('POST api/v2/auth/login', () => {
  it('Should return an error if login password inputs is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'Darryl99@hotmail.com',
        password: 'wrongpassword',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(401);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('Invalid Email/Password');
        done();
      });
  });
});
// Test suite for POST /login route invalid
describe('POST api/v1/auth/login', () => {
  it('Should return an error if login inputs are invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
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

// Test suite for POST /login Db route invalid
describe('POST api/v2/auth/login', () => {
  it('Should return an error if login inputs are invalid', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/login')
      .send({})
      .end((err, res) => {
        if (err) done(err);
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.a('object');

        done();
      });
  });
});

// ========================MESSAGE TEST=====================
// test route for POST /messages if inputs are valid
describe('POST api/v1/messages', () => {
  it('Should successfully create a message if inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .set('token', UserToken)
      .send(validMessage)
      .end((err, res) => {
        if (err) done(err);
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
      .set('token', UserToken)
      .send(invalidMessage)
      .end((err, res) => {
        if (err) done(err);
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
      .set('token', UserToken)
      .send({})
      .end((err, res) => {
        if (err) done(err);
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.a('object');

        done();
      });
  });
});

//  Test suite for POST /messages invalid token
describe('POST api/v1/messages', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

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
      .set('token', UserToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(200);
        expect(body.data).to.be.an('array');

        done();
      });
  });
});

//  Test suite for GET /messages invalid token
describe('GET api/v1/messages', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages')
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

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
      .set('token', UserToken)
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

//  Test suite for GET /messages/unread invalid token
describe('GET api/v1/messages/unread', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/unread')
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

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
      .set('token', UserToken)
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

//  Test suite for GET /messages/sent invalid token
describe('GET api/v1/messages/sent', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/sent')
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

        done();
      });
  });
});

// Test suite for GET /messages/messageId
describe('GET api/v1/messages/messageId', () => {
  it('Should return a specific message', (done) => {
    chai
      .request(app)
      .get(`/api/v1/messages/${id}`)
      .set('token', UserToken)
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

//  Test suite for GET /messages/messageId invalid token
describe('GET api/v1/messages/messageId', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .get(`/api/v1/messages/${id}`)
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

        done();
      });
  });
});

// Test suite for DELETE /messages/messageId
describe('DELETE api/v1/messages/messageId', () => {
  it('Should delete a specific message', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/messages/${id}`)
      .set('token', UserToken)
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

// test route for DELETE /messages/messageId invalid token
describe('DELETE api/v1/messages/messageId', () => {
  it('Should throw an error is token is invalid', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/messages/${id}`)
      .set('token', 'sfjjjjjjkkkkkkkkkkkkknnnnjn')
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body.errors).to.be.an('array');
        expect(body.errors[0]).to.be.a('object');
        expect(body.errors.length).to.be.equal(1);
        expect(body.errors[0]).to.haveOwnProperty('name');
        expect(body.errors[0]).to.haveOwnProperty('message');
        expect(body.errors[0].name).to.be.a('string');
        expect(body.errors[0].message).to.be.a('string');

        done();
      });
  });
});

// ========================GROUPS TEST=====================
// test route for POST /groups
describe('POST api/v2/groups', () => {
  it('Should successfully create a group', (done) => {
    chai
      .request(app)
      .post('/api/v2/groups')
      .set('token', DbToken)
      .send({
        groupname: 'ALWAYS TEST',
      })
      .end((err, res) => {
        if (err) done(err);
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('string');
        expect(body.data).to.be.an('array');
        expect(body.data[0]).to.be.an('object');
        done();
      });
  });
});

// Test suite for GET /groups/
describe('GET api/v2/groups', () => {
  it('Should return all group records', (done) => {
    chai
      .request(app)
      .get('/api/v2/groups/')
      .set('token', DbToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('string');
        expect(body.status).to.be.equal('success');
        expect(body.data).to.be.a('array');
        done();
      });
  });
});
