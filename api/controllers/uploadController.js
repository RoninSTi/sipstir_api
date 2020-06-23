const { getSignedUrl, getSignedImageUrl } = require('../adaptors/amazonAdaptor');

const postSignedUrl = async (req, res) => {
  const { fileName, fileType  } = req.body;

  try {
    fileData = await getSignedUrl({ fileName, fileType });

    res.send(fileData);
  } catch (error) {
    res.send(error);
  }
};

const postSignedImageUrl = async (req, res) => {
  const { fileName, fileType } = req.body;

  try {
    fileData = await getSignedImageUrl({ fileName, fileType });

    res.send(fileData);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  postSignedUrl,
  postSignedImageUrl
};
