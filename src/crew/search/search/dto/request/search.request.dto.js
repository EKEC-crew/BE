export const bodyToDefaultSearch = (query) => {
    return {
        name: query.name
    }
}
export const bodyToAdvancedSearch = (query) => {
    console.log(query)
    return {
        name: query.name,
        category: query.category != undefined ? parseInt(query.category) : undefined,
        activity: query.activity,
        style: query.style,
        region: query.region != undefined ? parseInt(query.region) : undefined,
        age: query.age != undefined ? parseInt(query.age) : undefined,
        gender: query.gender != undefined ? parseInt(query.gender) : undefined,
        page: parseInt(query.page)
    }
}