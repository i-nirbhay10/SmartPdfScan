import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme/colors';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

export const HomeScreen = ({ navigation }) => {
  const { theme, documents, addDocument } = useAppStore();
  const currentColors = colors[theme];
  const insets = useSafeAreaInsets();
  
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleFab = () => {
    const toValue = isFabOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsFabOpen(!isFabOpen);
  };

  const scanDocument = async () => {
    toggleFab();
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

  const importFromGallery = async () => {
    toggleFab();
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // allow multiple
      });
      if (result.assets && result.assets.length > 0) {
        const selectedImages = result.assets.map(asset => asset.uri);
        addDocument({
          id: Date.now().toString(),
          name: `Gallery_${Date.now()}`,
          pages: selectedImages,
          date: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cameraStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
    ],
  };

  const galleryStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
    ],
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
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

      {isFabOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleFab} 
        />
      )}

      <Animated.View style={[styles.fabAction, galleryStyle, { bottom: insets.bottom + 24 }]}>
        <TouchableOpacity 
          style={[styles.fabActionBtn, { backgroundColor: currentColors.surface, borderColor: currentColors.border, borderWidth: 1 }]}
          onPress={importFromGallery}
        >
          <Icon name="image" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.fabAction, cameraStyle, { bottom: insets.bottom + 24 }]}>
        <TouchableOpacity 
          style={[styles.fabActionBtn, { backgroundColor: currentColors.surface, borderColor: currentColors.border, borderWidth: 1 }]}
          onPress={scanDocument}
        >
          <Icon name="camera" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: currentColors.primary, bottom: insets.bottom + 24 }]}
        onPress={toggleFab}
        activeOpacity={0.8}
      >
        <Animated.View style={rotation}>
          <Icon name="plus" size={28} color="#FFF" />
        </Animated.View>
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
    zIndex: 10,
  },
  fabAction: {
    position: 'absolute',
    right: 32,
    width: 48,
    height: 48,
    zIndex: 9,
  },
  fabActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 8,
  },
});
