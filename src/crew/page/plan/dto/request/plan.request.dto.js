// 일정 생성 요청 DTO 및 일정 수정 요청 DTO
export class CreateCrewPlanRequest {
    constructor({
      crewMemberId,
      title, content, type,
      day = new Date(), // 기본값 오늘 날짜
      isRequired = false,
      allowComments = true,
      allowPrivateComments = true,
      allowExternalShare = false,
      hasFee = false,
      fee = 0,
      feePurpose = null,
    }) {
      this.crewMemberId = crewMemberId;
      this.title = title;
      this.content = content;
      this.day = day;
      this.type = type;
      this.isRequired = isRequired;
      this.allowComments = allowComments;
      this.allowPrivateComments = allowPrivateComments;
      this.allowExternalShare = allowExternalShare;
      this.hasFee = hasFee;
      this.fee = fee;
      this.feePurpose = feePurpose;
    }
  }

  // 일정 수정 요청 DTO 
export class UpdateCrewPlanRequest {
  constructor({
    title, content, type,
    day,
    isRequired,
    allowComments,
    allowPrivateComments,
    allowExternalShare,
    hasFee,
    fee,
    feePurpose,
  }) {
    this.title = title;
    this.content = content;
    this.day = day;
    this.type = type;
    this.isRequired = isRequired;
    this.allowComments = allowComments;
    this.allowPrivateComments = allowPrivateComments;
    this.allowExternalShare = allowExternalShare;
    this.hasFee = hasFee;
    this.fee = fee;
    this.feePurpose = feePurpose;
  }
}

// 일정 댓글 생성 요청 DTO
export class CreateCrewPlanCommentRequest {
  constructor({
    crewMemberId,
    content,
    isPublic = true // 기본값으로 공개 댓글
  }) {
    this.crewMemberId = crewMemberId;
    this.content = content;
    this.isPublic = isPublic;
  }
}
