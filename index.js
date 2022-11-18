// CommonJs
'use strict'
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
 const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./firebase'));

fastify.get('/todos', (req, reply) => {
  const todo = fastify.firebase
  .firestore()
  .collection('todos')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
  });
});

fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
