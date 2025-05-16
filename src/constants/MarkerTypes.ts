/**
 * @enum {string}
 */
export enum MarkerTypes {
    ORIGIN = 'ORIGIN',
    DESTINATION = 'DESTINATION',
    POSITION_DOT = 'POSITION_DOT',
    POSITION_ARROW = 'POSITION_ARROW',
}

export type MarkerType = typeof MarkerTypes[keyof typeof MarkerTypes];