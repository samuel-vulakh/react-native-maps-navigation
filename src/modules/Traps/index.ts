/**
 * @module Traps
 * A module for managing geolocation-based traps that trigger callbacks when conditions are met
 */
import { toNameId } from '../Tools';
import * as GeoLib from 'geolib';
import TrapTypes from '../../constants/TrapTypes';

/**
 * Manages geolocation-based traps that trigger callbacks when specific conditions are met
 * @class Traps
 */
export default class Traps {
  /** Collection of all active traps */
  private traps: TrapsRecord;
  /** Counter for generating unique trap IDs */
  private counter: number;

  /**
   * Creates a new Traps instance
   * @param instance - Parent instance reference
   */
  constructor() {
    this.traps = {};
    this.counter = 0;
  }

  /**
   * Processes a new position update, checking all traps against it
   * @param position - Current position with coordinates and heading
   */
  execute(position: Position): void {
    const { coordinate, heading } = position;

    this.__matches(coordinate, heading);
  }

  /**
   * Adds a new trap to the collection
   * @param trap - Trap configuration
   * @param callback - Optional callback function for trap events
   * @returns The created trap
   */
  add(
    trap: Partial<Trap> & { type: string; coordinate: Coordinate },
    callback?: TrapCallbackFunction
  ): Trap {
    this.counter++;
    const counter = this.counter;

    this.traps[counter] = Object.assign({}, trap, {
      index: counter,
      state: TrapTypes.States.OUTSIDE,
      callback: callback,
    }) as Trap;

    Object.keys(TrapTypes.States).forEach(state => {
      const propName = toNameId(state, 'is');
      // Create a function that returns a boolean for the dynamic is* properties
      this.traps[counter][propName] = function (): boolean {
        return this.state === state;
      };
    });

    return this.traps[counter];
  }

  /**
   * Returns an array of all traps
   * @returns Array of all traps
   */
  getArray(): Trap[] {
    return Object.keys(this.traps).map(id => this.traps[Number(id)]);
  }

  /**
   * Creates a circular trap around a coordinate
   * @param coordinate - Center coordinate of the trap
   * @param radius - Radius in meters
   * @param options - Additional options
   * @param callback - Optional callback function for trap events
   * @returns The created trap
   */
  watchRadius(
    coordinate: Coordinate,
    radius: number,
    options: TrapOptions,
    callback?: TrapCallbackFunction
  ): Trap {
    return this.add(
      {
        type: TrapTypes.Types.CIRCLE,
        coordinate,
        radius,
        options,
      },
      callback
    );
  }

  /**
   * Creates a step trap for navigation monitoring
   * @param step - The current navigation step
   * @param nextStep - The next navigation step (optional)
   * @param options - Configuration options for the trap
   * @param callback - Optional callback function for trap events
   * @returns The created trap
   */
  watchStep(
    step: Step,
    nextStep?: Step,
    options?: TrapOptions,
    callback?: TrapCallbackFunction
  ): Trap {
    options = Object.assign(
      {},
      {
        distance: 15,
        innerRadiusTolerance: 0.75,
        centerRadiusTolerance: 0.5,
        courseTolerance: 30,
      },
      options
    );

    const distanceToNextPoint = options.distance || (step.distance as unknown as Distance).value; // in meters

    const coordinate = step.start;

    return this.add(
      {
        type: TrapTypes.Types.STEP,
        innerRadius: distanceToNextPoint * options.innerRadiusTolerance!,
        centerRadius: distanceToNextPoint * options.centerRadiusTolerance!,
        outerRadius: distanceToNextPoint,
        courseTolerance: options.courseTolerance,
        coordinate,
        step,
        nextStep,
      },
      callback
    );
  }

  /**
   * Updates the state of a trap and triggers its callback
   * @param trap - The trap to update
   * @param event - The event that triggered the state change
   * @param state - The new state to set
   */
  nextState(trap: Trap, event: string, state: string): void {
    // set new status
    this.traps[trap.index].state = state;

    // resolve with status
    if (event.constructor == String && trap.callback) {
      trap.callback(trap, event, state);
    }
  }

