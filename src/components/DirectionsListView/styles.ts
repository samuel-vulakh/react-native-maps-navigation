/**
 * @imports
 */
import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/Colors';

interface DirectionsListViewStyleProps {
  fontFamily: string;
  fontFamilyBold: string;
}

/**
 * @styles
 */
export default (props: DirectionsListViewStyleProps) =>
  StyleSheet.create({
    /**
     * @directionDetailHeader
     */
    bold: {
      flexWrap: 'wrap',
      fontFamily: props.fontFamilyBold || props.fontFamily,
      fontSize: 16,
      fontWeight: 'bold',
    },
    directionDetailContent: {
      flexDirection: 'column',
      flex: 1,
    },
    directionDetailHeader: {
      backgroundColor: Colors.surface,
      flexDirection: 'column',
      padding: 25,
      paddingBottom: 10,
    },
    directionDetailHeaderAddressLabel: {
      fontFamily: props.fontFamily,
      fontSize: 13,
      fontWeight: 'bold',
      opacity: 0.7,
    },
    directionDetailHeaderAddressText: {
      fontFamily: props.fontFamily,
      fontSize: 16,
    },
    directionDetailHeaderSection: {
      flexDirection: 'column',
      marginBottom: 15,
    },
    directionDetailIconContainer: {
      alignItems: 'center',
      flex: 0,
      justifyContent: 'flex-start',
      width: 50,
    },

    directionDetailSection: {
      borderColor: Colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      flex: 1,
      marginBottom: 20,
      paddingTop: 20,
    },
    directionDetailSectionContainer: {
      flex: 1,
      margin: 25,
      marginTop: 0,
    },

    /**
     * @directionDetailTravel
     */
    directionDetailTravel: {
      margin: 25,
    },
    directionDetailTravelDistance: {
      fontFamily: props.fontFamily,
      fontSize: 22,
      opacity: 0.8,
    },

    directionDetailTravelDuration: {
      color: Colors.primary,
      fontFamily: props.fontFamily,
      fontSize: 32,
    },
    durationDistance: {
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: 14,
      opacity: 0.8,
    },
    extra: {
      color: Colors.primary,
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: 13,
    },

    regular: {
      flexWrap: 'wrap',
      fontFamily: props.fontFamily,
      fontSize: 16,
    },
  });
