import { Wrapper } from '@googlemaps/react-wrapper'
import { useRef, useEffect, useState } from 'react'
import { ReactElement } from 'react'
import { Box, CircularProgress, Alert, Paper, Typography } from '@mui/material'
import { Trip, RoutePoint } from '../../types'

type Status = 'LOADING' | 'FAILURE' | 'SUCCESS'

interface MapPoint {
  position: google.maps.LatLngLiteral
  title?: string
  type: 'start' | 'end' | 'waypoint' | 'poi'
  description?: string
}

interface TripMapProps {
  apiKey: string
  trip: Trip
  height?: string
  width?: string
  showRoute?: boolean
  interactive?: boolean
}

const TripMap = ({ 
  apiKey, 
  trip, 
  height = '400px', 
  width = '100%',
  showRoute = true,
  interactive = true 
}: TripMapProps) => {
  const render = (status: Status): ReactElement => {
    switch (status) {
      case 'LOADING':
        return (
          <Paper
            elevation={0}
            sx={{ 
              height, 
              width, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <CircularProgress size={40} />
          </Paper>
        )
      case 'FAILURE':
        return (
          <Paper
            elevation={0}
            sx={{
              height,
              width,
              border: 1,
              borderColor: 'divider',
              p: 3
            }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                height: '100%',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              <Typography>Failed to load Google Maps</Typography>
            </Alert>
          </Paper>
        )
      case 'SUCCESS':
      default:
        return <Map 
          trip={trip}
          height={height}
          width={width}
          showRoute={showRoute}
          interactive={interactive}
        />
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      <Wrapper 
        apiKey={apiKey} 
        render={render}
        libraries={['places', 'geometry']}
        children={<div style={{ height, width }} />}
      />
    </Paper>
  )
}

interface MapProps {
  trip: Trip
  height: string
  width: string
  showRoute: boolean
  interactive: boolean
}

const Map = ({ trip, height, width, showRoute, interactive }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const mapOptions: google.maps.MapOptions = {
      zoom: 12,
      center: { 
        lat: trip.location.latitude, 
        lng: trip.location.longitude 
      },
      mapTypeId: 'terrain',
      fullscreenControl: interactive,
      streetViewControl: interactive,
      mapTypeControl: interactive,
      zoomControl: interactive,
      clickableIcons: interactive,
      draggable: interactive
    }

    const newMap = new google.maps.Map(mapRef.current, mapOptions)
    setMap(newMap)

    const newDirectionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true
    })
    newDirectionsRenderer.setMap(newMap)
    setDirectionsRenderer(newDirectionsRenderer)

    const newInfoWindow = new google.maps.InfoWindow()
    setInfoWindow(newInfoWindow)

    return () => {
      markers.forEach(marker => marker.setMap(null))
      if (directionsRenderer) directionsRenderer.setMap(null)
      if (infoWindow) infoWindow.close()
    }
  }, [mapRef])

  useEffect(() => {
    if (!map || !directionsRenderer || !trip.location.route_points) return

    const waypoints = trip.location.route_points.map(point => ({
      location: new google.maps.LatLng(point.latitude, point.longitude) as google.maps.LatLng,
      stopover: true
    }))

    const directionsService = new google.maps.DirectionsService()

    if (showRoute && waypoints.length > 0) {
      directionsService.route({
        origin: { lat: trip.location.latitude, lng: trip.location.longitude },
        destination: waypoints[waypoints.length - 1].location,
        waypoints: waypoints.slice(0, -1),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)
        }
      })
    }

    const getMarkerIcon = (point: RoutePoint, index: number) => {
      if (index === 0) return '/start-marker.png'
      if (index === trip.location.route_points!.length - 1) return '/end-marker.png'
      if (point.pointOfInterest) return '/poi-marker.png'
      if (point.recommendedStop) return '/stop-marker.png'
      return '/waypoint-marker.png'
    }

    // Add markers for points of interest
    const newMarkers = trip.location.route_points.map((point: RoutePoint, index: number) => {
      const iconUrl = getMarkerIcon(point, index)
      const marker = new google.maps.Marker({
        position: { lat: point.latitude, lng: point.longitude },
        map,
        title: point.name || `Waypoint ${index + 1}`,
        animation: google.maps.Animation.DROP,
        label: {
          text: (index + 1).toString(),
          color: '#FFFFFF',
          fontSize: '14px'
        },
        icon: {
          url: point.pointOfInterest ? '/poi-marker.png' : '/waypoint-marker.png',
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      marker.addListener('click', () => {
        if (infoWindow && point.description) {
          const content = `
            <div style="padding: 8px;">
              <h3 style="
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
                color: #1976d2;
              ">${point.name || `Waypoint ${index + 1}`}</h3>
              <p style="margin: 0; color: rgba(0, 0, 0, 0.87);">
                ${point.description}</p>
            </div>
          `
          infoWindow.setContent(content)
          infoWindow.open(map, marker)
        }
      })

      return marker
    })

    setMarkers(prevMarkers => { prevMarkers.forEach(m => m.setMap(null)); return newMarkers })
  }, [map, directionsRenderer, trip, showRoute, infoWindow])

  return (
    <div 
      ref={mapRef} 
      style={{ height, width }}
      className="map-container"
    />
  )
}

export default TripMap
