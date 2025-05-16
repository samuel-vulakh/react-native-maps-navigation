/**
 * @enum {string}
 */
export enum PolylineTypes {
    ROUTE = 'ROUTE',
    ROUTE_ALTERNATIVE = 'ROUTE_ALTERNATIVE',
    PENDING = 'PENDING',
    NEXT = 'NEXT',
}

export type PolylineType = typeof PolylineTypes[keyof typeof PolylineTypes];