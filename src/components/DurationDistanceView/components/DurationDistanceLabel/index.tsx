/**
 * @imports
 */
import React, { Component } from 'react';
import { Text } from 'react-native';
import Styles from './styles';
import { MODE_MAPPING } from '@constants/TravelModes';

/**
 * @component
 */
export default class DurationDistanceLabel extends Component<DurationDistanceLabelProps> {
  /**
   * Default props for the component
   */
  static defaultProps: Partial<DurationDistanceLabelProps> = {
    style: {},
    fontFamily: '',
    fontSize: 16,
    distance: undefined,
    duration: undefined,
    opacity: 0.8,
    withTravelModeIcon: false,
  };

  /**
   * @constructor
   * @param props Component props
   */
  constructor(props: DurationDistanceLabelProps) {
    super(props);
  }

  /**
   * render
   * @returns React element
   */
  render() {
    const styles = Styles(this.props);

    const travelMode = this.props.mode ? MODE_MAPPING[this.props.mode] : undefined;

    return (
      <Text style={[styles.durationDistanceText, this.props.style]}>
        {!this.props.withTravelModeIcon || !travelMode ? null : (
          <Text style={styles.durationDistanceTravelModeIcon}>{travelMode.icon} </Text>
        )}
        {this.props.distance ? this.props.distance.text : ''}
        {this.props.duration ? ['  (', this.props.duration.text, ')'].join('') : ''}
      </Text>
    );
  }
}
