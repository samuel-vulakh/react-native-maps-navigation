/**
 * @imports
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import Styles from './styles';
import ManeuverArrow from '@components/ManeuverView/components/ManeuverArrow';
import ManeuverLabel from '@components/ManeuverView/components/ManeuverLabel';
import DurationDistanceLabel from '@components/DurationDistanceView/components/DurationDistanceLabel';

/**
 * Distance/Duration interface
 */
interface DistanceDuration {
  text: string;
  value?: number;
}

/**
 * Maneuver interface
 */
interface Maneuver {
  type?: string;
  modifier?: string;
}

/**
 * DirectionListViewItem props interface
 */
interface DirectionListViewItemProps {
  instructions: string;
  distance: DistanceDuration;
  duration: DistanceDuration;
  maneuver?: Maneuver;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  displayTravelMode?: boolean;
}

/**
 * @component
 */
export default class DirectionListViewItem extends Component<DirectionListViewItemProps> {
  /**
   * defaultProps
   */
  static defaultProps = {
    instructions: '',
    fontFamily: undefined,
    fontFamilyBold: undefined,
    distance: undefined,
    duration: undefined,
    maneuver: undefined,
    fontSize: undefined,
    displayTravelMode: false,
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props: DirectionListViewItemProps) {
    super(props);
  }

  /**
   * render
   * @returns {JSX.Element}
   */
  render() {
    const styles = Styles({
      fontFamily: this.props.fontFamily || 'System',
      fontFamilyBold: this.props.fontFamilyBold || this.props.fontFamily || 'System',
    });

    return (
      <View style={styles.directionDetailSection}>
        <View style={styles.directionDetailIconContainer}>
          <ManeuverArrow {...this.props} size={24} />
        </View>
        <View style={styles.directionDetailContent}>
          <ManeuverLabel {...this.props} />
          <DurationDistanceLabel
            {...this.props}
            withTravelModeIcon={this.props.displayTravelMode}
            distance={
              this.props.distance
                ? {
                    text: this.props.distance.text,
                    value: this.props.distance.value || 0,
                  }
                : undefined
            }
            duration={
              this.props.duration
                ? {
                    text: this.props.duration.text,
                    value: this.props.duration.value || 0,
                  }
                : undefined
            }
          />
        </View>
      </View>
    );
  }
}
