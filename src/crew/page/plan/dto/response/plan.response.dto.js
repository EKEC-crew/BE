// 일정 생성 응답 DTO
export class CreateCrewPlanResponse {
    constructor(plan) {
      this.id = plan.id;
      this.crew_name = plan.crew.title;
      this.writer = plan.crewPlanRequest.crewMember.user.nickname;
      this.title = plan.title;
      this.content = plan.content;
      this.day = plan.day;
      this.type = plan.type;
      this.isRequired = plan.isRequired;
      this.allowComments = plan.allowComments;
      this.allowPrivateComments = plan.allowPrivateComments;
      this.allowExternalShare = plan.allowExternalShare;
      this.hasFee = plan.hasFee;
      this.fee = plan.fee;
      this.feePurpose = plan.feePurpose;
      this.createdAt = plan.createdAt;
    }
  }

  // 일정 조회 응답 DTO
  export class GetCrewPlanResponse {
    constructor(plan) {
      this.id = plan.id;
      this.crew_name = plan.crew.title;
      this.writer = plan.crewPlanRequest.crewMember.user.nickname;
      this.title = plan.title;
      this.content = plan.content;
      this.day = plan.day;
      this.type = plan.type;
      this.isRequired = plan.isRequired;
      this.allowComments = plan.allowComments;
      this.allowPrivateComments = plan.allowPrivateComments;
      this.allowExternalShare = plan.allowExternalShare;
      this.hasFee = plan.hasFee;
      this.fee = plan.fee;
      this.feePurpose = plan.feePurpose;
      this.createdAt = plan.createdAt;
      this.updatedAt = plan.updatedAt;
    }
  }

    // 일정 댓글 응답 DTO
    export class CrewPlanCommentResponse {
      constructor(comment) {
        this.id = comment.id;
        this.content = comment.content;
        this.writer = comment.crewMember.user.nickname;
        this.writerImage = comment.crewMember.user.image;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
      }
    }