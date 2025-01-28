import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places', 'geometry'];

// Cast components to fix type issues
const GoogleMapComponent = GoogleMap as any;
const MarkerComponent = Marker as any;
const PolylineComponent = Polyline as any;

// Define prop types for the map components
interface GoogleMapComponentProps {
  mapContainerStyle: {
    width: string;
    height: string;
  };
  zoom: number;
  center: {
    lat: number;
    lng: number;
  };
  options: {
    disableDefaultUI: boolean;
    zoomControl: boolean;
  };
  children?: React.ReactNode;
}

interface MarkerComponentProps {
  position: {
    lat: number;
    lng: number;
  };
  label?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 52.2297,
  lng: 21.0122,
};

interface MapProps {
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    label?: string;
  }>;
  routePath?: Array<{
    lat: number;
    lng: number;
  }>;
  routeType?: 'highway' | 'offroad' | 'mixed';
  restStops?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    label: string;
    amenities?: string[];
  }>;
}

const getRouteOptions = (routeType: 'highway' | 'offroad' | 'mixed' = 'highway') => {
  switch (routeType) {
    case 'highway':
      return {
        strokeColor: '#0066cc',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      };
    case 'offroad':
      return {
        strokeColor: '#cc6600',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      };
    case 'mixed':
      return {
        strokeColor: '#660066',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      };
  }
};

const MapComponent = ({ markers = [], routePath = [], routeType = 'highway', restStops = [] }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-container">
      <GoogleMapComponent
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={routePath[0] || center}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeId: routeType === 'offroad' ? 'terrain' : 'roadmap',
        }}
      >
        {/* Route path */}
        {routePath.length > 0 && (
          <PolylineComponent
            path={routePath}
            options={getRouteOptions(routeType)}
          />
        )}

        {/* Rest stops */}
        {restStops.map((stop, index) => (
          <MarkerComponent
            key={`rest-stop-${index}`}
            position={stop.position}
            label={{
              text: stop.label,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            title={stop.amenities?.join(', ')}
          />
        ))}
        {markers.map((marker, index) => (
          <MarkerComponent
            key={`marker-${index}`}
            position={marker.position}
            label={marker.label}
          />
        ))}
      </GoogleMapComponent>
    </div>
  );
};

export default React.memo(MapComponent);
