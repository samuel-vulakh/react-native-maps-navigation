/**
 * @imports
 */
import { StyleSheet } from "react-native";

interface ManeuverLabelProps {
  fontFamilyBold?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

/**
 * @styles
 */
const styles = (props: ManeuverLabelProps) =>
  StyleSheet.create({
    /**
     * @maneuverLabel
     */
    maneuverLabel: {
      flexDirection: "row",
    },

    /**
     * @fonts
     */

    bold: {
      fontWeight: "bold",
      fontFamily: props.fontFamilyBold || props.fontFamily,
      fontSize: props.fontSize,
      flexWrap: "wrap",
      color: props.color,
    },

    regular: {
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      flexWrap: "wrap",
      color: props.color,
    },

    extra: {
      fontFamily: props.fontFamily,
      fontSize: props.fontSize * 0.8,
      flexWrap: "wrap",
      color: "#387bc1",
      marginTop: 4,
    },

    durationDistance: {
      fontFamily: props.fontFamily,
      fontSize: props.fontSize * 0.8,
      opacity: 0.8,
      flexWrap: "wrap",
    },
  });

export type ManeuverLabelStyles = ReturnType<typeof styles>;

export default styles;
