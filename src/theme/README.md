# Custom Theme System for Solana Mobile Expo Template

This project now includes a comprehensive custom theme system that extends React Native Paper's Material Design 3 theme with custom colors for your Solana mobile app.

## Features

- 🎨 Custom color palettes for light and dark themes
- 🔄 Automatic theme switching based on system preferences
- ✨ Extended color system with semantic colors (success, warning, info)
- 🟣 Solana brand colors integration
- 📱 TypeScript support with proper type definitions
- 🎯 Easy-to-use theme hooks and utilities

## Theme Structure

### Custom Colors Added

#### Semantic Colors
- **Success**: Green colors for positive actions/states
- **Warning**: Orange/yellow colors for caution states
- **Info**: Blue colors for informational content

#### Brand Colors
- **Solana Green**: `#14f195`
- **Solana Purple**: `#9945ff`

Each color includes:
- Base color
- Container variant
- Appropriate text colors (on-color variants)

## Usage

### 1. Using the Theme Hook

```tsx
import { useAppTheme } from '../theme';

const MyComponent = () => {
  const theme = useAppTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.success }}>
      <Text style={{ color: theme.colors.onSuccess }}>
        Success message!
      </Text>
    </View>
  );
};
```

### 2. Custom Components with Theme

```tsx
import { Button, Chip } from 'react-native-paper';
import { useAppTheme } from '../theme';

const CustomStatusChip = ({ status, children }) => {
  const theme = useAppTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.info;
    }
  };

  return (
    <Chip style={{ backgroundColor: getStatusColor() }}>
      {children}
    </Chip>
  );
};
```

### 3. Solana Brand Colors

```tsx
const SolanaButton = () => {
  const theme = useAppTheme();
  
  return (
    <Button
      mode="contained"
      style={{ backgroundColor: theme.colors.solanaPurple }}
      labelStyle={{ color: '#ffffff' }}
    >
      Connect Wallet
    </Button>
  );
};
```

## File Structure

```
src/theme/
├── colors.ts          # Color definitions for light/dark themes
├── hooks.ts           # Theme hooks and utilities
├── theme.d.ts         # TypeScript type declarations
└── index.ts           # Main exports
```

## Customization

### Adding New Colors

1. **Add to `colors.ts`**:
```typescript
export const customLightColors = {
  // ... existing colors
  brandBlue: "#1976d2",
  onBrandBlue: "#ffffff",
};

export const customDarkColors = {
  // ... existing colors
  brandBlue: "#42a5f5",
  onBrandBlue: "#000000",
};
```

2. **Update Type Definitions in `theme.d.ts`**:
```typescript
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      // ... existing custom colors
      brandBlue: string;
      onBrandBlue: string;
    }
  }
}
```

### Modifying Existing Colors

Simply update the values in `src/theme/colors.ts`:

```typescript
export const customLightColors = {
  primary: "#your-new-primary-color",
  // ... other colors
};
```

## Best Practices

1. **Always use semantic colors** instead of hardcoded values
2. **Provide both light and dark variants** for all custom colors
3. **Include proper contrast ratios** for accessibility
4. **Use the theme hook** instead of importing colors directly
5. **Test with both light and dark modes**

## Available Colors

### Material Design 3 Colors
All standard MD3 colors are available: `primary`, `secondary`, `tertiary`, `surface`, `background`, etc.

### Custom Semantic Colors
- `success` / `onSuccess` / `successContainer` / `onSuccessContainer`
- `warning` / `onWarning` / `warningContainer` / `onWarningContainer`
- `info` / `onInfo` / `infoContainer` / `onInfoContainer`

### Solana Brand Colors
- `solanaGreen`
- `solanaPurple`
- `solanaGradientStart`
- `solanaGradientEnd`

## Examples

See the updated `HomeScreen.tsx` for a practical example of how these custom colors are used in the app.

## Theme Switching

The app automatically switches between light and dark themes based on the system settings. All custom colors are designed to work well in both modes.
