/**
 * @imports
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Styles, { ManeuverLabelStyles } from './styles';

interface ManeuverLabelProps {
    instructions: string;
    fontFamily?: string;
    fontFamilyBold?: string;
    fontSize?: number;
    fontColor?: string;
}

/**
 * @component
 */
export default class ManeuverLabel extends Component<ManeuverLabelProps> {
    /**
     * defaultProps
     */
    static defaultProps = {
        instructions: '',
        fontFamily: undefined,
        fontFamilyBold: undefined,
        fontSize: 15,
        fontColor: undefined
    }

    /**
     * @constructor
     * @param props
     */
    constructor(props: ManeuverLabelProps)
    {
        super(props);
    }

    /**
     * getParsedInstructions
     * @param styles
     * @returns {*}
     */
    getParsedInstructions(styles: ManeuverLabelStyles)
    {
        const parts: React.ReactElement[] = [];

        const regex = /(\w+)|<(.*?)>(.*?)<\/.*?>/g;

        const mapping: Record<string, any> = {
            r: styles.regular,
            b: styles.bold,
            d: styles.durationDistance,
            div: styles.extra,
        };

        let m: RegExpExecArray | null;
        let last = false;
        while((m = regex.exec(this.props.instructions))) {

            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
                last = true;
            }

            if(m[2]) {
                let tag = m[2].split(" ")[0];

                if(tag === "div") m[3] = '\n' + m[3];

                parts.push(<Text key={m.index} style={mapping[tag]}>{m[3]}{last ? '.' : ' '}</Text>);

            } else {
                parts.push(<Text key={m.index} style={mapping.r}>{m[0]}{last ? '.': ' '}</Text>);
            }
        }

        return (
            <Text style={{flexWrap: 'wrap', color: 'red'}}>
                {parts}
            </Text>
        )
    }

    /**
     * render
     * @returns {XML}
     */
    render()
    {
        const styles = Styles(this.props);

        return (
            <View style={styles.maneuverLabel}>
                {this.getParsedInstructions(styles)}
            </View>
        );
    }
}

