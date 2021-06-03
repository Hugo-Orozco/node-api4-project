const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const users = require('./users-model');
const posts = require('../posts/posts-model');

const { logger, validateUserId, validateUser, validatePost } = require('../middleware/middleware');

const router = express.Router();

router.get('/', logger, (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  users.get()
    .then(data => {
      res.json(data);
    });
});

router.get('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const { user } = req;
  res.json(user);
});

router.post('/', logger, validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const { body } = req;
  users.insert(body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', logger, validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const { body } = req;
  users.update(id, body)
    .then(async data => {
      if (!data) {
        next({ status: 404, message: 'not found' });
      }
      else {
        const updated = await users.getById(data);
        res.status(200).json(updated);
      }
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', logger, validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  const deleted = await users.getById(id);
  users.remove(id)
    .then((/* data */) => {
      // if (!data) {
      //   next({ status: 404, message: 'not found' });
      // }
      // else {
      // }
      res.status(200).json(deleted);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/posts', logger, validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  users.getUserPosts(id)
    .then(data => {
      if (data.length === 0) {
        next({ status: 404, message: 'not found' });
      }
      else {
        res.json(data);
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/:id/posts', logger, validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { body } = req;
  posts.insert(body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      next(err);
    });
});

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    custom: 'something exploded inside the router',
    message: err.message,
    stack: err.stack
  });
});

// do not forget to export the router

module.exports = router;
