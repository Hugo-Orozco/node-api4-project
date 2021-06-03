const users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`
    REQUEST METHOD: ${req.method}
    REQUEST URL: ${req.originalUrl}
    TIMESTAMP: ${new Date().toLocaleString()}
  `);
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  users.getById(id)
    .then(data => {
      if (!data) {
        next({ status: 404, message: 'not found' });
      }
      else {
        req.user = data;
        next();
      }
    })
    .catch(err => {
      next(err);
    });
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { body } = req;
  if (!body.name) {
    next({ status: 400, message: 'missing required name' });
  }
  else {
    req.body = body;
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  const { body } = req;
  Object.assign(body, { user_id: id });
  if (!body.text || !body.user_id) {
    next({ status: 400, message: 'missing required text' });
  }
  else {
    req.body = body;
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};
