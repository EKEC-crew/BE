// 성공/실패 공통 응답 DTO
export class ApplySuccessResponseDTO {
    constructor(message) {
        this.resultType = 'SUCCESS';
        this.error = null;
        this.success = {
            message,
        };
    }
}

export class ApplyErrorResponseDTO {
    constructor(message, code = 400) {
        this.resultType = 'FAIL';
        this.error = {
            message,
            code,
        };
        this.success = null;
    }
}

/**
 * 특정 크루 특정 지원서 조회 응답 생성
 * - questionType: 0(체크박스), 1(장문)
 * - checkedChoices: 기본 choiceList에 포함된 선택값만 반환
 * - etcChoices: 체크박스형 + isEtc=1 인 문항에서, 기본 choiceList에 없는 “기타 입력값”만 분리 제공
 */
export const createCrewApplicationDetailResponse = (application) => {
    const {
        id,
        region,
        age,
        gender,
        crewId,
        userId,
        categoryId,
        activityList,
        styleList,
        user,
        crewCategory,
        answers
    } = application;

    return {
        id,
        region,
        age,
        gender,
        crewId,
        userId,
        categoryId: categoryId || 0,
        activityList,
        styleList,
        user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email
            }
            : null,
        category: crewCategory
            ? {
                id: crewCategory.id,
                content: crewCategory.content
            }
            : null,

        // Step2 응답 매핑
        answers: (answers || []).map((a) => {
            const form = a.crewRecruitForm || {};

            // questionType 보정 (0: 체크박스, 1: 장문)
            const questionType = Number(form?.questionType) === 1 ? 1 : 0;

            // isEtc 보정 (1: 기타 입력 허용, 0: 비허용)
            const isEtc = Number(form?.isEtc) === 1;

            // choiceList 보정 (Json? → 배열 또는 { list: [...] } 모두 지원) + 문자열 정규화
            const rawChoices = form?.choiceList;
            let predefinedList = [];
            if (Array.isArray(rawChoices)) {
                predefinedList = rawChoices;
            } else if (rawChoices && Array.isArray(rawChoices.list)) {
                predefinedList = rawChoices.list;
            } else {
                predefinedList = [];
            }
            const norm = (v) => String(v).trim();
            predefinedList = predefinedList.map(norm);

            // checkedChoices 보정 (Json? → 배열 보장 + 문자열 정규화)
            let checked = [];
            if (Array.isArray(a.checkedChoices)) {
                checked = a.checkedChoices;
            } else if (a.checkedChoices != null) {
                if (typeof a.checkedChoices === 'string') {
                    // 문자열로 저장된 경우 JSON 파싱 시도
                    try {
                        const parsed = JSON.parse(a.checkedChoices);
                        checked = Array.isArray(parsed) ? parsed : [a.checkedChoices];
                    } catch {
                        checked = [a.checkedChoices];
                    }
                } else {
                    // 객체/숫자/불리언 등 비배열 값은 단일 원소 배열로 수용
                    checked = [a.checkedChoices];
                }
            }
            checked = checked.map(norm);

            // 장문형(1): checked/etcs는 null, answer만 유지
            if (questionType === 1) {
                return {
                    recruitFormId: a.recruitFormId,
                    questionType,
                    etcChoices: null,
                    checkedChoices: null,
                    answer: a.answer ?? null,
                };
            }

            // 체크박스형(0)
            // - etcChoices: isEtc=1일 때만 기본 선택지에 없는 값들
            // - checkedChoices: 기본 선택지에 포함된 값들만
            let etcChoices = null;
            let filteredChecked = checked;
            if (checked.length) {
                if (isEtc) {
                    etcChoices = checked.filter((c) => !predefinedList.includes(c));
                }
                filteredChecked = checked.filter((c) => predefinedList.includes(c));
            }

            return {
                recruitFormId: a.recruitFormId,
                questionType,
                // 체크박스형에서만 노출, isEtc=0이면 null
                etcChoices,
                // 기본 choiceList 값만 유지
                checkedChoices: filteredChecked,
                // 체크박스형은 answer 사용하지 않음
                answer: null,
            };
        })
    };
};

/**
 * 크루 모집 응답 폼 조회 응답 생성
 * - step1: 제한/선택값(성별/스타일/활동/지역/카테고리/나이)
 * - step2: 질문 목록 (질문유형, 선택지, 기타 허용, 필수 여부)
 */
export const createCrewApplicationFormResponse = ({ step1, step2, recruitMessage }) => {
    return {
        step1: {
            gender: step1.gender,
            styles: step1.styles,
            activities: step1.activities,
            region: step1.region,
            category: step1.category || 0, // DB에서 null이면 클라이언트에는 0으로 반환
            age: step1.age
        },
        step2: step2.map((form) => ({
            id: form.id,
            question: form.question,
            questionType: form.questionType,  // 0: 체크박스, 1: 장문
            choiceList: form.choiceList,      // 체크박스형에서만 사용, 장문형이면 null 가능
            isEtc: form.isEtc,                // 1: 기타 입력 허용
            required: form.required,
        })),
        recruitMessage,
    };
};