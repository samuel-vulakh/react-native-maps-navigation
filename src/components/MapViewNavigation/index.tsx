/**
 * @imports
 */
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Circle, Polyline } from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';

import NavigationModes from '@constants/NavigationModes';
import TravelModes from '@constants/TravelModes';

import RoutePolyline from '@components/RoutePolyline';
import RouteMarker, { RouteMarkerProps } from '@components/RouteMarker';
import PositionMarker from '@components/PositionMarker';

import Geocoder from '@modules/Geocoder';
import Directions from '@modules/Directions';
import Traps from '@modules/Traps';
import Simulator from '@modules/Simulator/Simulator';
import * as Tools from '@modules/Tools';

import connectTheme, { ThemeSettings } from '@themes/index';
import { MarkerTypes } from '@constants/MarkerTypes';
import log from '@modules/Logger';

/**
 * Interface for coordinate data
 */
interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Interface for component state
 */
interface MapViewNavigationState {
  route: Route | false;
  markers: RouteMarkerProps[];
  position: Position;
  navigationMode: string;
  travelMode: string;
  stepIndex: number | false;
  step?: Step | false;
}

/**
 * Interface for component props
 */
interface MapViewNavigationProps {
  /**
   * Origin point for directions
   */
  origin?: string | Coordinate | false;
  /**
   * Destination point for directions
   */
  destination?: string | Coordinate | false;
  /**
   * Google Maps API key
   */
  apiKey: string;
  /**
   * Language for directions and geocoding
   */
  language?: string;
  /**
   * Reference to the map component
   */
  map?: () => MapView;
  /**
   * Navigation mode (IDLE, ROUTE, NAVIGATION)
   */
  navigationMode?: string;
  /**
   * Travel mode (DRIVING, WALKING, BICYCLING, TRANSIT)
   */
  travelMode?: string;
  /**
   * Maximum zoom level
   */
  maxZoom?: number;
  /**
   * Minimum zoom level
   */
  minZoom?: number;
  /**
   * Duration for animations in milliseconds
   */
  animationDuration?: number;
  /**
   * Viewing angle during navigation
   */
  navigationViewingAngle?: number;
  /**
   * Zoom level during navigation
   */
  navigationZoomLevel?: number;
  /**
   * Zoom quantifier for direction view
   */
  directionZoomQuantifier?: number;
  /**
   * Callback when route changes
   */
  onRouteChange?: (route: Route) => void;
  /**
   * Callback when step changes
   */
  onStepChange?: (step: Step | false, nextStep?: Step) => void;
  /**
   * Callback when navigation starts
   */
  onNavigationStarted?: () => void;
  /**
   * Callback when navigation completes
   */
  onNavigationCompleted?: () => void;
  /**
   * Distance to trigger step change
   */
  routeStepDistance?: number;
  /**
   * Inner radius tolerance for step
   */
  routeStepInnerTolerance?: number;
  /**
   * Center radius tolerance for step
   */
  routeStepCenterTolerance?: number;
  /**
   * Course tolerance in degrees
   */
  routeStepCourseTolerance?: number;
  /**
   * Whether to show debug markers
   */
  displayDebugMarkers?: boolean;
  /**
   * Whether to simulate navigation
   */
  simulate?: boolean;
  /**
   * Additional options for directions
   */
  options?: object;
  /**
   * Theme for styling
   */
  theme?: ThemeSettings;
}

/**
 * MapViewNavigation component for handling routing and navigation on maps
 */
export default class MapViewNavigation extends Component<
  MapViewNavigationProps,
  MapViewNavigationState
