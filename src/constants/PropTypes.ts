/**
 * Coordinate PropType
 * @param props - Component props
 * @param propName - Name of the property being validated
 * @param componentName - Name of the component using this validator
 * @returns {Error | null} - Error if validation fails, null if validation passes
 */
export const CoordinatePropType = (
  props: Record<string, any>,
  propName: string,
  componentName: string
): Error | null => {
  const target = props[propName];

  if (
    !target ||
    typeof target !== "object" ||
    !target.latitude ||
    !target.longitude
  ) {
    return new Error(
      `${propName} in ${componentName} requires to be a coordinate object ({latitude, longitude})`
    );
  }

  return null;
};
