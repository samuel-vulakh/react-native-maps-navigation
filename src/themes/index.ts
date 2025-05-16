/**
 * @import
 */
import { MarkerTypes, MarkerType } from '../constants/MarkerTypes';
import { PolylineTypes, PolylineType } from '../constants/PolylineTypes';
import NavigationIcons from '../constants/NavigationIcons';

/**
 * Theme interfaces
 */
export interface ThemeMarker {
  icon: string;
  color: string;
  fontSize?: number;
  size?: number;
  backgroundColor?: string;
}

export interface ThemePolyline {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderWidth: number;
}

export interface ThemeSettings {
  Markers: {
    [key in MarkerType]: ThemeMarker;
  };
  Polylines: {
    [key in PolylineType]: ThemePolyline;
  };
}

/**
 * defaultThemeSettings
 */
export const defaultThemeSettings: ThemeSettings = {
  /**
   * @markers
   */
  Markers: {
    [MarkerTypes.ORIGIN]: {
      icon: NavigationIcons.place,
      color: '#77dd77',
      fontSize: 40,
    },

    [MarkerTypes.DESTINATION]: {
      icon: NavigationIcons.place,
      color: '#ff4500',
      fontSize: 40,
    },

    [MarkerTypes.POSITION_DOT]: {
      icon: NavigationIcons.compassDot,
      color: '#387bc1',
      fontSize: 30,
    },

    [MarkerTypes.POSITION_ARROW]: {
      icon: NavigationIcons.navigate,
      size: 100,
      fontSize: 80,
      color: '#ffffff',
      backgroundColor: '#387bc1',
    },
  },

  Polylines: {
    [PolylineTypes.ROUTE]: {
      fillColor: '#00b3fd',
      strokeColor: '#387bc1',
      strokeWidth: 18,
      borderWidth: 4,
    },
    [PolylineTypes.ROUTE_ALTERNATIVE]: {
      fillColor: '#cccccc',
      strokeColor: '#a0a0a0',
      strokeWidth: 18,
      borderWidth: 4,
    },
    [PolylineTypes.PENDING]: {
      fillColor: '#00b3fd',
      strokeColor: '#387bc1',
      strokeWidth: 18,
      borderWidth: 4,
    },
    [PolylineTypes.NEXT]: {
      fillColor: '#00b3fd',
      strokeColor: '#387bc1',
      strokeWidth: 18,
      borderWidth: 4,
    },
  },
};

/**
 * Theme Combiner
 * @param theme - Optional custom theme to merge with default theme
 * @returns Combined theme settings
 */
const connectTheme = (theme?: Partial<ThemeSettings>): ThemeSettings => {
  return Object.assign({}, defaultThemeSettings, theme || {});
};

/**
 * @exports
 */
export default connectTheme;
