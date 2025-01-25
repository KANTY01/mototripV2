import { 
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic,
  NonAttribute
} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';

export interface UserAttributes extends InferAttributes<User> {
  id: CreationOptional<number>;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'moderator' | 'support';
  status: 'active' | 'disabled';
  permissions: string[];
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

interface UserCreationAttributes extends InferCreationAttributes<User> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string;
  declare role: 'user' | 'admin' | 'moderator' | 'support';
  declare status: 'active' | 'disabled';
  declare permissions: string[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  
  static declare hashPassword: (password: string) => Promise<string>;
  static declare comparePassword: (password: string, hash: string) => Promise<boolean>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator', 'support'),
    allowNull: false,
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active'
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

// Export the instance type and the model
export type UserInstance = User;
export default User;
