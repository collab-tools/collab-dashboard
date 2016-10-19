import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getUser(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;

  const response = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(user);
  };

  return models.app.user.getUserById(userId)
    .then(response)
    .catch(next);
}

function getUsers(req, res, next) {
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.user.getUsers(convertedRange)
    .then(response)
    .catch(next);
}

const usersAPI = { getUser, getUsers };

export default usersAPI;
