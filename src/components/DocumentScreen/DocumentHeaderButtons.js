import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export const DocumentHeaderButtons = ({
  onEdit,
  onDelete,
  currentColors,
}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={onEdit} 
        style={{ marginRight: 20 }}
      >
        <Icon name="edit" size={22} color={currentColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Icon name="trash-2" size={22} color="#E53935" />
      </TouchableOpacity>
    </View>
  );
};
