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

module.exports = {
  getExperimentGroup,
};
