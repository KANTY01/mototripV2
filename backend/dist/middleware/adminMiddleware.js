import { ApiResponse } from '../utils/apiResponse.js';
export const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user?.role || !allowedRoles.includes(user.role)) {
            return ApiResponse.sendError(res, 'Insufficient privileges', 403);
        }
        next();
    };
};
