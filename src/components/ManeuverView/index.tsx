/**
 * @imports
 */
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Styles from './styles';
import ManeuverArrow from './components/ManeuverArrow';
import ManeuverLabel from './components/ManeuverLabel';
import CloseButton from '../CloseButton';

/**
 * @component
 */
export default class ManeuverView extends Component<ManeuverViewProps> {
  /**
   * defaultProps
   */
  static defaultProps = {
    step: undefined,
    fontFamily: undefined,
    fontFamilyBold: undefined,
    backgroundColor: '#f7f7f4',
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
  constructor(props: ManeuverViewProps) {
    super(props ?? ManeuverView.defaultProps);
  }

  /**
   * render
   * @returns {JSX.Element | null}
   */
  render() {
    const styles = Styles({
      backgroundColor: this.props.backgroundColor ?? ManeuverView.defaultProps.backgroundColor,
    });

    const step = this.props.step;

    if (!step) return null;

    const maneuver = step.maneuver;

    return (
      <TouchableOpacity style={styles.maneuverView}>
        <View style={styles.maneuverViewArrow}>
          <ManeuverArrow
            size={this.props.arrowSize}
            color={this.props.arrowColor}
            maneuver={maneuver}
          />
        </View>
        <View style={styles.maneuverViewDirection}>
          <ManeuverLabel
            {...this.props}
            instructions={step.instructions}
            fontSize={this.props.fontSize}
            fontColor={this.props.fontColor}
          />
        </View>
        {!this.props.withCloseButton ? null : (
          <View style={styles.maneuverClose}>
            <CloseButton onPress={() => this.props.onClose && this.props.onClose()} />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

export { ManeuverArrow, ManeuverLabel };
