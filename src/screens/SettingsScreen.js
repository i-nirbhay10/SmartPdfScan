import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

export const SettingsScreen = () => {
  const { theme, toggleTheme, isPremium, upgradeToPremium, watermarkText, setWatermarkText } = useAppStore();
  const currentColors = colors[theme];
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

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

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background, paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.settingRow, { borderBottomColor: currentColors.border }]}>
        <View style={styles.settingIconText}>
          <Icon name={isDark ? "moon" : "sun"} size={20} color={currentColors.text} style={{ marginRight: 12 }} />
          <Text style={[styles.settingText, { color: currentColors.text }]}>Dark Mode</Text>
        </View>
        <Switch 
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: currentColors.primary }}
          thumbColor={isDark ? '#FFF' : '#f4f3f4'}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.settingRow, { borderBottomColor: currentColors.border }]}
        onPress={handleUpgrade}
      >
        <View style={styles.settingIconText}>
          <Icon name="star" size={20} color={isPremium ? '#FFD700' : currentColors.primary} style={{ marginRight: 12 }} />
          <Text style={[styles.settingText, { color: currentColors.text }]}>Premium Features</Text>
        </View>
        <Text style={{ color: isPremium ? '#FFD700' : currentColors.primary, fontWeight: 'bold' }}>
          {isPremium ? 'PRO ACTIVE' : 'UPGRADE'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingRow, { borderBottomColor: currentColors.border }]}
        onPress={() => {
          if (isPremium) {
            setTempWatermark(watermarkText);
            setWatermarkModalVisible(true);
          } else {
            handleUpgrade();
          }
        }}
      >
        <View style={styles.settingIconText}>
          <Icon name="edit-3" size={20} color={currentColors.text} style={{ marginRight: 12 }} />
          <View>
            <Text style={[styles.settingText, { color: currentColors.text }]}>Custom Watermark</Text>
            <Text style={{ color: currentColors.textSecondary, fontSize: 12, marginTop: 2 }}>{watermarkText}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>

      {/* Watermark Modal */}
      <Modal
        visible={watermarkModalVisible}
        transparent={true}
        animationType="fade"
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
                style={[styles.modalBtn, { backgroundColor: '#E53935' }]} 
                onPress={() => setWatermarkModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: currentColors.primary }]} 
                onPress={handleSaveWatermark}
              >
                <Text style={styles.modalBtnText}>Save</Text>
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
  settingIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
