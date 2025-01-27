import { Model, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'|'createdAt'|'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare public id: number;
  declare public firstName: string;
  declare public lastName: string;
  declare public email: string;
  declare public password: string;
  declare public phoneNumber: string;
  declare public role: 'user' | 'admin' | 'moderator';
  declare public permissions: string[];
  declare public createdAt: Date;
  declare public updatedAt: Date;
}
