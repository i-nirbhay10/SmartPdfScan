import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      documents: [],
      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      removeDocument: (id) => set((state) => ({ documents: state.documents.filter(doc => doc.id !== id) })),
      renameDocument: (id, name) => set((state) => ({ documents: state.documents.map(doc => doc.id === id ? { ...doc, name } : doc) })),
      
      // Premium & Watermark
      isPremium: false,
      upgradeToPremium: () => set({ isPremium: true }),
      watermarkText: 'Scanned with SmartPDFScan',
      setWatermarkText: (text) => set({ watermarkText: text }),
    }),
    {
      name: 'smart-pdf-scan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
