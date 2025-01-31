import { Wrapper } from '@googlemaps/react-wrapper'

interface TripMapProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom: number
}

const TripMap = ({ apiKey, center, zoom }: TripMapProps) => {
  const render = (status: string) => {
    switch (status) {
      case 'LOADING':
        return <div>Loading...</div>
      case 'FAILURE':
        return <div>Error loading map</div>
      default:
        return null
    }
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <Map center={center} zoom={zoom} />
    </Wrapper>
  )
}

const Map = ({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) => {
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    mapRef.current = new window.google.maps.Map(document.getElementById('map')!, {
      center,
      zoom
    })
  }, [center, zoom])

  return <div id="map" style={{ height: '400px' }} />
}

export default TripMap
