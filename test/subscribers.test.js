const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const Subscriber = require('../models/subscriber')

const testDbUrl = 'mongodb://127.0.0.1/subscribers_test'

test.before(async () => {
  await mongoose.connect(testDbUrl)
})

test.after(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
})

test.beforeEach(async () => {
  await Subscriber.deleteMany({})
})

test('GET /subscribers returns an empty list', async () => {
  const res = await request(app).get('/subscribers')

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, [])
})

test('POST /subscribers creates a subscriber', async () => {
  const res = await request(app)
    .post('/subscribers')
    .send({
      name: 'Surojyoti',
      subscribedToChannel: 'Automation'
    })

  assert.equal(res.statusCode, 201)
  assert.equal(res.body.name, 'Surojyoti')
  assert.equal(res.body.subscribedToChannel, 'Automation')
  assert.ok(res.body._id)
})

test('GET /subscribers/:id returns one subscriber', async () => {
  const subscriber = await Subscriber.create({
    name: 'Amit',
    subscribedToChannel: 'Testing'
  })

  const res = await request(app).get(`/subscribers/${subscriber.id}`)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.name, 'Amit')
})

test('PATCH /subscribers/:id updates a subscriber', async () => {
  const subscriber = await Subscriber.create({
    name: 'Rahul',
    subscribedToChannel: 'Node'
  })

  const res = await request(app)
    .patch(`/subscribers/${subscriber.id}`)
    .send({
      name: 'Rahul Kumar'
    })

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.name, 'Rahul Kumar')
})

test('DELETE /subscribers/:id deletes a subscriber', async () => {
  const subscriber = await Subscriber.create({
    name: 'Neha',
    subscribedToChannel: 'API'
  })

  const res = await request(app).delete(`/subscribers/${subscriber.id}`)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.message, 'Deleted Subscriber')
})
