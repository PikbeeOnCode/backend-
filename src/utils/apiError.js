class  apiError extends Error {
  constructor(
    statusCode,
    message="Something went wrong",
    statck = "",
    errors=[],
  ){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.statck = statck
    this.errors = errors
    this.success = false

    if(statck){
        this.stack= statck;
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { apiError }