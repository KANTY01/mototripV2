import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface AuditLogAttributes {
  id?: number;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt?: Date;
}

class AuditLog extends Model<AuditLogAttributes> implements AuditLogAttributes {
  public id?: number;
  public userId!: string;
  public action!: string;
  public details!: string;
  public ipAddress!: string;
  public createdAt?: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false,
    hooks: {
      beforeCreate: (auditLog: AuditLog) => {
        if (typeof auditLog.userId !== 'string') {
          auditLog.userId = String(auditLog.userId);
        }
      }
    }
  }
);

export default AuditLog;
