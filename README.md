# react-native-maps-navigation-ts

Fork of [this repo](https://github.com/flyandi/react-native-maps-navigation)

Fixed issues and added TS support

Enhances React Native Maps with Realtime Navigation.

`Please note that this module is usable but still under heavy development. Some properties and/or component names might change without notice.`

![alt text](https://github.com/flyandi/react-native-maps-navigation/raw/master/docs/preview.gif 'react-native-maps-navigation')

## Installation

**React Native >= 0.49**

```bash
yarn add react-native-maps-navigation
```

Make sure you link the module before building:

```bash
react-native link react-native-maps-navigation
```

## Example

[Head over to the example application to get started right away.](https://github.com/flyandi/react-native-maps-navigation-example)

The example application uses most components and api modules of this library and gets you started in a useful direction.

## Development

### Linting and Formatting

This project uses ESLint and Prettier for code quality and formatting. Here are the available commands:

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if formatting is correct
npm run format:check

# Run both formatting and linting fixes
npm run fix
```

### Commit Versioning

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages and uses semantic versioning for releases.

#### Committing Changes

Use the following command to create a properly formatted commit message:

```bash
npm run commit
```

This will launch an interactive prompt to help you create a commit message that follows the conventional commit format:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes to the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts

#### Releasing New Versions

To create a new release with an automatically incremented version number and generated CHANGELOG:

```bash
# Automatically determine version bump based on commits
npm run release

# Explicitly specify version bump
npm run release:patch  # 0.0.x
npm run release:minor  # 0.x.0
npm run release:major  # x.0.0
```

This will:

1. Bump the version in package.json
2. Update the CHANGELOG.md
3. Create a git tag
4. Create a commit with the new version

## Components

The library exposes the following modules and components.

The main component is `MapViewNavigation`:

[`<MapViewNavigation />` Component API](docs/MapViewNavigation.md)

The library also ships with various UI components:

[`<DirectionInputBox />` Component API](docs/DirectionInputBox.md)

[`<DirectionsListView />` Component API](docs/DirectionsListView.md)

[`<DurationDistanceLabel />` Component API](docs/DurationDistanceLabel.md)

[`<DurationDistanceView />` Component API](docs/DurationDistanceView.md)

[`<ManeuverView />` Component API](docs/ManeuverView.md)

[`<ManeuverLabel />` Component API](docs/ManeuverLabel.md)

[`<TravelModeBox />` Component API](docs/TravelModeBox.md)

These are internal components used by the library:

[`<ManeuverArrow />` Component API](docs/ManeuverArrow.md)

[`<CloseButton />` Component API](docs/CloseButton.md)

[`<PositionMarker />` Component API](docs/PositionMarker.md)

[`<RouteMarker />` Component API](docs/RouteMarker.md)

[`<RouterPolyline />` Component API](docs/RouterPolyline.md)

## General Usage
