const validateGetPost = {
  schema: {
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' }
      },
      required: ['postId']
    },
    queryString: {
      userId: { type: 'number' }
    }
  }
};

const validateGetPostCheers = {
  schema: {
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' }
      },
      required: ['postId']
    }
  }
};

const validatePostCheers = {
  schema: {
    body: {
      type: 'object',
      properties: {
        createdById: { type: 'number' }
      },
      required: ['createdById']
    },
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' }
      },
      required: ['postId']
    }
  }
}

const validatePostGuess = {
  schema: {
    body: {
      type: 'object',
      properties: {
        createdById: { type: 'number' },
        placeId: { type: 'string' },
        text: { type: 'string' }
      },
      required: ['createdById']
    },
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' }
      },
      required: ['postId']
    }
  }
}

const validatePostPost = {
  schema: {
    body: {
      type: 'object',
      properties: {
        caption: { type: 'string' },
        image: { type: 'string', format: 'url' },
        locationId: { type: 'number' },
        createdById: { type: 'number' },
      },
      required: ['createdById', 'locationId']
    }
  }
}

module.exports = {
  validateGetPost,
  validateGetPostCheers,
  validatePostCheers,
  validatePostGuess,
  validatePostPost
};
