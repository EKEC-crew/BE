//오류 응답 개선

//중복 회원
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = 409

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
/**
 * **\<Error\>**
 * ***InvalidInputValueError***
 * 올바르지 않은 값이 입력되었을때 발생하는 에러
 */
export class InvalidInputValueError extends Error {
  errorCode = "I001";
  statusCode = 400

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}