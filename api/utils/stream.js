const parseUserId = str => {
  const parts = str.split(':');

  const userId = parseInt(parts[1]);

  return userId;
}

module.exports = {
  parseUserId
};
