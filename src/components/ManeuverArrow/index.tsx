/**
 * @imports
 */
import React, { Component } from 'react';
import { Text } from 'react-native';
import Styles, { ManeuverArrowStyles } from './styles';
import NavigationIcons from "../../constants/NavigationIcons";
import {DEFAULT_DIRECTION_TYPE} from "../../constants/DirectionTypes";

interface ManeuverArrowProps {
    maneuver?: {
        name?: string;
    };
    size: number;
    opacity: number;
    color: string;
}

/**
 * @component
 */
export default class ManeuverArrow extends Component<ManeuverArrowProps> {
    /**
     * defaultProps
     */
    static defaultProps = {
        maneuver: undefined,
        size: 25,
        opacity: 1,
        color: '#000000',
    }

    /**
     * @constructor
     * @param props
     */
    constructor(props: ManeuverArrowProps)
    {
        super(props);
    }

    /**
     * render
     * @returns {XML}
     */
    render()
    {
        const styles = Styles(this.props);

        const icon = this.props.maneuver && (this.props.maneuver.name || DEFAULT_DIRECTION_TYPE);
        const iconToUse = icon || DEFAULT_DIRECTION_TYPE;

        return (
            <Text style={styles.maneuverArrow}>
                {NavigationIcons[iconToUse]}
            </Text>
        );
    }
}

