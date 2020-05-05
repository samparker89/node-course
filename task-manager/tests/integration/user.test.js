/* eslint-disable no-undef */
const HttpStatus = require('http-status-codes');

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user');
const { userOneID, userOne, setupDatabase } = require('../fixtures/db');

beforeEach(async () => {
  await setupDatabase();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'John',
      email: 'john@dwp.com',
      password: 'MyOtherPass123!',
    })
    .expect(HttpStatus.CREATED);

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();
  expect(user.password).not.toBe('MyOtherPass123!');
  expect(response.body).toMatchObject({
    user: {
      name: 'John',
      email: 'john@dwp.com',
    },
    token: user.tokens[0].token,
  });
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(HttpStatus.OK);

  const user = await User.findById(userOneID);

  expect(user.tokens).toHaveLength(2);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login not existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'doesnotexist@something.com',
      password: 'doesntmatter',
    })
    .expect(HttpStatus.BAD_REQUEST);
});

test('Should get profile when user authenticated', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(HttpStatus.OK);
});

test('Should not get profile when user not authenticated', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(HttpStatus.UNAUTHORIZED);
});

test('Should delete account for authenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(HttpStatus.OK);

  const user = await User.findById(userOneID);

  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(HttpStatus.UNAUTHORIZED);

  const user = await User.findById(userOneID);

  expect(user).not.toBeNull();
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/test_image.jpg')
    .expect(HttpStatus.OK);

  const user = await User.findById(userOneID);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {

});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Keith',
      email: 'new@email.com',
    })
    .expect(HttpStatus.OK);

  const user = await User.findById(userOneID);

  expect(user.name).toBe('Keith');
  expect(user.email).toBe('new@email.com');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      invalid: 'Foo',
      rubbish: 'Bar',
    })
    .expect(HttpStatus.BAD_REQUEST);

  const user = await User.findById(userOneID);

  delete userOne.password;
  delete userOne.tokens;
  expect(user).toEqual(expect.objectContaining(userOne));
});
