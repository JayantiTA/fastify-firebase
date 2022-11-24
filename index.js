// CommonJs
'use strict'
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
 const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./firebase'));

fastify.get('/todo', async (req, res) => {
  const todos = await fastify.firebase
  .firestore()
  .collection('todos')
  .get();

  return todos.docs.map(doc => doc.data());
});

fastify.get('/todo/:id', async (req, res) => {
  const todo = await fastify.firebase
  .firestore()
  .collection('todos')
  .doc(req.params.id)
  .get();

  if (!todo) {
    return res.code(404).send();
  }

  return todo.data();
});

fastify.post('/todo/create', async (req, res) => {
  const todoId = await fastify.firebase.firestore().collection('todos').doc().id;
  const todo = await fastify.firebase
  .firestore()
  .collection('todos')
  .doc(todoId)
  .set({
    ...req.body, id: todoId
  });

  return todo.id;
});

fastify.put('/todo/update/:id', async (req, res) => {
  const todo = await fastify.firebase
  .firestore()
  .collection('todos')
  .doc(req.params.id)
  .update(req.body);

  return todo.id;
});

fastify.delete('/todo', async (req, res) => {
  const todo = await fastify.firebase
  .firestore()
  .collection('todos')
  .doc(req.body.id)
  .delete();

  return req.body.id;
});

fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
