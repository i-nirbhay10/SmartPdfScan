import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, TextInput, Alert, Linking, Share, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAppUpdate } from '../hooks/useAppUpdate';

export const SettingsScreen = () => {
  const { theme, toggleTheme, isPremium, upgradeToPremium, watermarkText, setWatermarkText } = useAppStore();
  const currentColors = colors[theme];
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();
  const { checkForUpdates } = useAppUpdate();

  const [watermarkModalVisible, setWatermarkModalVisible] = useState(false);
  const [tempWatermark, setTempWatermark] = useState(watermarkText);

  const handleUpgrade = () => {
    if (isPremium) {
      Alert.alert('Premium Status', 'You are already a premium user!');
    } else {
      Alert.alert(
        'Upgrade to Premium',
        'Unlock customizable watermarks and more!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => {
              upgradeToPremium();
              Alert.alert('Success', 'You are now a premium user!');
            }
          }
        ]
      );
    }
  };

  const handleSaveWatermark = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Please upgrade to customize the watermark.');
      setWatermarkModalVisible(false);
      return;
    }
    setWatermarkText(tempWatermark);
    setWatermarkModalVisible(false);
  };

  const appVersion = DeviceInfo.getVersion();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out SmartPDFScan, the best document scanner app! Download it from the Play Store.',
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleRateApp = () => {
    const playStoreLink = 'https://play.google.com/store/apps/details?id=com.smartpdfscan'; // Replace with actual ID
    Linking.openURL(playStoreLink).catch(() => {
      Alert.alert('Error', 'Could not open Play Store.');
    });
  };

  // Modern individual floating setting item
  const ModernSettingRow = ({ icon, title, subtitle, rightElement, onPress, highlightColor }) => (
    <TouchableOpacity
      style={[styles.modernRow, { backgroundColor: currentColors.surface }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={styles.modernIconText}>
        <Icon name={icon} size={24} color={highlightColor || currentColors.text} style={{ marginRight: 16 }} />
        <View style={styles.textContainer}>
          <Text style={[styles.modernSettingText, { color: currentColors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.modernSettingSubtitle, { color: currentColors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement ? rightElement : (
        onPress && <Icon name="arrow-right" size={20} color={currentColors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background, paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>

        {/* Premium Huge Banner */}
        <TouchableOpacity
          style={styles.premiumBanner}
          activeOpacity={0.9}
          onPress={handleUpgrade}
        >
          <View style={styles.premiumContent}>
            <View>
              <Text style={styles.premiumTitle}>
                {isPremium ? 'PRO ACTIVE' : 'UPGRADE TO PRO'}
              </Text>
              <Text style={styles.premiumSub}>
                {isPremium ? 'Enjoying all premium features.' : 'Unlock custom watermarks & more.'}
              </Text>
            </View>
            <View style={styles.premiumIconWrap}>
              <Icon name="zap" size={24} color="#111" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Section: General */}
        <Text style={[styles.sectionHeading, { color: currentColors.textSecondary }]}>Preferences</Text>

        <ModernSettingRow
          icon={isDark ? "moon" : "sun"}
          title="Dark Mode"
          subtitle="Toggle application theme"
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#333', true: currentColors.primary }}
              thumbColor={'#FFF'}
            />
          }
        />

        <ModernSettingRow
          icon="type"
          title="Custom Watermark"
          subtitle={watermarkText}
          highlightColor={currentColors.primary}
          onPress={() => {
            if (isPremium) {
              setTempWatermark(watermarkText);
              setWatermarkModalVisible(true);
            } else {
              handleUpgrade();
            }
          }}
        />

        {/* Section: Support & Info */}
        <Text style={[styles.sectionHeading, { color: currentColors.textSecondary, marginTop: 16 }]}>About</Text>

        <ModernSettingRow
          icon="arrow-up-circle"
          title="Check for Updates"
          onPress={() => checkForUpdates(true)}
        />
        <ModernSettingRow
          icon="heart"
          title="Rate App"
          onPress={handleRateApp}
          highlightColor="#E91E63"
        />
        <ModernSettingRow
          icon="send"
          title="Share App"
          onPress={handleShareApp}
          highlightColor="#9C27B0"
        />

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: currentColors.textSecondary }]}>
            SmartPDFScan v{appVersion}
          </Text>
        </View>
      </ScrollView>

      {/* Watermark Modal */}
      <Modal
        visible={watermarkModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWatermarkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Customize Watermark</Text>
            <TextInput
              style={[styles.input, { color: currentColors.text, borderColor: currentColors.border, backgroundColor: currentColors.background }]}
              value={tempWatermark}
              onChangeText={setTempWatermark}
              placeholder="Enter watermark text"
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: currentColors.background }]}
                onPress={() => setWatermarkModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: currentColors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: currentColors.primary }]}
                onPress={handleSaveWatermark}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  premiumBanner: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  premiumSub: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  premiumIconWrap: {
    backgroundColor: '#FFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 8,
  },
  modernRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  modernIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modernSettingText: {
    fontSize: 17,
    fontWeight: '600',
  },
  modernSettingSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  versionContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 64,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
  },
  input: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
