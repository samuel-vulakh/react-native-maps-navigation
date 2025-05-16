/**
 * @imports
 */
import { StyleSheet } from "react-native";

interface DurationDistanceViewProps {
  padding?: number;
  backgroundColor?: string;
  flexDirection?: "row" | "column";
  minHeight?: number;
  alignItems?: "center" | "flex-start" | "flex-end";
}

/**
 * @styles
 */
const styles = (props: DurationDistanceViewProps) =>
  StyleSheet.create({
    /**
     * @maneuverView
     */
    durationDistanceView: {
      padding: props.padding || 15,
      backgroundColor: props.backgroundColor || "#f7f7f4",
      flexDirection: props.flexDirection || "row",
      minHeight: props.minHeight || 120,
      alignItems: props.alignItems || "center",
    },

    durationDistanceContent: {
      flex: 1,
    },

    durationDistanceClose: {
      flex: 0,
      width: 30,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
  });

export type DurationDistanceViewStyles = ReturnType<typeof styles>;

export default styles;
