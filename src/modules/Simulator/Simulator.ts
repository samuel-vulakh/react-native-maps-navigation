/**
 * @imports
 */
import * as GeoLib from 'geolib';

/**
 * Interface for the instance passed to the Simulator
 */
interface SimulatorInstance {
  updateBearing: (bearing: number, speed: number) => void;
  setPosition: (position: SimulatorPosition) => void;
}

/**
 * Interface for a geographic point with optional bearing
 */
interface SimulatorPoint {
  latitude: number;
  longitude: number;
  bearing?: number;
  final?: boolean;
}

/**
 * Interface for the position object passed to setPosition
 */
interface SimulatorPosition extends SimulatorPoint {
  heading: number;
  coordinate: Coordinate;
}

/**
 * @class
 */
export default class Simulator {
  private instance: SimulatorInstance;
  private speed: number;
  private turnSpeed: number;
  private pointIndex: number = 0;
  private points: SimulatorPoint[] = [];
  private lastBearing: number | false = false;

  /**
   * constructor
   * @param instance The simulator instance
   */
  constructor(instance: SimulatorInstance) {
    this.instance = instance;
    this.speed = 30;
    this.turnSpeed = 700;
  }

  /**
   * start
   * @param route The route to simulate
   */
  start(route: Route) {
    this.pointIndex = 0;

    const steps = route.steps;

    const points: SimulatorPoint[] = [];
    const result: SimulatorPoint[] = [];

    steps.map(step =>
      step.polyline.coordinates.map(coordinate => points.push(Object.assign({}, coordinate)))
    );

    points.forEach((point, index) => {
      const nextPoint = points[index + 1];

      if (nextPoint && !nextPoint.final === true) {
        // calculate distance between each point
        const distance = Math.round(GeoLib.getDistance(point, nextPoint));
        const bearing = GeoLib.getGreatCircleBearing(point, nextPoint);

        if (bearing !== 0) {
          if (distance > 1) {
            for (let x = 1; x < distance; x++) {
              result.push(
                Object.assign({}, { bearing }, GeoLib.computeDestinationPoint(point, x, bearing))
              );
            }
          } else {
            result.push(Object.assign({}, { bearing }, point));
          }
        }
      }
    });

    this.pointIndex = 0;
    this.points = result;
    this.lastBearing = false;

    this.drive();
  }

  drive() {
    const point = this.points[this.pointIndex];

    let speed = this.speed;

    if (point && point.bearing) {
      let allowPositionUpdate = true;

      if (this.lastBearing !== false && point.bearing !== undefined) {
        // check if it's just a small bump
        if (
          point.bearing > (this.lastBearing as number) - 10 &&
          point.bearing < (this.lastBearing as number) + 10
        ) {
          this.instance.updateBearing(point.bearing, this.turnSpeed);
        } else {
          allowPositionUpdate = false;
          speed = this.turnSpeed;
          this.instance.updateBearing(point.bearing, this.turnSpeed);
        }

        this.lastBearing = point.bearing;
      }

      if (allowPositionUpdate) {
        this.instance.setPosition({
          ...point,
          heading: point.bearing,
          coordinate: {
            latitude: point.latitude,
            longitude: point.longitude,
          },
        });

        this.pointIndex++;
      }

      setTimeout(() => this.drive(), speed);
    }
  }
}
