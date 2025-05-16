/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { NavigationIconsFont } from '@constants/NavigationIcons';

export interface DurationDistanceLabelStylesProps {
  fontFamily: string;
  fontSize: number;
  opacity: number;
}

/**
 * @styles
 */
const styles = (props: DurationDistanceLabelStylesProps) =>
  StyleSheet.create({
    /**
     * @durationDistanceText
     */
    durationDistanceText: {
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: props.fontSize * 0.8,
      opacity: props.opacity,
    },

    durationDistanceTravelModeIcon: {
      ...NavigationIconsFont,
      fontSize: props.fontSize * 0.8,
      marginRight: 8,
      opacity: props.opacity,
    },
  });

export type DurationDistanceLabelStyles = ReturnType<typeof styles>;

export default styles;
