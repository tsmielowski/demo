const express = require('express');
const { createUser, deleteUser, getUser, getUsers, updateUser } = require('./../services/userService');

const router = express.Router();
const parse = data => {
  const tmp = {};

  Object.keys(data).map(key => {
    try {
      tmp[ key ] = data[ key ].trim();
    } catch(e) {
      tmp[ key ] = data[ key ];
    }
  });
  return tmp;
}
const validate = ({ login, password, firstName, lastName }) => login.length && typeof login === 'string' &&
  password.length && typeof password === 'string' &&
  firstName.length && typeof firstName === 'string' &&
  lastName.length && typeof lastName === 'string';

router.get('/api/v1/users', (req, res) => {
  getUsers().then(data => {
    res.status(200).json(data)
  }, err => {
    res.status(404).json(err);
  });
});

router.get('/api/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (id) {
    getUser(id).then(data => {
      res.status(200).json(data)
    }, err => {
      res.status(404).json(err);
    });
  } else {
    res.status(404).json({
      message: 'Wrong User id',
      success: false
    });
  }
});

router.post('/api/v1/users', (req, res) => {
  let { firstName, lastName, login, password } = req.body;
  const data = parse({ firstName, lastName, login, password });

  if (validate(data)) {
    createUser(data).then(data => {
      res.status(200).json(data);
    }, err => {
      res.status(404).json(err);
    });
  } else {
    res.status(404).json({
      message: 'Wrong input User data',
      success: false
    });
  }
});

router.put('/api/v1/users/:id', (req, res) => {
  let { firstName, lastName, login, password } = req.body;
  const data = parse({ firstName, lastName, login, password });
  const id = parseInt(req.params.id, 10);

  if (!id) {
    res.status(404).json({
      message: 'Wrong User id',
      success: false
    });
  } else if (!validate(data)) {
    res.status(404).json({
      message: 'Wrong input User data',
      success: false
    });
  } else {
    updateUser({
      ...{ id },
      ...data
    }).then(data => {
      res.status(200).json(data);
    }, err => {
      res.status(404).json(err);
    });
  }
});

router.delete('/api/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (id) {
    deleteUser(id).then(data => {
      res.status(200).json(data);
    }, err => {
      res.status(404).json(err);
    });
  } else {
    res.status(404).json({
      message: 'Wrong User id',
      success: false
    });
  }
});

module.exports = router;
