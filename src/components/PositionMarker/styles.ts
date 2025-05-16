/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { NavigationIconsFont } from '../../constants/NavigationIcons';

interface PositionMarkerProps {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  size?: number;
  angle?: number;
}

/**
 * @styles
 */
const styles = (props: PositionMarkerProps) =>
  StyleSheet.create({
    positionMarkerArrow: {
      alignItems: 'center',
      backgroundColor: props.backgroundColor,
      borderRadius: props.size,
      height: props.size,
      justifyContent: 'center',
      transform: [{ rotateX: props.angle + 'deg' }],
      width: props.size,
    },

    positionMarkerText: {
      ...NavigationIconsFont,
      color: props.color,
      fontSize: props.fontSize,
    },
  });

export type PositionMarkerStyles = ReturnType<typeof styles>;

export default styles;
