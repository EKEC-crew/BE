/**
 * **[Crew Search]**
 * **\<Request DTO>\>**
 * ***bodyToDefaultSearch***
 * '크루명으로 검색'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} query 
 * @returns}
 */
export const bodyToDefaultSearch = (query) => {
    return {
        name: query.name,
        page: parseInt(query.page),
        sort: parseInt(query.sort),
    }
}
/**
 * **[Crew Search]**
 * **\<Request DTO>\>**
 * ***bodyToAdvancedSearch***
 * '크루 찾아보기 (고급 검색)'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} query 
 * @returns}
 */
export const bodyToAdvancedSearch = (query) => {
    return {
        name: query.name,
        category: query.category != undefined ? parseInt(query.category) : undefined,
        activity: query.activity,
        style: query.style,
        region: query.region != undefined ? parseInt(query.region) : undefined,
        age: query.age != undefined ? parseInt(query.age) : undefined,
        gender: query.gender != undefined ? parseInt(query.gender) : undefined,
        page: parseInt(query.page),
        sort: parseInt(query.sort),
    }
}