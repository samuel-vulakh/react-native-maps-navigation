/**
 * @imports
 */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import connectTheme, { ThemeMarker, ThemeSettings } from '../../themes';
import Styles, { PositionMarkerStyles } from './styles';
import { MarkerTypes, MarkerType } from '../../constants/MarkerTypes';

interface PositionMarkerProps {
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  size?: number;
  fontSize?: number;
  type?: MarkerType;
  color?: string;
  angle?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  theme?: Partial<ThemeSettings>;
  positionMarkerText?: string;
}

/**
 * @class
 */
export default class PositionMarker extends Component<PositionMarkerProps> {
  /**
   * theme
   */
  theme: ThemeMarker;

  /**
   * defaultProps
   */
  static defaultProps = {
    coordinate: undefined,
    size: 40,
    fontSize: 30,
    type: MarkerTypes.POSITION_DOT,
    color: '#252525',
    angle: 60,
    borderWidth: 0,
    borderColor: undefined,
    backgroundColor: '#252525',
    positionMarkerText: 'A',
  };

  /**
   * constructor
   * @param props
   */
  constructor(props: PositionMarkerProps) {
    super(props);
  }

  /**
   * render
   * @render
   * @returns {*}
   */
  render() {
    if (!this.props.coordinate) return null;

    const type = this.props.type || MarkerTypes.POSITION_DOT;

    this.theme = connectTheme(this.props.theme).Markers[type];

    const styles = Styles(Object.assign({}, this.props, this.theme));

    return type === MarkerTypes.POSITION_ARROW ? this.renderArrow(styles) : this.renderDot(styles);
  }

  /**
   * renderArrow
   * @param styles
   * @returns {*}
   */
  renderArrow(styles: PositionMarkerStyles) {
    return (
      <Marker coordinate={this.props.coordinate!} flat={false}>
        <View style={styles.positionMarkerArrow}>
          <Text style={styles.positionMarkerText}>{this.theme.icon}</Text>
        </View>
      </Marker>
    );
  }

  /**
   * renderDot
   * @param styles
   * @returns {*}
   */
  renderDot(styles: PositionMarkerStyles) {
    return (
      <Marker coordinate={this.props.coordinate!} flat={false}>
        <Text style={styles.positionMarkerText}>{this.theme.icon}</Text>
      </Marker>
    );
  }
}
