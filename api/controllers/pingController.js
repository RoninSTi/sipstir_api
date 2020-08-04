async function getPing(_, res) {
  res.send('pong')
}

module.exports = {
  getPing
}
