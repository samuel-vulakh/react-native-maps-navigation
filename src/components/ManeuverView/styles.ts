/**
 * @imports
 */
import { StyleSheet } from 'react-native';

interface ManeuverViewStyleProps {
  backgroundColor: string;
}

/**
 * @styles
 */
export default (props: ManeuverViewStyleProps) =>
  StyleSheet.create({
    /**
     * @maneuverView
     */
    maneuverClose: {
      alignItems: 'flex-end',
      flex: 0,
      justifyContent: 'flex-end',
      width: 30,
    },
    maneuverView: {
      alignItems: 'center',
      backgroundColor: props.backgroundColor,
      flexDirection: 'row',
      minHeight: 120,
      padding: 15,
    },

    maneuverViewArrow: {
      alignItems: 'center',
      flex: 0,
      justifyContent: 'center',
      width: 80,
    },

    maneuverViewDirection: {
      flex: 1,
    },
  });
