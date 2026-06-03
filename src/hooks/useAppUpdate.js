import { useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

export const useAppUpdate = () => {
  const checkForUpdates = useCallback(async (showPromptIfUpToDate = false) => {
    try {
      const inAppUpdates = new SpInAppUpdates(false);
      const result = await inAppUpdates.checkNeedsUpdate();

      if (result.shouldUpdate) {
        if (Platform.OS === 'android') {
          inAppUpdates.startUpdate({
            updateType: IAUUpdateKind.FLEXIBLE,
          });
        } else {
          Alert.alert('Update Available', 'A new version of the app is available. Please update from the store.');
        }
      } else if (showPromptIfUpToDate) {
        Alert.alert('Up to Date', 'You are using the latest version of the app.');
      }
    } catch (error) {
      console.log('Update check failed', error);
      if (showPromptIfUpToDate) {
        Alert.alert('Error', 'Failed to check for updates.');
      }
    }
  }, []);

  return { checkForUpdates };
};
