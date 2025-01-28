import React from 'react';
import { render } from '@testing-library/react';
import ReviewList from '../ReviewList';
import { ReviewAttributes } from '../../../types/review';

const mockReviews: ReviewAttributes[] = [
  {
    id: 1,
    rating: 4.5,
    comment: 'Great trip!',
    userId: 1,
    tripId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    rating: 3,
    comment: 'Average experience',
    userId: 2,
    tripId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    response: 'Thank you for your feedback!'
  }
];

describe('ReviewList', () => {
  it('renders reviews correctly', () => {
    const { getByText, getAllByRole } = render(<ReviewList reviews={mockReviews} />);
    
    // Check if reviews are rendered
    expect(getByText('Great trip!')).toBeInTheDocument();
    expect(getByText('Average experience')).toBeInTheDocument();
    
    // Check if ratings are displayed
    const ratings = getAllByRole('img', { name: /rating/i });
    expect(ratings.length).toBe(2);
    
    // Check if owner response is displayed
    expect(getByText('Owner Response:')).toBeInTheDocument();
    expect(getByText('Thank you for your feedback!')).toBeInTheDocument();
  });

  it('displays the correct date format', () => {
    const { getAllByText } = render(<ReviewList reviews={mockReviews} />);
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    const dates = getAllByText(date);
    expect(dates.length).toBe(2);
  });
});
