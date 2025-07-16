import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, Chip } from 'react-native-paper';
import { useAppTheme } from '../../theme/hooks';

export const ThemeExampleComponent: React.FC = () => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
            Custom Theme Colors
          </Text>
          
          {/* Primary Button */}
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            Primary Button
          </Button>

          {/* Secondary Button */}
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            labelStyle={{ color: theme.colors.onSecondary }}
          >
            Secondary Button
          </Button>

          {/* Custom Success Chip */}
          <Chip
            style={[styles.chip, { backgroundColor: theme.colors.success }]}
            textStyle={{ color: theme.colors.onSuccess }}
          >
            Success Status
          </Chip>

          {/* Custom Warning Chip */}
          <Chip
            style={[styles.chip, { backgroundColor: theme.colors.warning }]}
            textStyle={{ color: theme.colors.onWarning }}
          >
            Warning Status
          </Chip>

          {/* Custom Info Chip */}
          <Chip
            style={[styles.chip, { backgroundColor: theme.colors.info }]}
            textStyle={{ color: theme.colors.onInfo }}
          >
            Info Status
          </Chip>

          {/* Solana Brand Colors */}
          <View style={styles.solanaContainer}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Solana Brand Colors:
            </Text>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: theme.colors.solanaGreen }
              ]}
            />
            <View
              style={[
                styles.colorBox,
                { backgroundColor: theme.colors.solanaPurple }
              ]}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 4,
  },
  chip: {
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  solanaContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
