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
  username: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: CreationOptional<Date>;
  updated_at: CreationOptional<Date>;
  deleted_at?: Date | null;
}

interface UserCreationAttributes extends InferCreationAttributes<User> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare role: 'user' | 'admin';
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at?: Date | null;
  
  static declare hashPassword: (password: string) => Promise<string>;
  static declare comparePassword: (password: string, hash: string) => Promise<boolean>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Static methods for password hashing and comparison
User.hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

User.comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Export the instance type and the model
export type UserInstance = User;
export default User;
