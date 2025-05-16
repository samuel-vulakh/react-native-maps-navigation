/**
 * Maneuver type definition
 */
interface Maneuver {
  type?: string;
  name?: string;
  modifier?: string;
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
