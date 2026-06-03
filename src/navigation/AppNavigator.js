import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { DocumentScreen } from '../screens/DocumentScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import { useAppUpdate } from '../hooks/useAppUpdate';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { theme } = useAppStore();
  const currentColors = colors[theme];
  const { checkForUpdates } = useAppUpdate();

  useEffect(() => {
    checkForUpdates(false);
  }, [checkForUpdates]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: currentColors.surface },
          headerTintColor: currentColors.text,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ padding: 8 }}>
              <Text style={{ color: currentColors.primary, fontSize: 16 }}>Settings</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'SmartPDFScan' }} 
        />
        <Stack.Screen 
          name="Document" 
          component={DocumentScreen} 
          options={({ route }) => ({ title: 'Document Details', headerRight: () => null })} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings', headerRight: () => null }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
