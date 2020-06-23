const aws = require('aws-sdk');
const nconf = require('nconf');

const AWS_ACCESS_KEY_ID = nconf.get('keys.amazon.AWSAccessKeyId');
const AWS_SECRET_KEY = nconf.get('keys.amazon.AWSSecretKey');
const S3_BUCKET = nconf.get('keys.amazon.bucket');

aws.config.update({
  region: 'us-east-1',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY
})

const getSignedUrl = async ({ fileName, fileType }) => {
  const s3 = new aws.S3();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
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
  const s3 = new aws.S3();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
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
        url: `https://barsnap.imgix.net/${fileName}`
      };

      resolve(returnData)
    });
  });
};

module.exports = {
  getSignedUrl,
  getSignedImageUrl
};


