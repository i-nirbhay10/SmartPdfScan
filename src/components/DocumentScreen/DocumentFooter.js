import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export const DocumentFooter = ({ currentColors, insets, onSave, onShare }) => {
  return (
    <View style={[
      styles.footerContainer, 
      { 
        backgroundColor: currentColors.surface,
        borderTopColor: currentColors.border,
        paddingBottom: Math.max(insets.bottom + 8, 20),
      }
    ]}>
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn, { backgroundColor: currentColors.primary + '15' }]}
          onPress={onSave}
        >
          <Icon name="download" size={20} color={currentColors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.btnText, { color: currentColors.primary }]}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.btn, styles.primaryBtn, { backgroundColor: currentColors.primary }]}
          onPress={onShare}
        >
          <Icon name="share-2" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.btnText, { color: '#FFF' }]}>Share PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryBtn: {
    flex: 1,
    marginRight: 8,
  },
  primaryBtn: {
    flex: 1.5,
    marginLeft: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
