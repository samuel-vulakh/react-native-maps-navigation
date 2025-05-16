/**
 * @imports
 */
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Styles from './styles';
import NavigationIcons from '../../constants/NavigationIcons';

/**
 * CloseButton props interface
 */
interface CloseButtonProps {
  size?: number;
  opacity?: number;
  color?: string;
  onPress?: () => void;
}

/**
 * @component
 */
export default class CloseButton extends Component<CloseButtonProps> {
  /**
   * defaultProps
   */
  static defaultProps = {
    size: 25,
    opacity: 1,
    color: '#000000',
  };

  /**
   * @constructor
   * @param props
   */
  constructor(props: CloseButtonProps) {
    super(props);
  }

  /**
   * render
   * @returns {JSX.Element}
   */
  render() {
    const { size = 25, opacity = 1, color = '#000000', onPress } = this.props;
    const styles = Styles({ size, opacity, color });

    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.closeButtonText}>{NavigationIcons.close}</Text>
      </TouchableOpacity>
    );
  }
}
