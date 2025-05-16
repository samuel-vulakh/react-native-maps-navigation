/**
 * @imports
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MODE_MAPPING, DRIVING, WALKING, TRANSIT, BICYCLING } from '../../constants/TravelModes';
import Styles from "./styles";

// Valid travel modes
type TravelMode = typeof DRIVING | typeof WALKING | typeof TRANSIT | typeof BICYCLING;

/**
 * Component props interface
 */
interface TravelModeLabelProps {
    size?: number;
    opacity?: number;
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    useIcon?: boolean;
    useLabel?: boolean;
    mode?: TravelMode;
}

/**
 * @component
 */
export default class TravelModeLabel extends Component<TravelModeLabelProps> {
    /**
     * defaultProps
     * @type {}
     */
    static defaultProps = {
        color: undefined,
        opacity: 0.8,
        fontSize: 25,
        fontFamily: undefined,
        useIcon: true,
        useLabel: true,
        mode: undefined,
    }

    /**
     * @constructor
     * @param props
     */
    constructor(props: TravelModeLabelProps) {
        super(props);
    }

    /**
     * render
     * @returns {JSX.Element | null}
     */
    render() {
        const styles = Styles(this.props);

        // MODE_MAPPING is now properly typed with TravelMode
        const travelMode = this.props.mode ? MODE_MAPPING[this.props.mode] : undefined;

        if (!travelMode) return null;

        return (
            <View style={styles.travelModeLabelContainer}>
                {!this.props.useIcon ? null : (
                    <Text style={styles.travelModeLabelIcon}>
                        {travelMode.icon}
                    </Text>
                )}

                {!this.props.useLabel ? null : (
                    <Text style={styles.travelModeLabelText}>
                        {travelMode.name}
                    </Text>
                )}
            </View>
        );
    }
}

