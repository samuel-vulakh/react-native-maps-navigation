import { MarkerType } from '../../constants/MarkerTypes';
import { PolylineType } from '../../constants/PolylineTypes';

declare global {
  /**
   * Interface for geographic coordinates with latitude and longitude
   *
   * @interface Coordinate
   * @property {number} latitude - The latitude in decimal degrees
   * @property {number} longitude - The longitude in decimal degrees
   */
  interface Coordinate {
    latitude: number;
    longitude: number;
  }

  /**
   * Interface for duration information from the Directions API
   *
   * @interface Duration
   * @property {string} text - Human-readable representation of the duration (e.g., "5 mins")
   * @property {number} value - Duration in seconds
   */
  interface Duration {
    text: string;
    value: number;
  }

  /**
   * Interface for distance information from the Directions API
   *
   * @interface Distance
   * @property {string} text - Human-readable representation of the distance (e.g., "2 km")
   * @property {number} value - Distance in meters
   */
  interface Distance {
    text: string;
    value: number;
  }

  /**
   * Interface for compass direction information
   *
   * @interface Compass
   * @property {string} detail - Detailed compass direction (e.g., "northeast")
   * @property {string} simple - Simplified compass direction (e.g., "north")
   */
  interface Compass {
    detail: string;
    simple: string;
  }

  /**
   * Interface for maneuver information in a navigation step
   *
   * @interface Maneuver
   * @property {string} name - Readable name of the maneuver (e.g., "turnRight")
   * @property {string} type - Type code of the maneuver (e.g., "turn-right")
   */
  interface Maneuver {
    name: string;
    type: string;
  }

  /**
   * Interface for polyline information representing a path
   *
   * @interface Polyline
   * @property {Coordinate[]} coordinates - Array of coordinates defining the path
   * @property {string} type - Type of the polyline (e.g., "route")
   * @property {string} [points] - Encoded polyline string in Google's format
   */
  interface Polyline {
    coordinates: Coordinate[];
    type: PolylineType;
    points?: string; // Add points property for raw polyline data
  }

  /**
   * Interface for a navigation step in a route
   *
   * @interface Step
   * @property {Compass} [compass] - Compass direction for this step
   * @property {Maneuver} maneuver - Maneuver to perform in this step
   * @property {number} bearing - Bearing in degrees from north
   * @property {string} [mode] - Travel mode for this step
   * @property {Coordinate} start - Starting coordinate
   * @property {Coordinate|false} end - Ending coordinate or false for final step
   * @property {Polyline} polyline - Path information for this step
   * @property {Duration} duration - Time to complete this step
   * @property {Distance} distance - Distance covered in this step
   * @property {string} instructions - Human-readable instructions
   * @property {boolean} [final] - Whether this is the final step
   * @property {string} [travel_mode] - Mode of travel (e.g., "DRIVING")
   * @property {string} [html_instructions] - HTML-formatted instructions
   * @property {any} [start_location] - Raw start location from Google API
   * @property {any} [end_location] - Raw end location from Google API
   */
  interface Step {
    compass?: Compass;
    maneuver: Maneuver;
    bearing: number;
    mode?: string;
    start: Coordinate;
    end: Coordinate | false;
    polyline: Polyline;
    duration: Duration;
    distance: Distance;
    instructions: string;
    final?: boolean;
    travel_mode?: string;
    html_instructions?: string;
    start_location?: LatLng;
    end_location?: LatLng;
  }

  /**
   * Interface for a marker on the map
   *
   * @interface Marker
   * @property {Coordinate} coordinate - Position of the marker
   * @property {string} type - Type of marker (e.g., "origin", "destination")
   */
  interface Marker {
    coordinate: Coordinate;
    type: MarkerType;
  }

  /**
   * Interface for route boundary information
   *
   * @interface Bounds
   * @property {Coordinate[]} boundingBox - Array of coordinates defining the bounding box
   * @property {Coordinate} center - Center point of the route
   * @property {Coordinate} northEast - Northeast corner of the bounding box
   * @property {Coordinate} southWest - Southwest corner of the bounding box
   */
  interface Bounds {
    boundingBox: Coordinate[];
    center: Coordinate;
    northEast: Coordinate;
    southWest: Coordinate;
  }

  /**
   * Interface for location information with address and coordinates
   *
   * @interface Location
   * @property {string} address - Formatted address
   * @property {any} latlng - Raw latitude/longitude from Google API
   * @property {Coordinate} coordinate - Formatted coordinate
   */
  interface Location {
    address: string;
    latlng: LatLng;
    coordinate: Coordinate;
  }

  /**
   * Interface for a complete route with all navigation details
   *
   * @interface Route
   * @property {string} title - Route title or summary
   * @property {Marker[]} markers - Array of markers on the route
   * @property {Step[]} steps - Array of navigation steps
   * @property {Polyline[]} polylines - Array of polylines for the route
   * @property {Bounds} bounds - Boundary information for the route
   * @property {number} initialBearing - Initial bearing from the starting point
   * @property {Duration} duration - Total duration of the route
   * @property {Distance} distance - Total distance of the route
   * @property {Location} origin - Origin location information
   * @property {Location} destination - Destination location information
   */
  interface Route {
    title: string;
    markers: Marker[];
    steps: Step[];
    polylines: Polyline[];
    bounds: Bounds;
    initialBearing: number;
    duration: Duration;
    distance: Distance;
    origin: Location;
    destination: Location;
  }

  /**
   * Interface for a leg of a route in the Google Directions API response
   *
   * @interface RouteLeg
   * @property {any} start_location - Raw start location data
   * @property {any} end_location - Raw end location data
   * @property {string} start_address - Formatted start address
   * @property {string} end_address - Formatted end address
   * @property {Step[]} steps - Array of steps in this leg
   * @property {Duration} duration - Duration of this leg
   * @property {Distance} distance - Distance of this leg
   */
  interface RouteLeg {
    start_location: LatLng;
    end_location: LatLng;
    start_address: string;
    end_address: string;
    steps: Step[];
    duration: Duration;
    distance: Distance;
  }

  /**
   * Interface for a raw route from the Google Directions API response
   *
   * @interface RawRoute
   * @property {RouteLeg[]} legs - Array of legs in this route
   * @property {object} bounds - Boundary information
   * @property {any} bounds.northeast - Northeast corner of the route
   * @property {any} bounds.southwest - Southwest corner of the route
   * @property {string} summary - Summary description of the route
   */
  interface RawRoute {
    legs: RouteLeg[];
    bounds: {
      northeast: LatLng;
      southwest: LatLng;
    };
    summary: string;
  }

  /**
   * Interface for the complete response from the Google Directions API
   *
   * @interface DirectionsResponse
   * @property {RawRoute[]} routes - Array of possible routes
   * @property {string} status - Status of the request (e.g., "OK")
   * @property {string} [error_message] - Error message if status is not "OK"
   */
  interface DirectionsResponse {
    routes: RawRoute[];
    status: string;
    error_message?: string;
  }

  /**
   * Interface for options that can be passed to the Directions constructor or fetch method
   *
   * @interface DirectionsOptions
   * @property {string} [key] - Google Maps API key
   * @property {string} [mode] - Travel mode (e.g., "driving", "walking")
   * @property {string} [language] - Language for results
   */
  interface DirectionsOptions {
    key?: string;
    mode?: string;
    language?: string;
    origin?: string | Coordinate;
    destination?: string | Coordinate;
  }
}
