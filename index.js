// CommonJs
'use strict'
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
 const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./firebase'));

fastify.get('/', async (req, res) => {
  const foods = await fastify.firebase
    .firestore()
    .collection('foods')
    .get();

  return foods.docs.map(doc => doc.data());
});

fastify.get('/:id', async (req, res) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(req.params.id)
    .get();

  if (!food) {
    return res.code(404).send();
  }

  return food.data();
});

fastify.post('/create', async (req, res) => {
  const foodId = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc().id;
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(foodId)
    .set({
      id: foodId,
      ...req.body,
      created_at: new Date(),
    });

  return food.id;
});

fastify.put('/edit/:id', async (req, res) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(req.params.id)
    .update({
      ...req.body,
      updated_at: new Date(),
    });

  return food.id;
});

fastify.delete('/', async (req, res) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
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
