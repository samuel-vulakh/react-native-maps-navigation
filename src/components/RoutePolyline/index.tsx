/**
 * @imports
 * @author samuel-vulakh
 */
import React, { Component, ReactElement } from 'react';
import { Polyline } from 'react-native-maps';
import connectTheme from '../../themes';
import { PolylineTypes } from '../../constants/PolylineTypes';

// Import ThemeSettings from theme module
import type { ThemeSettings } from '../../themes';

/**
 * Define the polyline theme structure
 */
interface ThemePolyline {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderWidth: number;
}

/**
 * Coordinate interface
 */
interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * @interface
 */
interface RoutePolylineProps {
  type: PolylineTypes;
  coordinates: Coordinate[];
  theme?: ThemeSettings;
}

/**
 * @class
 */
export default class RoutePolyline extends Component<RoutePolylineProps> {
  /**
   * The theme for the polyline
   */
  theme: ThemePolyline;

  /**
   * constructor
   * @param props
   */
  constructor(props: RoutePolylineProps) {
    super(props);

    this.theme = connectTheme(props.theme).Polylines[this.props.type];
  }

  /**
   * @render
   * @returns {ReactElement[] | null}
   */
  render(): ReactElement[] | null {
    if (!this.props.coordinates) return null;

    if (!this.theme) {
      throw new Error(`RoutePolyline does not support type ${this.props.type}.`);
    }

    const components: ReactElement[] = [
      <Polyline
        key={0}
        strokeWidth={this.theme.strokeWidth}
        strokeColor={this.theme.strokeColor}
        coordinates={this.props.coordinates}
        lineCap={'round'}
      />
    ];

    if (this.theme.fillColor) {
      const borderWidth = this.theme.strokeWidth - (this.theme.borderWidth || 3);

      components.push(
        <Polyline
          key={1}
          strokeWidth={borderWidth}
          strokeColor={this.theme.fillColor}
          coordinates={this.props.coordinates}
          lineCap={'round'}
        />
      );
    }

    return components;
  }
}
