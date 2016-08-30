import _ from 'lodash';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getUser(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

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
