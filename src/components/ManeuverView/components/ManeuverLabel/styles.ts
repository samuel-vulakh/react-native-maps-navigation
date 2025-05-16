/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { Colors } from '../../../../themes/Colors';

interface ManeuverLabelProps {
  fontFamilyBold?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  color?: string;
}

/**
 * @styles
 */
const styles = (props: ManeuverLabelProps) =>
  StyleSheet.create({
    bold: {
      color: props.fontColor || props.color || Colors.text,
      flexWrap: 'wrap',
      fontFamily: props.fontFamilyBold || props.fontFamily,
      fontSize: props.fontSize,
      fontWeight: 'bold',
    },
    durationDistance: {
      color: Colors.textSecondary,
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: props.fontSize ? props.fontSize * 0.8 : undefined,
      opacity: 0.8,
    },
    extra: {
      color: Colors.primary,
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: props.fontSize ? props.fontSize * 0.8 : undefined,
      marginTop: 4,
    },
    /**
     * @maneuverLabel
     */
    maneuverLabel: {
      flexDirection: 'row',
    },

    /**
     * @fonts
     */
    regular: {
      color: props.fontColor || props.color || Colors.text,
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
    },
  });

export type ManeuverLabelStyles = ReturnType<typeof styles>;

export default styles;
