/**
 * @imports
 */
import React, { Component } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import Styles from "./styles";
import ManeuverArrow from "../ManeuverArrow";
import ManeuverLabel from "../ManeuverLabel";
import CloseButton from "../CloseButton";

/**
 * Maneuver type definition
 */
interface Maneuver {
  type?: string;
  modifier?: string;
  [key: string]: any;
}

/**
 * Step type definition
 */
interface Step {
  instructions: string;
  maneuver: Maneuver;
  distance?: {
    text?: string;
    value?: number;
  };
  duration?: {
    text?: string;
    value?: number;
  };
  [key: string]: any;
}

/**
 * ManeuverView props interface
 */
interface ManeuverViewProps {
  step: Step;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  fontColor?: string;
  arrowSize?: number;
  arrowColor?: string;
  backgroundColor?: string;
  withCloseButton?: boolean;
  onClose?: () => void;
  onPress?: () => void;
}

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
    backgroundColor: "#f7f7f4",
    fontSize: 20,
    arrowSize: 50,
    arrowColor: "#545455",
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
      backgroundColor:
        this.props.backgroundColor ?? ManeuverView.defaultProps.backgroundColor,
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
            color={this.props.fontColor}
          />
        </View>
        {!this.props.withCloseButton ? null : (
          <View style={styles.maneuverClose}>
            <CloseButton
              onPress={() => this.props.onClose && this.props.onClose()}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
