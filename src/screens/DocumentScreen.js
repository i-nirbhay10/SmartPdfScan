import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';

import { usePdfExport } from '../hooks/usePdfExport';
import { DocumentFooter } from '../components/DocumentScreen/DocumentFooter';
import { RenameModal } from '../components/DocumentScreen/RenameModal';
import { DocumentHeaderButtons } from '../components/DocumentScreen/DocumentHeaderButtons';

export const DocumentScreen = ({ route, navigation }) => {
  const { documentId } = route.params;
  const { theme, documents, removeDocument, renameDocument } = useAppStore();
  const currentColors = colors[theme];
  const insets = useSafeAreaInsets();

  const document = documents.find(doc => doc.id === documentId);
  
  const [renameVisible, setRenameVisible] = useState(false);
  const [newName, setNewName] = useState(document ? document.name : '');

  // Use custom hook for PDF Logic
  const { generatePDF, sharePDF, saveToStorage } = usePdfExport(document);

  useLayoutEffect(() => {
    if (document) {
      navigation.setOptions({
        title: document.name,
        headerRight: () => (
          <DocumentHeaderButtons
            currentColors={currentColors}
            onEdit={() => {
              setNewName(document.name);
              setRenameVisible(true);
            }}
            onDelete={handleDelete}
          />
        ),
      });
    }
  }, [navigation, document, currentColors]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            removeDocument(documentId);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const handleRename = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Document name cannot be empty');
      return;
    }
    renameDocument(documentId, newName.trim());
    setRenameVisible(false);
  };

  if (!document) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center' }]}>
        <Text style={{ color: currentColors.text, textAlign: 'center' }}>Document not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <FlatList
        data={document.pages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.pageImage} resizeMode="contain" />
        )}
      />
      
      <DocumentFooter 
        currentColors={currentColors} 
        insets={insets} 
        onSave={saveToStorage} 
        onShare={sharePDF} 
      />

      <RenameModal
        visible={renameVisible}
        onClose={() => setRenameVisible(false)}
        onRename={handleRename}
        newName={newName}
        setNewName={setNewName}
        currentColors={currentColors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageImage: {
    width: '100%',
    height: 400,
    marginVertical: 8,
    backgroundColor: '#E0E0E0',
  },
});
