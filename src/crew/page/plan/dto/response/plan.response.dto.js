import { formatInTimeZone } from "date-fns-tz";

// 일정 생성 응답 DTO
export class CreateCrewPlanResponse {
    constructor(plan) {
      this.id = plan.id;
      this.crew_name = plan.crew.title;
      this.userId = plan.crewMember.user.id;
      this.writer = plan.crewMember.user.nickname;
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
      this.commentCount = plan.commentCount;
      this.likeCount = plan.likeCount;
      this.isLiked = plan.isLiked || false;
      this.isApplied = plan.isApplied || false;
      this.createdAt = plan.createdAt 
        ? formatInTimeZone(plan.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
        : null;
    }
  }

  // 일정 조회 응답 DTO
  export class GetCrewPlanResponse {
    constructor(plan) {
      this.id = plan.id;
      this.crew_name = plan.crew.title;
      this.userId = plan.crewMember.user.id;
      this.writer = plan.crewMember.user.nickname;
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
      this.commentCount = plan.commentCount;
      this.likeCount = plan.likeCount;
      this.isLiked = plan.isLiked || false;
      this.isApplied = plan.isApplied || false;
      // 안전한 날짜 변환
    this.createdAt = plan.createdAt 
    ? formatInTimeZone(plan.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
    : null;
    }
  }

  // 일정 리스트 응답 DTO (페이징 포함)
  export class GetCrewPlanListResponse {
    constructor(plans, pagination) {
      this.plans = plans;
      this.pagination = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
        pageSize: pagination.pageSize,
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious
      };
    }
  }

    // 일정 댓글 응답 DTO
    export class CrewPlanCommentResponse {
      constructor(comment) {
        this.id = comment.id;
        this.content = comment.content;
        this.userId = comment.crewMember.user.id;
        this.writer = comment.crewMember.user.nickname;
        this.writerImage = comment.crewMember.user.image;
        this.isPublic = comment.isPublic;
        this.createdAt = comment.createdAt 
          ? formatInTimeZone(comment.createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
          : null;
      }
    }

  // 일정 댓글 리스트 응답 DTO (페이징 포함)
  export class CrewPlanCommentListResponse {
    constructor(comments, pagination) {
      this.comments = comments;
      this.pagination = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
        pageSize: pagination.pageSize,
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious
      };
    }
  }

  // 일정 신청 응답 DTO
  export class CrewPlanRequestResponse {
    constructor(request) {
      this.message = "일정 신청이 완료되었습니다.";
      this.planId = request.crewPlanId;
      this.status = request.status;
      this.applicant = request.crewMember.user.nickname;
      this.userId = request.crewMember.user.id;
    }
  }