/**
 * @file Directions.ts
 * @description A TypeScript wrapper for the Google Maps Directions API that provides
 * methods to fetch, parse, and transform route information. This module handles routing
 * between locations, including steps, maneuvers, polylines, and other navigation details.
 *
 * @see {@link https://developers.google.com/maps/documentation/directions/overview|Google Directions API Documentation}
 */

/**
 * @imports
 */
import { toQueryParams, toLatLng, toCoordinate } from '../Tools';
import TravelModes from '../../constants/TravelModes';
import { MarkerTypes } from '../../constants/MarkerTypes';
import { PolylineTypes } from '../../constants/PolylineTypes';
import DirectionTypes, { DEFAULT_DIRECTION_TYPE } from '../../constants/DirectionTypes';
import * as GeoLib from 'geolib';

/**
 * A wrapper class for Google's Directions API that provides methods to fetch and parse
 * route information between origins and destinations.
 *
 * @class Directions
 * @example
 * // Create a new directions instance
 * const directions = new Directions('YOUR_GOOGLE_API_KEY', { language: 'en' });
 *
 * // Fetch a route from an origin to a destination
 * directions.fetch('New York, NY', 'Boston, MA')
 *   .then(routes => {
 *     console.log(routes[0].distance.text); // "215 mi"
 *     console.log(routes[0].duration.text); // "3 hours 31 mins"
 *     console.log(routes[0].steps.length);  // Number of navigation steps
 *   })
 *   .catch(error => console.error(error));
 */
export default class Directions {
  private apiKey: string;
  private options: DirectionsOptions;

  /**
   * Creates a new Directions instance to fetch and parse routing information
   *
   * @constructor
   * @param {string} apiKey - Google Maps API key
   * @param {DirectionsOptions|false} [options=false] - Additional options for the directions service
   */
  constructor(apiKey: string, options: DirectionsOptions | false = false) {
    this.apiKey = apiKey;
    this.options = options || {};
  }

  /**
   * Fetches routing information between an origin and destination
   *
   * @async
   * @param {string|Coordinate} origin - Starting point as address string or coordinates
   * @param {string|Coordinate} destination - Ending point as address string or coordinates
   * @param {DirectionsOptions|false} [options=false] - Additional options for this specific request
   * @returns {Promise<Route[]>} Promise resolving to an array of routes
   * @throws {Error} Will reject if the API returns a non-OK status or if there's a network error
   *
   * @example
   * // Fetch directions with coordinates
   * directions.fetch(
   *   { latitude: 40.7128, longitude: -74.0060 }, // New York
   *   { latitude: 42.3601, longitude: -71.0589 }  // Boston
   * ).then(routes => console.log(routes));
   *
   * @example
   * // Fetch directions with addresses and options
   * directions.fetch(
   *   'Chicago, IL',
   *   'St. Louis, MO',
   *   {
   *     mode: TravelModes.DRIVING,
   *     alternatives: true,
   *     avoid: 'tolls'
   *   }
   * ).then(routes => console.log(routes));
   */
  fetch(
    origin: string | Coordinate,
    destination: string | Coordinate,
    options: DirectionsOptions | false = false
  ): Promise<Route[]> {
    const routeOptions: DirectionsOptions = Object.assign(
      {
        key: this.apiKey,
        mode: TravelModes.DRIVING,
      },
      this.options,
      options || {}
    );

    const queryParams: DirectionsOptions = {
      origin: toLatLng(origin),
      destination: toLatLng(destination),
      ...routeOptions,
    };

    if (queryParams.mode) queryParams.mode = queryParams.mode.toLowerCase();

    const url = `https://maps.google.com/maps/api/directions/json?${toQueryParams(queryParams)}`;

    return fetch(url)
      .then(response => response.json())
      .then((json: DirectionsResponse) => {
        if (json.status !== 'OK') {
          const errorMessage = json.error_message || 'Unknown error';
          return Promise.reject(errorMessage);
        }

        return this.parse(json);
      });
  }

  /**
   * Parses the raw Google Directions API response into a more usable format
   *
   * @param {DirectionsResponse} json - The raw response from the Directions API
   * @returns {Route[]} An array of parsed routes
   *
   * @example
   * fetch('https://maps.google.com/maps/api/directions/json?...')
   *   .then(response => response.json())
   *   .then(json => {
   *     if (json.status === 'OK') {
   *       const routes = directions.parse(json);
   *       console.log(routes);
   *     }
   *   });
   */
  parse(json: DirectionsResponse): Route[] {
    // parse each route
    if (!json.routes.length) return [];

    return json.routes
      .map(route => {
        if (!route.legs.length) return null;

        const leg = route.legs[0]; // only support primary leg - waypoint support is later

        // create markers
        const markers: Marker[] = [
          // origin
          {
            coordinate: toCoordinate(leg.start_location),
            type: MarkerTypes.ORIGIN,
          },
          // destination
          {
            coordinate: toCoordinate(leg.end_location),
            type: MarkerTypes.DESTINATION,
          },
        ];

        const steps = leg.steps.map((step, index) =>
          this.parseStep(step, leg.steps[index + 1] ? leg.steps[index + 1] : false)
        );

        steps.push({
          final: true,
          bearing: steps[steps.length - 1].bearing,
          compass: steps[steps.length - 1].compass,
          start: steps[steps.length - 1].start,
          end: false,
          maneuver: {
            name: 'flag',
            type: 'flag',
          },
          polyline: {
            coordinates: [],
            type: PolylineTypes.ROUTE,
          },
          instructions: leg.end_address,
          duration: steps[steps.length - 1].duration,
          distance: steps[steps.length - 1].distance,
        });

        const polylines = steps.map(step => step.polyline);

        const boundingBox: Coordinate[] = [
          toCoordinate(route.bounds.northeast),
          toCoordinate(route.bounds.southwest),
        ];

        return {
          title: route.summary,
          markers,
          steps,
          polylines,
          bounds: {
            boundingBox,
            center: GeoLib.getCenter(boundingBox),
            northEast: toCoordinate(route.bounds.northeast),
            southWest: toCoordinate(route.bounds.southwest),
          },
          initialBearing: steps.length ? steps[0].bearing : 0,
          duration: leg.duration,
          distance: leg.distance,
          origin: {
            address: leg.start_address,
            latlng: leg.start_location,
            coordinate: toCoordinate(leg.start_location),
          },
          destination: {
            address: leg.end_address,
            latlng: leg.end_location,
            coordinate: toCoordinate(leg.end_location),
          },
        };
      })
      .filter((route): route is Route => route !== null);
  }

