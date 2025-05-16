/**
 * @imports
 */
import { StyleSheet } from "react-native";

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
      fontFamily: "Navigation",
      fontSize: props.size,
      color: props.color,
      opacity: props.opacity,
      textAlign: "center",
    },
  });
