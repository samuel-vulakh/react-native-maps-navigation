/**
 * @imports
 */
import { StyleSheet} from 'react-native';
import { NavigationIconsFont } from '../../constants/NavigationIcons';


interface PositionMarkerProps {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    size?: number;
    angle?: number;
}

/**
 * @styles
 */
const styles = (props: PositionMarkerProps) => StyleSheet.create({

    positionMarkerText: {
        ...NavigationIconsFont,
        fontSize: props.fontSize,
        color: props.color,
    },

    positionMarkerArrow: {
        backgroundColor: props.backgroundColor,
        width: props.size,
        height: props.size,
        borderRadius: props.size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
            { rotateX: props.angle + 'deg'}
        ]
    }
});

export type PositionMarkerStyles = ReturnType<typeof styles>;


export default styles;