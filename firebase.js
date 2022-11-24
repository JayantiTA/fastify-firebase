// Import the functions you need from the SDKs you need
const fp = require('fastify-plugin');
const fb = require('firebase-admin');

const credentials = require('./credentials.json');

function firebase(fastify, options, next) {
  const appConfig = {
    credential: fb.credential.cert(credentials)
  };

  const firebaseApp = fb.initializeApp(appConfig);

  if (!fastify.firebase) {
    fastify.decorate('firebase', firebaseApp);
  }

  fastify.firebase = firebaseApp;
  next();
}

module.exports = fp(firebase, {
  fastify: '>=1.1.0',
  name: 'fastify-firebase',
});
