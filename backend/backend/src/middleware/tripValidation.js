import { body, query } from 'express-validator';

const validateTripCreation = [
  body('departureLocation')
    .notEmpty().withMessage('Departure location is required')
    .isString().withMessage('Invalid departure location format'),
  body('arrivalLocation')
    .notEmpty().withMessage('Arrival location is required')
    .isString().withMessage('Invalid arrival location format'),
  body('departureTime')
    .notEmpty().withMessage('Departure time is required')
    .isISO8601().withMessage('Invalid datetime format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Departure must be in the future');
      }
      return true;
    }),
  body('arrivalTime')
    .notEmpty().withMessage('Arrival time is required')
    .isISO8601().withMessage('Invalid datetime format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.departureTime)) {
        throw new Error('Arrival must be after departure');
      }
      return true;
    }),
  body('availableSeats')
    .isInt({ min: 1, max: 8 }).withMessage('Seats must be between 1-8'),
  body('price')
    .isFloat({ min: 1 }).withMessage('Minimum price is 1')
];

const validateTripQuery = [
  query('from').optional().isString(),
  query('to').optional().isString(),
  query('departureDate').optional().isISO8601(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('seats').optional().isInt({ min: 1 })
];

const validateTripUpdate = [
  body('departureTime').optional().isISO8601(),
  body('arrivalTime').optional().isISO8601(),
  body('availableSeats').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 1 })
];

export {
  validateTripCreation,
  validateTripQuery,
  validateTripUpdate
};
