export function getPaginationOptions(params) {
    const { page = 1, pageSize = 10 } = params;
    return {
        limit: pageSize,
        offset: (page - 1) * pageSize
    };
}
