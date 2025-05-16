import { DurationDistanceLabelStylesProps } from './styles';

declare global {
  /**
   * Interface for the DurationDistanceLabel component props
   */
  interface DurationDistanceValue {
    text: string;
    value: number;
  }

  /**
   * Props for the DurationDistanceLabel component
   */
  interface DurationDistanceLabelProps {
    /**
     * Additional styles for the component
     */
    style?: Partial<DurationDistanceLabelStylesProps>;
    /**
     * Text instructions
     */
    instructions?: string;
    /**
     * Font family to use
     */
    fontFamily: string;
    /**
     * Font size for the text
     */
    fontSize: number;
    /**
     * Distance information
     */
    distance?: DurationDistanceValue;
    /**
     * Duration information
     */
    duration?: DurationDistanceValue;
    /**
     * Opacity of the component
     */
    opacity: number;
    /**
     * Whether to show travel mode icon
     */
    withTravelModeIcon?: boolean;
    /**
     * Travel mode
     */
    mode?: string;
  }
}
