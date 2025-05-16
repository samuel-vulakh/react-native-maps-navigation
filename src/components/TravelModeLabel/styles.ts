/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { NavigationIconsFont } from '../../constants/NavigationIcons';

/**
 * Props interface for styles
 */
interface StyleProps {
  size?: number;
  opacity?: number;
  fontFamily?: string;
  fontSize?: number;
}

/**
 * @styles
 */
export default (props: StyleProps) =>
  StyleSheet.create({
    /**
     * @travelModeLabelContainer
     */
    travelModeLabelContainer: {
      flexDirection: 'row',
    },

    travelModeLabelIcon: {
      ...NavigationIconsFont,
      fontSize: props.size,
      opacity: props.opacity,
    },

    travelModeLabelText: {
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      opacity: props.opacity,
    },
  });
