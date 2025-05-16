/**
 * @imports
 */
import { StyleSheet } from 'react-native';

interface ManeuverArrowProps {
  size: number;
  color: string;
  opacity: number;
}

/**
 * @styles
 */
const styles = (props: ManeuverArrowProps) =>
  StyleSheet.create({
    /**
     * @maneuverView
     */
    maneuverArrow: {
      color: props.color,
      fontFamily: 'Navigation',
      fontSize: props.size,
      opacity: props.opacity,
      textAlign: 'center',
    },
  });

export type ManeuverArrowStyles = ReturnType<typeof styles>;

export default styles;
