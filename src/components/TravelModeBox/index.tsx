/**
 * @imports
 */
import React, { Component } from 'react';
import OptionGroupBox from 'react-native-optiongroup';
import {
  DEFAULT_MODES,
  MODE_MAPPING,
  DRIVING,
  WALKING,
  TRANSIT,
  BICYCLING,
} from '../../constants/TravelModes';
import { NavigationIconsFont } from '../../constants/NavigationIcons';
import { StyleProp } from 'react-native';
import { ViewStyle } from 'react-native';

// Travel mode type
type TravelMode = typeof DRIVING | typeof WALKING | typeof TRANSIT | typeof BICYCLING;

// Define the travel mode option interface
interface TravelModeOption {
  mode: string;
  name: string;
  icon: string;
}

// Define the style and behavior props
interface TravelModeBoxProps {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  contentPadding?: number;
  inverseTextColor?: string;
  modes?: TravelMode[];
  selected?: TravelMode;
  defaultValue?: TravelMode;
  style?: StyleProp<ViewStyle>;
  onChange?: (mode: TravelMode) => void;
  theme?: string;
  invertKeyLabel?: boolean;
  fontFamily?: string;
  fontSize?: number;
  useIcons?: boolean;
}

/**
 * @component
 */
export default class TravelModeBox extends Component<TravelModeBoxProps> {
  /**
   * defaultProps
   * @type {}
   */
  static defaultProps = {
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 3,
    contentPadding: 10,
    inverseTextColor: '#FFFFFF',
    defaultValue: DRIVING,
    selected: undefined,
    style: {},
    onChange: undefined,
    theme: undefined,
    invertKeyLabel: false,
    fontSize: 25,
    fontFamily: undefined,
    useIcons: true,
    modes: DEFAULT_MODES,
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props: TravelModeBoxProps) {
    super(props);
  }

  render() {
    const options: TravelModeOption[] = [];

    this.props.modes?.map(mode => {
      if (MODE_MAPPING[mode]) {
        options.push(MODE_MAPPING[mode]);
      }
    });

    return (
      <OptionGroupBox
        {...this.props}
        fontFamily={this.props.useIcons ? NavigationIconsFont.fontFamily : this.props.fontFamily}
        options={options}
        useKeyValue={'mode'}
        useLabelValue={'icon'}
      />
    );
  }
}
