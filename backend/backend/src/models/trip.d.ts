import { Model, Optional } from 'sequelize';
import User from './user.js';
import { Booking } from './booking.js';

interface TripAttributes {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  capacity: number;
  created_by: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

type TripCreationAttributes = Optional<TripAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public start_date: Date;
  declare public end_date: Date;
  declare public price: number;
  declare public capacity: number;
  declare public created_by: number;
  declare public createdAt: Date;
  declare public updatedAt: Date;
  declare public deletedAt?: Date;

  // Associations
  declare public getOrganizer: () => Promise<User>;
  declare public getBookings: () => Promise<Booking[]>;
  declare public organizer?: User;
  declare public bookings?: Booking[];

  public static associate(models: any): void;
}
