import _ from 'lodash';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const projectId = req.query.projectId;
  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');


  const processLogs = (logs) => {
    const payload = { milestones: {} };
    if (!logs) return res.boom.badRequest(ERROR_BAD_REQUEST);
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
    res.json(payload);
  };

  return models.log['milestone-log'].getByUserProject(userId, projectId, convertedRange)
      .then(processLogs)
      .then(response);
}

const milestonesAPI = { getOverview };

export default milestonesAPI;
