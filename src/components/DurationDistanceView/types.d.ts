interface Step {
  distance?: {
    text: string;
  };
  duration?: {
    text: string;
  };
}

interface DurationDistanceViewProps {
  step?: Step;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  arrowSize?: number;
  arrowColor?: string;
  withCloseButton?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  padding?: number;
  backgroundColor?: string;
  flexDirection?: 'row' | 'column';
  minHeight?: number;
  alignItems?: 'center' | 'flex-start' | 'flex-end';
}
