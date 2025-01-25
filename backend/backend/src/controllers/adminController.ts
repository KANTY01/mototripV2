import { Request, Response } from 'express';
import AdminService from '../services/adminService';
import { ApiResponse } from '../utils/apiResponse';
import { PaginationParams } from '../types/pagination';
import { roleCheck } from '../middleware/adminMiddleware';

export const AdminController = {
  /**
   * Get paginated list of users with filtering
   */
  async getUsers(req: Request, res: Response) {
    try {
      roleCheck(['admin'])(req, res, () => {});
      const { page = 1, pageSize = 20 } = req.query;
      const options = {
        page: Number(page),
        pageSize: Number(pageSize),
      };
      
      const result = await AdminService.getPaginatedUsers(options);
      ApiResponse.sendSuccess(res, result);
    } catch (error) {
      ApiResponse.sendError(res, error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  /**
   * Update user roles and permissions
   */
  async updateUserRoles(req: Request, res: Response) {
    try {
      roleCheck(['admin'])(req, res, () => {});
      const { userId } = req.params;
      const { roles } = req.body;
      
      const updatedUser = await AdminService.updateUser(
        Number(userId),
        roles
      );
      ApiResponse.sendSuccess(res, updatedUser);
    } catch (error) {
      ApiResponse.sendError(res, error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  /**
   * Moderate trips (approve/reject)
   */
  async moderateTrip(req: Request, res: Response) {
    try {
      roleCheck(['admin'])(req, res, () => {});
      const { tripId } = req.params;
      const { status, reason } = req.body;
      
      const result = await AdminService.moderateTrip(
        Number(tripId),
        status
      );
      ApiResponse.sendSuccess(res, result);
    } catch (error) {
      ApiResponse.sendError(res, error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  /**
   * Get system analytics and reports
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      roleCheck(['admin'])(req, res, () => {});
      const { period } = req.query;
      
      const analytics = await AdminService.generateSystemAnalytics(
        period?.toString() || '30d'
      );
      ApiResponse.sendSuccess(res, analytics);
    } catch (error) {
      ApiResponse.sendError(res, error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  /**
   * Manage system configurations
   */
  async updateSystemConfig(req: Request, res: Response) {
    try {
      roleCheck(['admin'])(req, res, () => {});
      const { configKey, configValue } = req.body;
      
      const result = await AdminService.updateSystemConfig(
        configKey,
        configValue
      );
      ApiResponse.sendSuccess(res, result);
    } catch (error) {
      ApiResponse.sendError(res, error instanceof Error ? error : new Error('Unknown error'));
    }
  },
};
