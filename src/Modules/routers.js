module.exports = async (app) => {
  await app.register(require('../Routes/auth'), { prefix: '/auth' });
  await app.register(require('../Routes/v1'), { prefix: '/v1' });
};
