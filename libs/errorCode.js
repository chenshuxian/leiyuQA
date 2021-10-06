const errorCode = {
  InternalServerError: {
    statusCode: 500,
    errorCode: 'InternalServerError',
    message: 'Internal Server Error'
  },
  MethodNotAllowed: {
    statusCode: 405,
    errorCode: 'MethodNotAllowed',
    message: 'Method Not Allowed'
  },
  BadRequest: {
    statusCode: 400,
    errorCode: 'BadRequest',
    message: 'Bad Request'
  },
  NotFound: {
    statusCode: 404,
    errorCode: 'NotFound',
    message: 'Not Found'
  },
  IncorrectAnswer: {
    statusCode: 400,
    errorCode: 'IncorrectAnswer',
    message: 'It is not allowed to create a ticket because the answer is incorrect'
  },
  QuotaExceeded: {
    statusCode: 400,
    errorCode: 'QuotaExceeded',
    message: 'Daily quota exceeded'
  },
  Unauthorized: {
    statusCode: 401,
    errorCode: 'Unauthorized',
    message: 'Not login'
  }
}

export default errorCode;