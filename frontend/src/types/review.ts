export interface ReviewAttributes {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  tripId: number;
  createdAt: Date;
  updatedAt: Date;
  response?: string;
}

export interface ReviewFormProps {
  onSubmit: (data: ReviewAttributes) => Promise<void>;
  initialValues?: Partial<ReviewAttributes>;
}
