class ApiResponse {
 constructor(statusCode, dataMessage = "sucess fuly meassge") {
  this.statusCode = statusCode
  this.data = this.data
  this.dataMessage = dataMessage
  this.success = statusCode < 400
 }
}

export { ApiResponse }