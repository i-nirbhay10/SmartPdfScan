import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export const RenameModal = ({
  visible,
  onClose,
  onRename,
  newName,
  setNewName,
  currentColors,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
          <View style={styles.headerContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: currentColors.primary + '15' }]}>
              <Icon name="edit-2" size={20} color={currentColors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Rename</Text>
          </View>

          <TextInput
            style={[styles.input, { 
              color: currentColors.text, 
              backgroundColor: currentColors.background,
              borderColor: currentColors.primary + '30'
            }]}
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter document name"
            placeholderTextColor={currentColors.textSecondary}
            autoFocus
            selectionColor={currentColors.primary}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalBtn, { backgroundColor: 'transparent' }]} 
              onPress={onClose}
            >
              <Text style={[styles.modalBtnText, { color: currentColors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalBtn, { backgroundColor: currentColors.primary, marginLeft: 12 }]} 
              onPress={onRename}
            >
              <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
