// CommonJs
'use strict'
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
 const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./firebase'));

fastify.get('/foods', async (req, rep) => {
  let foods = await fastify.firebase
    .firestore()
    .collection('foods')
    .get();
  foods = foods.docs.map(doc => doc.data());

  return rep.send({
    foods,
    message: 'Success',
    success: true,
  });
});

fastify.get('/foods/:id', async (req, rep) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(req.params.id)
    .get();

  if (!food.exists) {
    return rep.code(404).send({
      message: 'Food not found',
      success: false,
    });
  }

  return rep.send({
    food: {
      ...food.data(),
    },
    message: 'Success',
    success: true,
  });
});

fastify.post('/foods', async (req, rep) => {
  const foodId = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc().id;
  const food = {
    id: foodId,
    ...req.body,
    created_at: new Date(),
  };

  await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(foodId)
    .set(food);

  return rep.send({
    message: 'Food added successfully',
    data: food,
    success: true,
  });
});

fastify.put('/foods', async (req, rep) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(req.body.id)
    .update({
      ...req.body.data,
      updated_at: new Date(),
    });
  
  if (!food.exists) {
    return rep.code(404).send({
      message: 'Food not found',
      success: false,
    });
  }

  return rep.send({
    message: 'Food updated successfully',
    success: true,
  });
});

fastify.delete('/foods', async (req, rep) => {
  const food = await fastify.firebase
    .firestore()
    .collection('foods')
    .doc(req.body.id)
    .delete();

  if (!food.exists) {
    return rep.code(404).send({
      message: 'Food not found',
      success: false,
    });
  }

  return rep.send({
    message: 'Food deleted successfully',
    success: true,
  });
});

fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
