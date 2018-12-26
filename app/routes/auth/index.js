import _ from "lodash";
import boom from "boom";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "config";
import constants from "../../common/constants";
import Storage from "../../common/storage-helper";

const models = new Storage();

function checkDevAccess(devKey) {
  return devKey === config.developer_key;
}

function authenticate(req, res, next) {
  const givenEmail = req.body.email;
  var payload = {};
  var settings;
  var token;

  const authenticateAdmin = user => {
    if (!_.isNil(user)) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
      (payload.email = user.email),
        (payload.exp = parseInt(expiry.getTime() / 1000, 10));
      token = jwt.sign(payload, config.jwt_secret);
      settings = user.settings;
      return { success: true, token, settings: settings };
    }
    return { success: false };
  };

  const authenticateSupervisor = user => {
    if (!user) {
      return next(boom.unauthorized(constants.templates.error.noRecordFound));
    }
    var isAuthorized = false;

    user.get({ plain: true }).user_projects.forEach(row => {
      // check all user roles to see if user is a supervisor
      if (
        row.role === constants.database.role.supervisor ||
        row.role === constants.database.role.supervisor_creator
      )
        isAuthorized = true;
    });
    if (isAuthorized) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
      const payload2 = {
        email: user.email,
        exp: parseInt(expiry.getTime() / 1000, 10)
      };
      const token = jwt.sign(payload2, config.jwt_secret);
      return res.status(200).json({ success: true, token, settings: "{}" }); // Note here, default settings are set for supervisors as per the previous admin view. This could be used to change different supervisor content.
    }
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  };

  const returnResults = admin => {
    if (admin.success) return res.status(200).json(admin);

    return models.app.user
      .getUserRolesByEmail(givenEmail)
      .then(authenticateSupervisor);
  };

  return models.log.admin
    .findByEmail(givenEmail)
    .then(authenticateAdmin)
    .then(returnResults)
    .catch(next);
}

function createAdmin(req, res, next) {
  const devKey = req.body.devKey;
  const email = req.body.email;
  const settings = req.body.settings || {};

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(email)) {
    const payload = { email, settings: JSON.stringify(settings) };
    const response = success => {
      if (!success)
        return next(boom.badRequest(constants.templates.error.badRequest));
      res.status(200).json({ success });
    };
    return models.log.admin
      .addUser(payload)
      .then(response)
      .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

function updateAdmin(req, res, next) {
  const adminUpdate = req.body.admin;
  adminUpdate.email = req.auth.email;
  const response = updates => {
    if (!updates)
      return next(boom.badRequest(constants.templates.error.badRequest));
    const user = updates[1][0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
    const payload = {
      email: user.email,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    const token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token, settings: user.settings });
  };

  return models.log.admin
    .updateUser(adminUpdate)
    .then(response)
    .catch(next);
}

/**
 * Returns the Google Client Id.
 */
function getConfigs(req, res, next) {
  if (!config.google.client_id) {
    console.error("Could not read Google Client Id from the config file");
    return next(boom.internal(constants.templates.error.clientIdNotFound));
  }

  var return_data = {};
  var flag = false;
  if (req.query.returndata.includes("googleclientid")) {
    flag = true;
    return_data.client_id = config.google.client_id;
  }
  if (req.query.returndata.includes("adminemail")) {
    flag = true;
    return_data.admin_email = config.admin.email;
  }
  if (req.query.returndata.includes("collaburl")) {
    flag = true;
    return_data.collab_url = config.collab.url;
  }

  if (flag) {
    return res.status(200).json({ success: true, data: return_data });
  }

  return next(boom.badRequest(constants.templates.error.invalidParams));
}

function createSupervisor(req, res, next) {
  // TODO: Add code to create supervisor here
}

function updateSupervisor(req, res, next) {
  // TODO: Add code to update supervisor here
}

module.exports = function(express) {
  const auth = expressJwt({
    secret: config.jwt_secret,
    userProperty: "auth"
  });

  const authRouter = express.Router();

  // Dashboard Supervisor Endpoints
  // =========================================================
  authRouter.post("/authenticate", authenticate);
  authRouter.get("/configs", getConfigs);

  // Developer Accessible Endpoints
  // =========================================================
  authRouter.post("/", createAdmin);
  authRouter.put("/", auth, updateAdmin);
  authRouter.post("/", createSupervisor);
  authRouter.put("/", auth, updateSupervisor);

  return authRouter;
};
