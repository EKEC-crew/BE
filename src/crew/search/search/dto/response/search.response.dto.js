/**
 * **[Crew Search]**
 * **\<Response DTO>\>**
 * ***responseFromDefaultSearch***
 * '크루명으로 검색'기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} query 
 * @returns}
 */
export const responseFromDefaultSearch = (data) => {
    return {
        crews: data
    }
}
/**
 * **[Crew Search]**
 * **\<Response DTO>\>**
 * ***responseFromAdvancedSearch***
 * '크루 찾아보기 (고급 검색)'기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} query 
 * @returns}
 */
export const responseFromAdvancedSearch = (data) => {
    return {
        crews: data
    }
}