  /**
   * Parses a single step from the Directions API response
   *
   * @param {Step} step - The step to parse
   * @param {Step|false} nextStep - The next step in the route, or false if this is the last step
   * @returns {Step} The parsed step with additional navigation information
   */
  parseStep(step: Step, nextStep: Step | false): Step {
    const bearing = GeoLib.getGreatCircleBearing(
      toCoordinate(step.start_location),
      toCoordinate(nextStep ? nextStep.start_location : step.end_location)
    );

    const compass = this.decodeCompass(bearing);

    return {
      compass: compass === false ? undefined : compass,
      maneuver: this.decodeManeuver(step),
      bearing: bearing,
      mode: step.travel_mode,
      start: toCoordinate(step.start_location),
      end: toCoordinate(step.end_location),
      polyline: {
        coordinates: this.decodePolylineToCoordinates(step.polyline.points || '', 5),
        type: PolylineTypes.ROUTE,
      },
      duration: step.duration,
      distance: step.distance,
      instructions: step.html_instructions || '',
    };
  }

  /**
   * Decodes the maneuver type and name from a step
   *
   * @param {Step} step - The step containing maneuver information
   * @returns {Maneuver} The decoded maneuver with name and type
   *
   * @example
   * // For a step with maneuver.type = "turn-right"
   * const maneuver = directions.decodeManeuver(step);
   * console.log(maneuver.name); // "turnRight"
   * console.log(maneuver.type); // "turn-right"
   */
  decodeManeuver(step: Step): Maneuver {
    const maneuver = step.maneuver?.type || DEFAULT_DIRECTION_TYPE;

    const name = maneuver
      .split('-')
      .map((d, i) => (i == 0 ? d : d[0].toUpperCase() + d.slice(1)))
      .join('');

    return {
      name,
      type: maneuver,
    };
  }

  /**
   * Decodes a bearing into compass directions
   *
   * @param {number} bearing - The bearing in degrees from north (0-360)
   * @returns {Compass|false} The compass directions or false if bearing is negative
   *
   * @example
   * const compass = directions.decodeCompass(45);
   * console.log(compass.detail);  // "northeast"
   * console.log(compass.simple);  // "north"
   */
  decodeCompass(bearing: number): Compass | false {
    if (bearing < 0) return false;

    const compass = [
      DirectionTypes.NORTH,
      DirectionTypes.NORTHEAST,
      DirectionTypes.EAST,
      DirectionTypes.SOUTHEAST,
      DirectionTypes.SOUTH,
      DirectionTypes.SOUTHWEST,
      DirectionTypes.WEST,
      DirectionTypes.NORTHWEST,
    ];

    const compassSimple = [
      DirectionTypes.NORTH,
      DirectionTypes.EAST,
      DirectionTypes.SOUTH,
      DirectionTypes.WEST,
    ];

    const calc = (a: string[]) => {
      const c = Math.ceil(bearing / (360 / a.length)) - 1;
      return a[c < 0 ? 0 : c > a.length - 1 ? a.length - 1 : c];
    };

    return {
      detail: calc(compass),
      simple: calc(compassSimple),
    };
  }

  /**
   * Decodes an encoded polyline string into an array of coordinates
   *
   * @param {string} t - The encoded polyline string
   * @param {number} [e=5] - The precision of the encoding
   * @returns {Coordinate[]} Array of decoded coordinates
   *
   * @example
   * // Decode a polyline string
   * const coordinates = directions.decodePolylineToCoordinates("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
   * console.log(coordinates[0]); // { latitude: 38.5, longitude: -120.2 }
   */
  decodePolylineToCoordinates(t: string, e: number = 5): Coordinate[] {
    let n: number,
      o: number,
      u = 0,
      l = 0,
      r = 0;
    const d: number[][] = [];
    let h = 0,
      i = 0,
      a: number | null = null;
    const c = Math.pow(10, e || 5);

    while (u < t.length) {
      a = null;
      h = 0;
      i = 0;
      do {
        a = t.charCodeAt(u++) - 63;
        i |= (31 & a) << h;
        h += 5;
      } while (a >= 32);

      n = 1 & i ? ~(i >> 1) : i >> 1;
      h = 0;
      i = 0;

      do {
        a = t.charCodeAt(u++) - 63;
        i |= (31 & a) << h;
        h += 5;
      } while (a >= 32);

      o = 1 & i ? ~(i >> 1) : i >> 1;
      l += n;
      r += o;
      d.push([l / c, r / c]);
    }

    return d.map(function (t) {
      return {
        latitude: t[0],
        longitude: t[1],
      };
    });
  }
}
