const { Post } = require('../db/db')

const validateDeletePost = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { id } = req.user
      const { postId } = req.params

      const post = await Post.findByPk(postId);

      const userIsCreator = post.createdById === id

      if (!userIsCreator) {
        throw new Error('Not creator of post')
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' }
      },
      required: ['postId']
    },
  }
};

const validateGetPost = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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

const validatePostReport = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        postId: { type: 'number' },
      },
      required: ['postId']
    }
  }
}

module.exports = {
  validateDeletePost,
  validateGetPost,
  validateGetPostCheers,
  validatePostCheers,
  validatePostGuess,
  validatePostPost,
  validatePostReport
};
