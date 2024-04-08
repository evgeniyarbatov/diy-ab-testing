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
 * @param {string} username UserID accessing the site
 * @param {string} feature Feature we are testing
 * @return {string} Test or control group
 */
function getExperimentGroup(
    username,
    feature,
) {
  const group = Math.random() < 0.5 ? 'test' : 'control';
  return group;
}

/**
 * Cache result of the feature check in the cookies
 * @param {string} feature Feature we are checking
 * @param {string} group Feature group
 * @param {Object} res Response object
 * @return {void}
 */
function cacheFeatureGroup(
    feature,
    group,
    res,
) {
  res.cookie(feature, group, {maxAge: 900000, httpOnly: true});
}

/**
 * Check which group does the user belong to
 * @param {Object} cookies Cookies sent with the request
 * @param {string} feature Feature we are checking
 * @return {string} Test or control group
 */
function getUserGroup(
    cookies,
    feature,
) {
  return feature in cookies ?
    cookies[feature] :
    getExperimentGroup(cookies.username, feature);
}

module.exports = {
  getUserGroup,
  cacheFeatureGroup,
  getIsFeature,
};
