/**
 * @imports
 */
import { StyleSheet } from 'react-native';

interface DurationDistanceViewProps {
  padding?: number;
  backgroundColor?: string;
  flexDirection?: 'row' | 'column';
  minHeight?: number;
  alignItems?: 'center' | 'flex-start' | 'flex-end';
}

/**
 * @styles
 */
const styles = (props: DurationDistanceViewProps) =>
  StyleSheet.create({
    /**
     * @maneuverView
     */
    durationDistanceClose: {
      alignItems: 'flex-end',
      flex: 0,
      justifyContent: 'flex-end',
      width: 30,
    },
    durationDistanceContent: {
      flex: 1,
    },
    durationDistanceView: {
      alignItems: props.alignItems || 'center',
      backgroundColor: props.backgroundColor || '#f7f7f4',
      flexDirection: props.flexDirection || 'row',
      minHeight: props.minHeight || 120,
      padding: props.padding || 15,
    },
  });

export type DurationDistanceViewStyles = ReturnType<typeof styles>;

export default styles;
