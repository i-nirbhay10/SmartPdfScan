import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

export const HomeScreen = ({ navigation }) => {
  const { theme, documents, addDocument } = useAppStore();
  const currentColors = colors[theme];
  const insets = useSafeAreaInsets();

  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument();
      if (scannedImages && scannedImages.length > 0) {
        addDocument({
          id: Date.now().toString(),
          name: `Scan_${Date.now()}`,
          pages: scannedImages,
          date: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <FlatList
        data={documents}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88, flexGrow: 1 }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-plus" size={80} color={currentColors.textSecondary} style={{ opacity: 0.3, marginBottom: 20 }} />
            <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>
              No documents yet. Tap the + button to scan.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.docItem, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}
            onPress={() => navigation.navigate('Document', { documentId: item.id })}
          >
            <View style={styles.docIconContainer}>
              <Icon name="file-text" size={24} color={currentColors.primary} />
            </View>
            <View style={styles.docInfo}>
              <Text style={[styles.docName, { color: currentColors.text }]}>{item.name}</Text>
              <Text style={[styles.docDate, { color: currentColors.textSecondary }]}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: currentColors.primary, bottom: insets.bottom + 24 }]}
        onPress={scanDocument}
      >
        <Icon name="camera" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  docItem: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  docDate: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
  },
});
