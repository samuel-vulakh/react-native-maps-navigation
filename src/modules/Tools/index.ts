/**
 * @imports
 */
import * as geolib from 'geolib';

/**
 * toQueryParams
 * @param object
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toQueryParams = (object: Record<string, any>): string => {
  return Object.keys(object)
    .filter(key => !!object[key])
    .map(key => key + '=' + encodeURIComponent(object[key]))
    .join('&');
};

/**
 * toLatLng
 * @param value
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toLatLng = (value: string | Coordinate | any): string => {
  if (typeof value === 'string') return value;

  return value && value.latitude && value.longitude
    ? `${value.latitude},${value.longitude}`
    : value;
};

/**
 * toCoordinate
 * @param latlng
 * @returns {{latitude: *, longitude: *}}
 */
export const toCoordinate = (latlng: LatLng): Coordinate => {
  const { lat, lng } = latlng;

  return { latitude: lat, longitude: lng };
};

/**
 * toArcPolygon
 * @param coordinate
 * @param initialBearing
 * @param finalBearing
 * @param radius
 * @returns {any[]}
 */
export const toArcPolygon = (
  coordinate: Coordinate,
  initialBearing: number,
  finalBearing: number,
  radius: number
): Coordinate[] => {
  const points = 32;
  const result: Coordinate[] = [];

  // find the radius in lat/lon
  //const rlat = (radius / EARTH_RADIUS_METERS) * r2d;
  //const rlng = rlat / Math.cos({coordinate.latitude * d2r);

  if (initialBearing > finalBearing) finalBearing += 360;
  let deltaBearing = finalBearing - initialBearing;
  deltaBearing = deltaBearing / points;

  for (let i = 0; i < points + 1; i++) {
    result.push(
      geolib.computeDestinationPoint(coordinate, radius, initialBearing + i * deltaBearing)
    );
  }

  return result;
};

/**
 * toNameId
 * @param str
 * @param prepend
 * @param append
 * @returns {*}
 */
export const toNameId = (
  str: string,
  prepend: string | boolean = false,
  append: string | boolean = false
): string => {
  str = str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b[a-z]/g, letter => letter.toUpperCase())
    .replace(/\s/g, '');

  return (prepend ? prepend : '') + str + (append ? append : '');
};
