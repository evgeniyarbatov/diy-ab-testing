const {getLogger} = require('./logger');

const logger = getLogger('logs/experiment.log');

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
  logger.info({
    username: username,
    feature: feature,
    group: group,
  });
  return group;
}

module.exports = {
  getExperimentGroup,
};
