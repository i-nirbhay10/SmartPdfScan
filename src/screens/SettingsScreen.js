import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useAppStore();
  const currentColors = colors[theme];
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.settingRow, { borderBottomColor: currentColors.border }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Dark Mode</Text>
        <Switch 
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: currentColors.primary }}
          thumbColor={isDark ? '#FFF' : '#f4f3f4'}
        />
      </View>
      <View style={[styles.settingRow, { borderBottomColor: currentColors.border }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Premium Features</Text>
        <Text style={{ color: currentColors.primary, fontWeight: 'bold' }}>UPGRADE ✨</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
