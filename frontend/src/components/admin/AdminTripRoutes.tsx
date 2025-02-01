import { Routes, Route, useNavigate } from 'react-router-dom';
import TripManagement from './TripManagement';
import TripForm from './TripForm';
import { adminApi } from '../../api/admin';

interface TripData {
  id?: number;
  title: string;
  description: string;
  difficulty: string;
  distance: number;
  start_date: Date;
  end_date: Date;
  images: File[];
  is_premium: boolean;
}

const createFormData = (data: TripData): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image: File, index: number) => {
          formData.append(`images[${index}]`, image);
        });
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

const AdminTripRoutes = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/admin/trips');
  };

  return (
    <Routes>
      <Route index element={<TripManagement />} />
      <Route
        path="add"
        element={
          <TripForm
            open={true}
            mode="create"
            onClose={handleClose}
            initialData={undefined}
            onSubmit={async (data: TripData) => {
              const formData = createFormData(data);
              await adminApi.createTrip(formData);
              handleClose();
            }}
          />
        }
      />
      <Route
        path="edit/:id"
        element={
          <TripForm
            open={true}
            mode="edit"
            onClose={handleClose}
            initialData={undefined}
            onSubmit={async (data: TripData) => {
              if (data.id) {
                const formData = createFormData(data);
                await adminApi.updateTrip(data.id, formData);
                handleClose();
              }
            }}
          />
        }
      />
    </Routes>
  );
};

export default AdminTripRoutes;