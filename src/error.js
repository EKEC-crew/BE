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


export class InvaildInputValueError extends Error {
  errorCode = "I001";
  statusCode = 400

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//찾을 수 없는 크루
export class NotFoundCrewError extends Error {
  errorCode = "N001";
  statusCode = 404

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//존재하지 않는 게시글
export class NotFoundPostError extends Error {
  errorCode = "N003";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//존재하지 않는 댓글
export class NotFoundCommentError extends Error {
  errorCode = "N004";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//크루 멤버에 속하지 않은 유저
export class NotCrewMemberError extends Error {
  errorCode = "N002";
  statusCode = 403;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//권한이 없는 유저
export class PermissionDeniedError extends Error {
  errorCode = "P001";
  statusCode = 403;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}