/* eslint-disable no-undef */
const HttpStatus = require('http-status-codes');
const request = require('supertest');

const app = require('../../src/app');
const Task = require('../../src/models/task');
const {
  userOneID,
  userOne,
  userTwoID,
  userTwo,
  setupDatabase,
  taskThree,
} = require('../fixtures/db');

beforeEach(async () => {
  await setupDatabase();
});

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Some task',
    })
    .expect(HttpStatus.CREATED);

  const task = await Task.findById(response.body._id);

  expect(task).not.toBeNull();
  expect(task.description).toBe('Some task');
  expect(task.completed).toBe(false);
});

test('Should fetch tasks belonging to user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(HttpStatus.OK);

  expect(response.body).toHaveLength(2);
  response.body.forEach((task) => {
    expect(task.owner.toString()).toEqual(userOneID.toString());
  });
});

test('Should not be allowed to delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(HttpStatus.NOT_FOUND);

  const tasks = await Task.find({ owner: userTwoID });

  expect(tasks).toHaveLength(1);
});
