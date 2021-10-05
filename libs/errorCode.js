const errorCode = {
  InternalServerError: {
    statusCode: 500,
    errorCode: 'InternalServerError',
    msg: 'Internal Server Error'
  },
  MethodNotAllowed: {
    statusCode: 405,
    errorCode: 'MethodNotAllowed',
    msg: 'Method Not Allowed'
  },
  BadRequest: {
    statusCode: 400,
    errorCode: 'BadRequest',
    msg: 'Bad Request'
  },
  NotFound: {
    statusCode: 404,
    errorCode: 'NotFound',
    msg: 'Not Found'
  },
  IncorrectAnswer: {
    statusCode: 400,
    errorCode: 'IncorrectAnswer',
    msg: 'It is not allowed to create a ticket because the answer is incorrect'
  },
  QuotaExceeded: {
    statusCode: 400,
    errorCode: 'QuotaExceeded',
    msg: 'Daily quota exceeded'
  }
}

export default errorCode;