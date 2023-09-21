const aws = require('aws-sdk');
const nconf = require('nconf');

const getSignedUrl = async ({ fileName, fileType }) => {
  const S3_BUCKET = process.env.AWS_BUCKET;

  const s3 = new aws.S3();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 1000,
    ContentType: fileType,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err);
      }

      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };

      resolve(returnData)
    });
  });
};

const getSignedImageUrl = async ({ fileName, fileType }) => {
  const S3_BUCKET = process.env.AWS_BUCKET;

  const s3 = new aws.S3();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 1000,
    ContentType: fileType,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err);
      }

      const returnData = {
        signedRequest: data,
        url: `https://sipstir.imgix.net/${fileName}`
      };

      resolve(returnData)
    });
  });
};

module.exports = {
  getSignedUrl,
  getSignedImageUrl
};


