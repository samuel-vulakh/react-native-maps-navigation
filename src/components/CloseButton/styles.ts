/**
 * @imports
 */
import { StyleSheet } from 'react-native';

interface CloseButtonStyleProps {
  size: number;
  color: string;
  opacity: number;
}

/**
 * @styles
 */
export default (props: CloseButtonStyleProps) =>
  StyleSheet.create({
    /**
     * @maneuverView
     */
    closeButtonText: {
      color: props.color,
      fontFamily: 'Navigation',
      fontSize: props.size,
      opacity: props.opacity,
      textAlign: 'center',
    },
  });
