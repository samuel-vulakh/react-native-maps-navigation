/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { NavigationIconsFont } from '../../constants/NavigationIcons';

interface RouteMarkerProps {
  fontSize?: number;
  color?: string;
}

/**
 * @styles
 */
export default (props: RouteMarkerProps) =>
  StyleSheet.create({
    markerText: {
      ...NavigationIconsFont,
      color: props.color || '#000000',
      fontSize: props.fontSize || 30,
    },
  });
