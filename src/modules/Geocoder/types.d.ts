/**
 * Options that can be passed to the Geocoder constructor
 *
 * @interface GeocoderOptions
 * @property {string} [language] - The language in which to return results (e.g., 'en', 'fr')
 */
interface GeocoderOptions {
  language?: string;
}

/**
 * Type definition for the mapping between Google's address component types and our simplified naming schema
 *
 * @interface AddressComponentMappingType
 */
interface AddressComponentMappingType {
  [key: string]: string;
}

/**
 * Geographic coordinate with latitude and longitude
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
 * Address component as returned by Google's Geocoding API
 *
 * @interface AddressComponent
 * @property {string} short_name - The abbreviated textual name for the address component (e.g., 'NY')
 * @property {string} long_name - The full textual name for the address component (e.g., 'New York')
 * @property {string[]} types - An array of strings indicating the type of the address component (e.g., ['country', 'political'])
 */
interface AddressComponent {
  short_name: string;
  long_name: string;
  types: string[];
}

/**
 * A single location result from the Geocoding API
 *
 * @interface LocationResult
 * @property {Object} geometry - The geometry information
 * @property {Object} geometry.location - The location coordinates
 * @property {number} geometry.location.lat - The latitude
 * @property {number} geometry.location.lng - The longitude
 * @property {AddressComponent[]} address_components - The components that make up the address
 * @property {string} formatted_address - The human-readable address
 */
interface LocationResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: AddressComponent[];
  formatted_address: string;
}

/**
 * The response format from Google's Geocoding API
 *
 * @interface GeocoderResponse
 * @property {string} status - The status of the response (e.g., 'OK', 'ZERO_RESULTS', 'OVER_QUERY_LIMIT')
 * @property {LocationResult[]} results - An array of location results
 */
interface GeocoderResponse {
  status: string;
  results: LocationResult[];
}

/**
 * A simplified representation of an address component with short and long forms
 *
 * @interface MinimizedAddressComponent
 * @property {string} short - The short (abbreviated) form of the component
 * @property {string} long - The long (full) form of the component
 */
interface MinimizedAddressComponent {
  short: string;
  long: string;
}

/**
 * A collection of minimized address components, mapped by their type
 *
 * @interface MinimizedAddressComponents
 * @example
 * {
 *   street: { short: "5th Ave", long: "Fifth Avenue" },
 *   city: { short: "NY", long: "New York" }
 * }
 */
interface MinimizedAddressComponents {
  [key: string]: MinimizedAddressComponent;
}

/**
 * A simplified representation of a geocoding result
 *
 * @interface MinimizedResult
 * @property {MinimizedAddressComponents} components - The components of the address
 * @property {string} address - The full formatted address
 * @property {Coordinate} coordinate - The geographic coordinates
 */
interface MinimizedResult {
  components: MinimizedAddressComponents;
  address: string;
  coordinate: Coordinate;
}

/**
 * Parameters that can be passed to the Google Geocoding API
 *
 * @interface QueryParams
 * @property {string} [address] - The address to geocode
 * @property {string} [latlng] - The latitude,longitude pair to reverse geocode
 * @property {string} key - The Google Maps API key
 * @property {string} [language] - The language in which to return results
 */
interface QueryParams {
  address?: string;
  latlng?: string;
  key: string;
  language?: string;
}
