/**
 * Represents a geographic coordinate with latitude and longitude
 */
interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Represents a position with coordinates, heading, and optional altitude
 */
interface Position {
  coordinate: Coordinate;
  heading: number;
  altitude?: number;
}

/**
 * Represents a navigation step with start coordinates, bearing, and distance
 */
interface Step {
  start: Coordinate;
  bearing: number;
  distance: {
    value: number;
    text: string;
  };
}

/**
 * Callback function type for trap events
 * @param trap - The trap that triggered the event
 * @param event - The event type that was triggered
 * @param state - The new state of the trap
 */
interface TrapCallbackFunction {
  (trap: Trap, event: string, state: string): void;
}

/**
 * Configuration options for traps
 */
interface TrapOptions {
  /** Distance in meters */
  distance?: number;
  /** Tolerance for inner radius as a fraction of distance */
  innerRadiusTolerance?: number;
  /** Tolerance for center radius as a fraction of distance */
  centerRadiusTolerance?: number;
  /** Tolerance for course direction in degrees */
  courseTolerance?: number;
}

/**
 * Represents a geolocation trap with properties that define its behavior
 */
interface Trap {
  /** Unique index of the trap */
  index: number;
  /** Type of trap (e.g., CIRCLE, STEP) */
  type: string;
  /** Current state of the trap */
  state: string;
  /** Geographic coordinate of the trap */
  coordinate: Coordinate;
  /** Callback function for trap events */
  callback?: TrapCallbackFunction;
  /** Radius in meters (for CIRCLE type) */
  radius?: number;
  /** Inner radius in meters (for STEP type) */
  innerRadius?: number;
  /** Center radius in meters (for STEP type) */
  centerRadius?: number;
  /** Outer radius in meters (for STEP type) */
  outerRadius?: number;
  /** Tolerance for course direction in degrees */
  courseTolerance?: number;
  /** Current navigation step */
  step?: Step;
  /** Next navigation step */
  nextStep?: Step;
  /** Additional options */
  options?: TrapOptions;
  /** Check if the trap is a center trap */
  isCenter(): boolean;
  /** Check if the trap is a leaving trap */
  isLeaving(): boolean;
}

/** Collection of traps indexed by number */
type TrapsRecord = Record<number, Trap>;

/** Function that returns a trap state event or false if no event */
type StateMapFunction = () => string | false | boolean;