> {
  /**
   * Default props for the component
   */
  static defaultProps: Partial<MapViewNavigationProps> = {
    origin: false,
    destination: false,
    language: undefined,
    map: undefined,
    navigationMode: NavigationModes.IDLE,
    travelMode: TravelModes.DRIVING,
    maxZoom: 21,
    minZoom: 5,
    animationDuration: 750,
    navigationViewingAngle: 60,
    navigationZoomLevel: 14,
    directionZoomQuantifier: 1.5,
    onRouteChange: undefined,
    onStepChange: undefined,
    onNavigationStarted: undefined,
    onNavigationCompleted: undefined,
    routeStepDistance: 15,
    routeStepInnerTolerance: 0.75,
    routeStepCenterTolerance: 0.1,
    routeStepCourseTolerance: 30, // in degrees
    displayDebugMarkers: false,
    simulate: false,
    options: {},
  };

  // Class properties
  private geoCoder: Geocoder;
  private directionsCoder: Directions;
  private traps: Traps;
  private theme: ThemeSettings;
  private aspectRatio: number;
  private watchId: number;
  private simulator?: Simulator;
  private stepIndex: number = 0;

  /**
   * @constructor
   * @param props Component props
   */
  constructor(props: MapViewNavigationProps) {
    super(props);

    this.geoCoder = new Geocoder(this.props.apiKey, {
      language: this.props.language,
    });

    this.directionsCoder = new Directions(this.props.apiKey, {
      language: this.props.language,
    });

    this.traps = new Traps();

    this.state = {
      route: false,
      markers: [],
      position: {} as Position,
      navigationMode: NavigationModes.IDLE,
      travelMode: TravelModes.DRIVING,
      stepIndex: false,
    };

    this.theme = connectTheme(this.props.theme);

    const { width, height } = Dimensions.get('window');

    this.aspectRatio = width / height;
  }

  /**
   * @componentDidMount
   */
  componentDidMount() {
    this.watchId = geolocation.watchPosition(position => {
      this.setPosition({
        coordinate: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        heading: position.coords.heading,
      });
    });
  }

  /**
   * @componentWillUnmount
   */
  componentWillUnmount() {
    geolocation.clearWatch(this.watchId);
  }

  /**
   * @componentDidUpdate
   * @param prevProps Previous props
   */
  componentDidUpdate(prevProps: MapViewNavigationProps) {
    if (this.props.origin && this.props.destination) {
      if (
        prevProps.navigationMode !== this.props.navigationMode ||
        prevProps.travelMode !== this.props.travelMode ||
        prevProps.origin !== this.props.origin ||
        prevProps.destination !== this.props.destination
      ) {
        this.updateRoute();
      }
    }
  }

  /**
   * getCoordinates
   * @param address Address to geocode
   * @returns {Promise<Array>} Coordinates
   */
  getCoordinates(address: string): Promise<MinimizedResult | MinimizedResult[]> {
    return this.geoCoder.getFromLocation(address).then(results => {
      const coordinates = this.geoCoder.minimizeResults(results);

      return coordinates.length === 1 ? coordinates[0] : coordinates;
    });
  }

  /**
   * getCoordinatesRaw
   * @param address Address to geocode
   * @returns {Promise<Array>} Raw coordinates
   */
  getCoordinatesRaw(address: string): Promise<LocationResult | LocationResult[]> {
    return this.geoCoder.getFromLocation(address);
  }

  /**
   * getZoomValue
   * @param level Zoom level
   * @returns Region delta values
   */
  getZoomValue(level: number): { latitudeDelta: number; longitudeDelta: number } {
    const value =
      0.00001 * (this.props.maxZoom! - (level < this.props.minZoom! ? this.props.minZoom! : level));

    return {
      latitudeDelta: value,
      longitudeDelta: value * this.aspectRatio,
    };
  }

  /**
   * getBoundingBoxZoomValue
   * @param b Bounding box coordinates
   * @param quantifier Zoom quantifier
   * @returns Region delta values
   */
  getBoundingBoxZoomValue(
    b: Coordinate[],
    quantifier: number = 1
  ): { latitudeDelta: number; longitudeDelta: number } | null {
    if (b.length !== 2) return null;

    const latitudeDelta =
      (b[0].latitude > b[1].latitude
        ? b[0].latitude - b[1].latitude
        : b[1].latitude - b[0].latitude) * quantifier;

    return {
      latitudeDelta,
      longitudeDelta: latitudeDelta * this.aspectRatio,
    };
  }

  /**
   * updatePosition
   * @param coordinate Coordinate to update to
   * @param duration Animation duration
   */
  updatePosition(coordinate: Coordinate, duration: number = 0.5): void {
    if (this.props.map) {
      this.props.map().animateCamera(
        {
          center: coordinate,
          zoom: this.props.navigationZoomLevel,
          heading: this.state.position.heading,
          pitch: this.props.navigationViewingAngle,
        },
        {
          duration,
        }
      );
    }
  }

  /**
   * updateBearing
   * @param bearing New bearing
   * @param duration Animation duration
   */
  updateBearing(bearing: number, duration: number = 0.5): void {
    if (this.props.map) {
      this.props.map().animateToRegion(
        {
          latitude: this.state.position.coordinate.latitude,
          longitude: this.state.position.coordinate.longitude,
          latitudeDelta: this.props.navigationZoomLevel,
          longitudeDelta: this.props.navigationZoomLevel * this.aspectRatio,
        },
        duration
      );
    }
  }

  /**
   * updateStep
   * @param stepIndex Index of the step to update to
   */
  updateStep(stepIndex: number = 0): void {
    if (!this.state.route) return;

    const step = this.state.route.steps[stepIndex < 0 ? 0 : stepIndex];
    const nextStep = this.state.route.steps[stepIndex + 1];

    if (this.props.onStepChange) {
      this.props.onStepChange(step, nextStep);
    }

    this.traps.watchStep(
      step,
      nextStep,
      {
        distance: this.props.routeStepDistance!,
        innerRadiusTolerance: this.props.routeStepInnerTolerance!,
        centerRadiusTolerance: this.props.routeStepCenterTolerance!,
        courseTolerance: this.props.routeStepCourseTolerance!,
      },
      (trap: Trap) => {
        if (!nextStep && trap.isCenter()) {
          if (this.props.onNavigationCompleted) {
            this.props.onNavigationCompleted();
          }

          return this.setState({
            navigationMode: NavigationModes.IDLE,
            stepIndex: false,
          });
        }

        if (trap.isLeaving()) {
          this.updateStep(this.stepIndex);
        }
      }
    );

    this.stepIndex = stepIndex + 1; // ensures that this is a real number
  }

  /**
   * setPosition
   * @param position Position to set
   */
  setPosition(position: Position): void {
    const { coordinate, heading } = position;

    // process traps on setPosition
    this.traps.execute(position);

    // update position on map
    if (this.state.navigationMode === NavigationModes.NAVIGATION) {
      this.updatePosition(coordinate);

      if (heading !== undefined) {
        this.updateBearing(heading);
      }
    }

    this.setState({ position });
  }

  /**
   * clearRoute
   * @void
   */
  clearRoute(): void {
    this.setState({ route: false, step: false, stepIndex: false });
  }

  /**
   * updateRoute
   * @param origin Origin point
   * @param destination Destination point
   * @param navigationMode Navigation mode
   * @param options Route options
   */
  updateRoute(
    origin: string | Coordinate | false = false,
    destination: string | Coordinate | false = false,
    navigationMode: string | false = false,
    options: object | null = null
  ): void {
    origin = origin || this.props.origin;
    destination = destination || this.props.destination;
    navigationMode = navigationMode || this.props.navigationMode;
    options = options || this.props.options;

    if (!origin || !destination) return;

    switch (navigationMode) {
      case NavigationModes.ROUTE:
        this.displayRoute(origin, destination, options);
        break;

      case NavigationModes.NAVIGATION:
        this.navigateRoute(origin, destination, options);
        break;
    }
  }

  /**
   * Prepares the route
   * @param origin Origin point
   * @param destination Destination point
   * @param options Route options
   * @param testForRoute Whether to test for existing route
   * @returns Promise resolving to route
   */
  prepareRoute(
    origin: string | Coordinate,
    destination: string | Coordinate,
    options: object | false = false,
    testForRoute: boolean = false
  ): Promise<Route> {
    if (testForRoute && this.state.route) {
      return Promise.resolve(this.state.route);
    }

    const routeOptions = Object.assign(
      {},
      { mode: this.state.travelMode },
      { mode: this.props.travelMode },
      options && typeof options === 'object' ? options : {}
    );

    return this.directionsCoder.fetch(origin, destination, routeOptions).then(routes => {
      if (routes.length) {
        const route = routes[0];

        if (!route) throw new Error('No routes found');

        if (this.props.onRouteChange) {
          this.props.onRouteChange(route);
        }

        if (this.props.onStepChange) {
          this.props.onStepChange(false);
        }

        this.setState({ route, step: false });

        return Promise.resolve(route);
      }

      return Promise.reject('No routes found');
    });
  }

  /**
   * displayRoute
   * @param origin Origin point
   * @param destination Destination point
   * @param options Route options
   * @returns Promise resolving to route
   */
  displayRoute(
    origin: string | Coordinate,
    destination: string | Coordinate,
    options: object | false = false
  ): Promise<Route> {
    return this.prepareRoute(origin, destination, options)
      .then(route => {
        if (!this.props.map) return Promise.resolve(route);

        const region = {
          ...route.bounds.center,
          ...this.getBoundingBoxZoomValue(
            route.bounds.boundingBox,
            this.props.directionZoomQuantifier
          ),
        };

        this.props.map().animateToRegion(region, this.props.animationDuration);

        if (this.state.navigationMode !== NavigationModes.ROUTE) {
          this.setState({
            navigationMode: NavigationModes.ROUTE,
          });
        }

        return Promise.resolve(route);
      })
      .catch(err => {
        log.error(err);
        return Promise.reject(err);
      });
  }

  /**
   * navigateRoute
   * @param origin Origin point
   * @param destination Destination point
   * @param options Route options
   * @returns Promise resolving to route
   */
  navigateRoute(
    origin: string | Coordinate,
    destination: string | Coordinate,
    options: object | false = false
  ): Promise<Route> {
    return this.prepareRoute(origin, destination, options, true).then(route => {
      if (!this.props.map) return Promise.resolve(route);

      const region = {
        ...route.origin.coordinate,
        ...this.getZoomValue(this.props.navigationZoomLevel!),
      };

      this.props.map().animateToRegion(region, this.props.animationDuration);
      this.props.map().animateCamera(
        {
          pitch: this.props.navigationViewingAngle!,
        },
        {
          duration: this.props.animationDuration,
        }
      );

      //this.updatePosition(route.origin.coordinate);
      this.updateBearing(route.initialBearing);

      this.setState({
        navigationMode: NavigationModes.NAVIGATION,
      });

      this.updateStep(0);

      if (this.props.onNavigationStarted) {
        this.props.onNavigationStarted();
      }

      if (this.props.simulate) {
        log.info('SIMULATING ROUTE');
        this.simulator = new Simulator(this);
        setTimeout(() => this.simulator!.start(route), (this.props.animationDuration || 0) * 1.5);
      } else {
        log.info('NOT SIMULATING');
      }

      return Promise.resolve(route);
    });
  }

  /**
   * getRouteMarkers
   * @param route Route data
   * @returns Route markers as JSX
   */
  getRouteMarkers(route: Route | false): React.ReactElement[] | null {
    if (!route || route.markers.constructor !== Array) return null;

    return route.markers.map((params, index) => {
      return <RouteMarker key={index} theme={this.props.theme} {...params} />;
    });
  }

  /**
   * getPositionMarker
   * @param position Position data
   * @param navigationMode Current navigation mode
   * @returns Position marker as JSX
   */
  getPositionMarker(position: Position, navigationMode: string): React.ReactElement | null {
    if (!position || !position.coordinate.latitude) return null;

    const type =
      navigationMode === NavigationModes.NAVIGATION ? MarkerTypes.POSITION_ARROW : undefined;

    return <PositionMarker key={'position'} theme={this.props.theme} type={type} {...position} />;
  }

  /**
   * Route Polycons
   * @param route Route data
   * @returns Route polylines as JSX
   */
  getRoutePolylines(route: Route | false): (React.ReactElement | null)[] | null {
    if (!route || route.polylines.constructor !== Array) return null;

    return route.polylines.map((params, index) => {
      return params ? <RoutePolyline key={index} theme={this.props.theme} {...params} /> : null;
    });
  }

  /**
   * getDebugShapes
   * @param route Route data
   * @returns Debug shapes as JSX
   */
  getDebugShapes(route: Route | false): React.ReactElement[] {
    const result: React.ReactElement[] = [];

    if (!route || !this.props.displayDebugMarkers) return result;

    const steps = route.steps;
    let c = 0;

    steps.forEach(step => {
      const coordinate = step.start;

      [
        { radius: this.props.routeStepDistance!, color: 'blue' },
        {
          radius: this.props.routeStepDistance! * this.props.routeStepInnerTolerance!,
          color: 'red',
        },
        {
          radius: this.props.routeStepDistance! * this.props.routeStepCenterTolerance!,
          color: 'green',
        },
      ].forEach(d => {
        result.push(
          <Circle
            key={c}
            strokeColor={d.color}
            strokeWidth={2}
            center={step.start}
            radius={d.radius}
          />
        );
        c++;
      });

      [{ radius: this.props.routeStepDistance!, color: 'blue' }].forEach(d => {
        const bearing = step.bearing;

        const coords = Tools.toArcPolygon(
          coordinate,
          bearing - this.props.routeStepCourseTolerance!,
          bearing + this.props.routeStepCourseTolerance!,
          this.props.routeStepDistance!
        );

        result.push(
          <Polyline key={c} strokeColor={d.color} strokeWidth={8} coordinates={coords} />
        );
        c++;
      });
    });

    return result;
  }

  /**
   * @render
   * @returns {*[]}
   */
  render() {
    const result = [
      this.getRouteMarkers(this.state.route),
      this.getRoutePolylines(this.state.route),
      this.getPositionMarker(this.state.position, this.state.navigationMode),
      this.getDebugShapes(this.state.route),
    ];

    return result;
  }
}
