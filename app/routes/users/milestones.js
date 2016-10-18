import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.query.projectId;
  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');


  const processLogs = (logs) => {
    const payload = { milestones: {} };
    if (_.isNil(logs)) return next(boom.badRequest(constants.templates.error.badRequest));
    payload.logs = logs;

    // Pseudo-map data structure to avoid duplicate pulls from database
    logs.forEach((log) => {
      log = log.toJSON();
      payload.milestones[log.milestoneId] = true;
    });

    const relevantMilestones = [];
    _.forOwn(payload.milestones, (value, key) => {
      relevantMilestones.push(models.app.milestone.getMilestone(key));
    });

    // Retrieve all milestones referenced by log
    return Promise.all(relevantMilestones)
      .then((milestones) => {
        milestones.forEach((milestone) => {
          milestone = milestone.toJSON();
          payload.milestones[milestone.id] = milestone;
        });
        return payload;
      });
  };

  const response = (payload) => {
    res.status(200).json(payload);
  };

  return models.log.milestone_log.getByProject(projectId, convertedRange)
    .then(processLogs)
    .then(response)
    .catch(next);
}

const milestonesAPI = { getOverview };

export default milestonesAPI;
