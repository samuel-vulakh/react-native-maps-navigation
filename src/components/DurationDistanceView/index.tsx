/**
 * @imports
 */
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from './styles';
import CloseButton from '@components/CloseButton';
import DurationDistanceLabel from './components/DurationDistanceLabel';

/**
 * @component
 */
export default class DurationDistanceView extends Component<DurationDistanceViewProps> {
  /**
   * defaultProps
   */
  static defaultProps = {
    step: undefined,
    fontFamily: undefined,
    fontFamilyBold: undefined,
    fontSize: 20,
    arrowSize: 50,
    arrowColor: '#545455',
    withCloseButton: false,
    onClose: undefined,
    onPress: undefined,
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props: DurationDistanceViewProps) {
    super(props);
  }

  /**
   * render
   * @returns {XML}
   */
  render() {
    const styles = Styles(this.props);

    const step = this.props.step;

    if (!step) return null;

    return (
      <TouchableOpacity style={styles.durationDistanceView}>
        <View style={styles.durationDistanceContent}>
          <Text>{step.distance ? step.distance.text : ''}</Text>

          <Text>{step.duration ? step.duration.text : ''}</Text>
        </View>
        {!this.props.withCloseButton ? null : (
          <View style={styles.durationDistanceClose}>
            <CloseButton onPress={() => this.props.onClose && this.props.onClose()} />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

export { DurationDistanceView, DurationDistanceLabel };