  /**
   * Checks all traps against the current position and processes state changes
   * @param coordinate - Current geographic coordinates
   * @param heading - Current heading in degrees
   * @returns Array of trap match results
   * @private
   */
  __matches(coordinate: Coordinate, heading: number): (boolean | undefined)[] {
    const traps = Object.keys(this.traps);

    return traps.map(index => {
      const trap = this.traps[Number(index)];

      if (trap.state != TrapTypes.States.EXPIRED) {
        switch (trap.type) {
          case TrapTypes.Types.CIRCLE:
            if (GeoLib.isPointWithinRadius(coordinate, trap.coordinate, trap.radius!)) {
              return true;
            }

            break;

          case TrapTypes.Types.STEP: {
            const insideOuter = GeoLib.isPointWithinRadius(
              coordinate,
              trap.coordinate,
              trap.outerRadius!
            );

            const insideInner = GeoLib.isPointWithinRadius(
              coordinate,
              trap.coordinate,
              trap.innerRadius!
            );

            const stateMap: Record<string, [string, StateMapFunction]> = {
              [TrapTypes.States.OUTSIDE]: [
                TrapTypes.States.ENTERED,
                () => {
                  const isWithinCourse = this.isWithinCourse(
                    trap.step!.bearing,
                    heading,
                    trap.courseTolerance!
                  );

                  return insideOuter
                    ? isWithinCourse
                      ? TrapTypes.Events.ENTERING_ON_COURSE
                      : TrapTypes.Events.ENTERING_OFF_COURSE
                    : false;
                },
              ],

              [TrapTypes.States.ENTERED]: [
                TrapTypes.States.INSIDE,
                () => {
                  return insideOuter ? TrapTypes.Events.INSIDE : false;
                },
              ],

              [TrapTypes.States.INSIDE]: [
                TrapTypes.States.CENTER,
                () => {
                  return insideInner ? TrapTypes.Events.INSIDE_CENTER : false;
                },
              ],

              [TrapTypes.States.CENTER]: [
                TrapTypes.States.LEAVING,
                () => {
                  const isWithinCourse = this.isWithinCourse(
                    trap.nextStep ? trap.nextStep.bearing : trap.step!.bearing,
                    heading,
                    trap.courseTolerance!
                  );

                  return insideOuter && !insideInner
                    ? isWithinCourse
                      ? TrapTypes.Events.LEAVING_ON_COURSE
                      : TrapTypes.Events.LEAVING_OFF_COURSE
                    : false;
                },
              ],

              [TrapTypes.States.LEAVING]: [
                TrapTypes.States.LEFT,
                () => {
                  return !insideOuter && !insideInner ? TrapTypes.Events.LEAVING : false;
                },
              ],

              [TrapTypes.States.LEFT]: [
                TrapTypes.States.EXPIRED,
                () => {
                  return true;
                },
              ],
            };

            if (stateMap[trap.state]) {
              const func = stateMap[trap.state];
              const eventResult = func[1]();

              if (eventResult) {
                // Convert boolean true to string if needed
                const eventString = typeof eventResult === 'boolean' ? 'true' : eventResult;
                this.nextState(trap, eventString, func[0]);

                return true;
              }
            }

            break;
          }
        }
      }
      return undefined;
    });
  }

  /**
   * Determines if a heading is within tolerance of a given bearing
   * @param bearing - Target bearing in degrees
   * @param heading - Current heading in degrees
   * @param tolerance - Tolerance in degrees
   * @returns True if the heading is within tolerance of the bearing
   */
  isWithinCourse(bearing: number, heading: number, tolerance = 0): boolean {
    const low = bearing - tolerance;
    const high = bearing + tolerance;

    return (
      ((low < 0 && heading > 360 - -1 * low) || heading > low) &&
      ((high > 360 && heading < high - 360) || heading < high)
    );
  }
}
