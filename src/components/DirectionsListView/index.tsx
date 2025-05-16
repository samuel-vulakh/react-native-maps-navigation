/**
 * @imports
 */
import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Styles from './styles';
import DirectionListViewItem from './item';

/**
 * DirectionsListView props interface
 */
interface DirectionsListViewProps {
  route: Route;
  fontFamily?: string;
  fontFamilyBold?: string;
  showOriginDestinationHeader?: boolean;
  displayTravelMode?: boolean;
}

/**
 * @component
 */
export default class DirectionsListView extends Component<DirectionsListViewProps> {
  /**
   * defaultProps
   */
  static defaultProps = {
    fontFamily: undefined,
    fontFamilyBold: undefined,
    showOriginDestinationHeader: true,
    displayTravelMode: false,
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props: DirectionsListViewProps) {
    super(props);
  }

  /**
   * render
   * @returns {JSX.Element | null}
   */
  render() {
    const steps = this.props.route ? this.props.route.steps : false;

    if (!steps || steps.constructor !== Array) return null;

    const styles = Styles({
      fontFamily: this.props.fontFamily || 'System',
      fontFamilyBold: this.props.fontFamilyBold || this.props.fontFamily || 'System',
    });

    return (
      <ScrollView>
        {!this.props.showOriginDestinationHeader ? null : (
          <View style={styles.directionDetailHeader}>
            <View style={styles.directionDetailHeaderSection}>
              <Text style={styles.directionDetailHeaderAddressLabel}>FROM</Text>
              <Text style={styles.directionDetailHeaderAddressText}>
                {this.props.route.origin.address}
              </Text>
            </View>
            <View style={styles.directionDetailHeaderSection}>
              <Text style={styles.directionDetailHeaderAddressLabel}>TO</Text>
              <Text style={styles.directionDetailHeaderAddressText}>
                {this.props.route.destination.address}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.directionDetailTravel}>
          <Text style={styles.directionDetailTravelDuration}>{this.props.route.duration.text}</Text>
          <Text style={styles.directionDetailTravelDistance}>{this.props.route.distance.text}</Text>
        </View>

        <View style={styles.directionDetailSectionContainer}>
          {steps.map((step, index) => (
            <DirectionListViewItem {...this.props} key={index} {...step} />
          ))}
        </View>
      </ScrollView>
    );
  }
}
