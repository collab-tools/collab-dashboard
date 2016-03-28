'use strict';
const _ = require('lodash');
const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';

function getOverview(req, res) {
  const projectId = req.query.projectId;
  const userId = req.params.userId;
  const dateRange = req.query.range || 7;
  if (!userId || !projectId || !_.isInteger(dateRange)) res.boom.badRequest(ERROR_BAD_REQUEST);
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

function getMilestones() {

}


const milestonesAPI = { getOverview, getMilestones };

export default milestonesAPI;
