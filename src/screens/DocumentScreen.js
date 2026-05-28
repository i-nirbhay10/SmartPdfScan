import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNImageToPdf from 'react-native-image-to-pdf';

export const DocumentScreen = ({ route, navigation }) => {
  const { documentId } = route.params;
  const { theme, documents } = useAppStore();
  const currentColors = colors[theme];
  
  const document = documents.find(doc => doc.id === documentId);

  if (!document) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center' }]}>
        <Text style={{ color: currentColors.text, textAlign: 'center' }}>Document not found</Text>
      </View>
    );
  }

  const exportToPDF = async () => {
    try {
      const options = {
        imagePaths: document.pages.map(p => p.replace('file://', '')),
        name: `${document.name}.pdf`,
        maxSize: {
          width: 595,
          height: 842
        },
        quality: 1,
      };

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      
      await Share.open({
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
        title: `Share ${document.name}`,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <FlatList
        data={document.pages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.pageImage} resizeMode="contain" />
        )}
      />
      <View style={[styles.footer, { backgroundColor: currentColors.surface, borderTopColor: currentColors.border }]}>
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: currentColors.primary }]}
          onPress={exportToPDF}
        >
          <Text style={styles.btnText}>Export to PDF & Share</Text>
        </TouchableOpacity>
      </View>
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  btn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
