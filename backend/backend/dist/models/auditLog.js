import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
class AuditLog extends Model {
    id;
    userId;
    action;
    details;
    ipAddress;
    createdAt;
}
AuditLog.init({
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
}, {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false,
    hooks: {
        beforeCreate: (auditLog) => {
            if (typeof auditLog.userId !== 'string') {
                auditLog.userId = String(auditLog.userId);
            }
        }
    }
});
export default AuditLog;
