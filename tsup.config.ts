import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-native',
    'react-native-maps',
    '@react-native-community/geolocation',
    'geolib',
    'react-native-optiongroup',
  ],
  platform: 'neutral',
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
