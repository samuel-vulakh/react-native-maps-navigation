/**
 * @file Geocoder.ts
 * @description A TypeScript wrapper for the Google Maps Geocoding API that provides methods to convert
 * between addresses and geographic coordinates. It includes functionality to format and parse
 * Google's geocoding responses into a more manageable structure.
 *
 * @see {@link https://developers.google.com/maps/documentation/geocoding/overview|Google Geocoding API Documentation}
 */

/**
 * @imports
 */
import { toQueryParams } from '../Tools';

/**
 * A wrapper class for Google's Geocoding API that provides methods to convert
 * between addresses and geographic coordinates
 *
 * @class Geocoder
 * @example
 * // Create a new geocoder instance
 * const geocoder = new Geocoder('YOUR_GOOGLE_API_KEY', { language: 'en' });
 *
 * // Get location information from an address
 * geocoder.getFromLocation('1600 Amphitheatre Parkway, Mountain View, CA')
 *   .then(results => {
 *     console.log(results);
 *     // Use minimizeResults to get a simplified version
 *     const minimized = geocoder.minimizeResults(results);
 *     console.log(minimized);
 *   })
 *   .catch(error => console.error(error));
 */
export default class Geocoder {
  private apiKey: string;
  private options: GeocoderOptions;

  /**
   * Mapping between Google's address component types and our simplified naming schema
   *
   * @static
   * @type {AddressComponentMappingType}
   * @example
   * {
   *   street_number: 'number',  // Maps Google's 'street_number' to our 'number'
   *   route: 'street',          // Maps Google's 'route' to our 'street'
   *   // ...and so on
   * }
   */
  static AddressComponentMapping: AddressComponentMappingType = {
    street_number: 'number',
    route: 'street',
    postal_code: 'zip',
    country: 'country',
    locality: 'city',
    administrative_area_level_1: 'state',
    administrative_area_level_2: 'county',
  };

  /**
   * Creates a new Geocoder instance
   *
   * @constructor
   * @param {string} apiKey - Google Maps API key
   * @param {GeocoderOptions|false} [options=false] - Additional options for the geocoder
   * @throws {Error} Will throw an error if apiKey is not provided
   */
  constructor(apiKey: string, options: GeocoderOptions | false = false) {
    this.apiKey = apiKey;
    this.options = options || {};
  }

  /**
   * Geocodes an address or reverse geocodes coordinates
   *
   * @async
   * @param {...any[]} params - Either a string address or an object with query parameters
   * @returns {Promise<LocationResult[]>} A promise that resolves to an array of location results
   * @throws {Error} Will reject if the API returns a non-OK status or if there's a network error
   *
   * @example
   * // With a string address
   * geocoder.getFromLocation('1600 Amphitheatre Parkway, Mountain View, CA')
   *   .then(results => console.log(results));
   *
   * // With query parameters
   * geocoder.getFromLocation({
   *   address: '1600 Amphitheatre Parkway',
   *   components: 'country:US'
   * })
   *   .then(results => console.log(results));
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getFromLocation(...params: any[]): Promise<LocationResult[]> {
    const queryParams: QueryParams =
      params.length === 1 && typeof params[0] === 'string' ? { address: params[0] } : params[0];

    if (!params) return Promise.reject('Not enough parameters');

    queryParams.key = this.apiKey;

    if (this.options.language) queryParams.language = this.options.language;

    // build url
    const url = `https://maps.google.com/maps/api/geocode/json?${toQueryParams(queryParams)}`;

    let response, data: GeocoderResponse;

    // fetch
    try {
      response = await fetch(url);
    } catch (error) {
      return Promise.reject(error);
    }

    // parse
    try {
      data = await response.json();
    } catch (error) {
      return Promise.reject(error);
    }

    // check response's data
    if (data.status !== 'OK') {
      return Promise.reject(data);
    }

    return data.results;
  }

  /**
   * Reverse geocodes coordinates to get address information
   *
   * @param {number} lat - Latitude in decimal degrees
   * @param {number} lng - Longitude in decimal degrees
   * @returns {Promise<LocationResult[]>} A promise that resolves to an array of location results
   * @throws {Error} Will reject if the API returns a non-OK status or if there's a network error
   *
   * @example
   * geocoder.getFromLatLng(37.4224764, -122.0842499)
   *   .then(results => console.log(results));
   */
  getFromLatLng(lat: number, lng: number): Promise<LocationResult[]> {
    return this.getFromLocation({ latlng: `${lat},${lng}` });
  }

  /**
   * Converts Google's geocoding results into a simplified format
   *
   * @param {LocationResult[]} results - The results from getFromLocation or getFromLatLng
   * @returns {MinimizedResult[]} An array of simplified location results
   *
   * @example
   * geocoder.getFromLocation('1600 Amphitheatre Parkway, Mountain View, CA')
   *   .then(results => {
   *     const minimized = geocoder.minimizeResults(results);
   *     console.log(minimized);
   *   });
   */
  minimizeResults(results: LocationResult[]): MinimizedResult[] {
    if (results.constructor != Array) return [];

    return results.map(result => {
      const { lat, lng } = result.geometry.location;

      return {
        components: this.minimizeAddressComponents(result.address_components),
        address: result.formatted_address,
        coordinate: {
          latitude: lat,
          longitude: lng,
        },
      };
    });
  }

  /**
   * Simplifies Google's address components into a more manageable structure
   *
   * @param {AddressComponent[]} components - The address components from a geocoding result
   * @returns {MinimizedAddressComponents} A simplified representation of the address components
   *
   * @example
   * // Result example:
   * {
   *   street: { short: "5th Ave", long: "Fifth Avenue" },
   *   city: { short: "NY", long: "New York" },
   *   state: { short: "NY", long: "New York" },
   *   country: { short: "US", long: "United States" }
   * }
   */
  minimizeAddressComponents(components: AddressComponent[]): MinimizedAddressComponents {
    const results: MinimizedAddressComponents = {};

    const ids = Object.keys(Geocoder.AddressComponentMapping);

    components.forEach(component => {
      const index = ids.indexOf(component.types[0]);

      if (index != -1) {
        results[Geocoder.AddressComponentMapping[ids[index]]] = {
          short: component.short_name,
          long: component.long_name,
        };
      }
    });

    return results;
  }
}
