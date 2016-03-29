'use strict';
const _ = require('lodash');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';

function getUser(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  const userId = req.params.userId;
  const errHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };
  return models.app.user.getUserById(userId)
      .then((user) => {
        if (!user) return errHandler();
        return res.json(user.toJSON());
      }, errHandler);
}

function getUsers(req, res) {
  return models.app.user.getUsers()
      .then((users) => {
        users = _.toJSON(users);
        res.json(users);
      }, (err) => {
        console.error(err);
        res.boom.badRequest(ERROR_BAD_REQUEST);
      });
}

const usersAPI = { getUser, getUsers };

export default usersAPI;
