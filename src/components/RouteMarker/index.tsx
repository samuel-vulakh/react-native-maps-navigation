/**
 * @imports
 */
import React, { Component } from 'react';
import { Text } from 'react-native';
import { Marker } from 'react-native-maps';
import connectTheme, { ThemeMarker, ThemeSettings } from '../../themes';
import Styles from './styles';
import { MarkerType } from '../../constants/MarkerTypes';

export interface RouteMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: MarkerType;
  theme: Partial<ThemeSettings>;
}

/**
 * @class
 */
export default class RouterMarker extends Component<RouteMarkerProps> {
  /**
   * theme
   */
  theme: ThemeMarker;

  /**
   * constructor
   * @param props
   */
  constructor(props: RouteMarkerProps) {
    super(props);

    this.theme = connectTheme(props.theme).Markers[this.props.type];
  }

  /**
   * @render
   * @returns {*}
   */
  render() {
    const styles = Styles(this.theme);

    return (
      <Marker coordinate={this.props.coordinate}>
        <Text style={styles.markerText}>{this.theme.icon}</Text>
      </Marker>
    );
  }
}
