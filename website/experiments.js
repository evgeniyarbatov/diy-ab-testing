const Features = require('./config/features.js');

/**
 * Check if a cookie is a feature
 * @param {string} name Name of the cookie
 * @return {boolean}
 */
function getIsFeature(
    name,
) {
  const features = Object.keys(Features);
  return features.includes(name);
}

/**
 * Allocate the user to either test or control group
 * @param {string} feature Feature we are testing
 * @param {Object} res Response object
 * @return {string} Test or control group
 */
function getExperimentGroup(
    feature,
    res,
) {
  const group = Math.random() < 0.5 ? 'test' : 'control';
  res.cookie(feature, group, {maxAge: 900000, httpOnly: true});
  return group;
}


/**
 * Check if user part of test group
 * @param {Object} cookies Cookies sent with the request
 * @param {string} feature Feature we are checking
 * @param {Object} res Response object
 * @return {bool}
 */
function getIsUserInTestGroup(
    cookies,
    feature,
    res,
) {
  const group = feature in cookies ?
    cookies[feature] :
    getExperimentGroup(feature, res);
  return group === 'test';
}

module.exports = {
  getIsFeature,
  getIsUserInTestGroup,
};
