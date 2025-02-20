class ApiResponse {
 constructor(statusCode, message = "sucess fuly meassge") {
  this.statusCode = statusCode
  this.data = this.data
  this.message = message
  this.success = statusCode < 400
 }
}

export { ApiResponse }