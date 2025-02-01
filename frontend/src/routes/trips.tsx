import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import TripManagement from '../components/admin/TripManagement';
import TripEditDialog from '../components/admin/TripEditDialog';
import TripForm from '../components/admin/TripForm';
import { adminApi } from '../api/admin';
import ProtectedRoute from '../components/common/ProtectedRoute';

const EditTripRoute = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  
  if (!params.id) {
    navigate('/admin/trips');
    return null;
  }
  
  return (
    <TripForm
      open={true}
      mode="edit"
      onClose={() => navigate('/admin/trips')}
      onSubmit={async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof Blob) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item.toString());
            });
          } else {
            formData.append(key, value?.toString() || '');
          }
        });
        await adminApi.updateTrip(Number(params.id), formData);
        navigate('/admin/trips');
      }}
    />
  );
};

export const TripRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute roles={['admin']}>
            <TripManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="add"
        element={
          <ProtectedRoute roles={['admin']}>
            <TripForm
              open={true}
              mode="create"
              onClose={() => navigate('/admin/trips')}
              onSubmit={async (data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                  if (value instanceof Blob) {
                    formData.append(key, value);
                  } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                      formData.append(`${key}[${index}]`, item.toString());
                    });
                  } else {
                    formData.append(key, value?.toString() || '');
                  }
                });
                await adminApi.createTrip(formData); 
                navigate('/admin/trips');
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="edit/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            <EditTripRoute />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};