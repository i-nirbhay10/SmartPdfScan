import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Marker, { Position, ImageFormat } from 'react-native-image-marker';
import RNImageToPdf from 'react-native-image-to-pdf';
import { useAppStore } from '../store';

export const usePdfExport = (document) => {
  const { watermarkText } = useAppStore();

  const generatePDF = async () => {
    console.log('--- EXPORT TO PDF PAGES ---', document.pages);
    const localPaths = [];
    const markedPaths = [];

    for (let i = 0; i < document.pages.length; i++) {
      const sourcePath = document.pages[i];
      const destPath = `${RNFS.CachesDirectoryPath}/temp_pdf_page_${Date.now()}_${i}.jpg`;

      // Copy the file to a guaranteed local absolute path
      await RNFS.copyFile(sourcePath, destPath);

      let finalPath = destPath;

      // Apply Watermark if set
      if (watermarkText && watermarkText.trim().length > 0) {
        try {
          console.log('--- APPLYING WATERMARK ---', watermarkText);
          const markedResult = await Marker.markText({
            backgroundImage: {
              src: `file://${destPath}`,
              scale: 1,
            },
            watermarkTexts: [
              {
                text: watermarkText,
                positionOptions: {
                  position: Position.bottomRight,
                },
                style: {
                  color: '#FFFFFF80', // 50% opaque white
                  fontSize: 40,
                  textBackgroundStyle: {
                    color: '#00000080', // 50% opaque black
                    paddingX: 40,
                    paddingY: 30,
                  },
                },
              },
            ],
            quality: 100,
            filename: `marked_page_${Date.now()}_${i}`,
            saveFormat: ImageFormat.jpg,
          });
          finalPath = markedResult.replace('file://', '');
          markedPaths.push(finalPath);
        } catch (err) {
          console.log('Failed to apply watermark:', err);
        }
      }

      localPaths.push(finalPath);
    }
    const options = {
      imagePaths: localPaths,
      name: `${document.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      quality: 1, // Max quality
    };

    const pdf = await RNImageToPdf.createPDFbyImages(options);
    console.log('--- PDF GENERATED ---', pdf.filePath);

    // Clean up temp images
    console.log('--- CLEANING UP TEMP FILES ---');
    const allTempPaths = Array.from(new Set([...localPaths, ...markedPaths]));
    for (const tempPath of allTempPaths) {
      try {
        if (tempPath && await RNFS.exists(tempPath)) {
          await RNFS.unlink(tempPath);
        }
      } catch (err) {
        console.log('Failed to delete temp page:', tempPath, err);
      }
    }

    // Copy the PDF to the internal cache directory
    const cachePdfPath = `${RNFS.CachesDirectoryPath}/${options.name}`;
    if (await RNFS.exists(cachePdfPath)) {
      await RNFS.unlink(cachePdfPath);
    }
    await RNFS.copyFile(pdf.filePath, cachePdfPath);
    console.log('--- PDF COPIED TO CACHE ---', cachePdfPath);

    return cachePdfPath;
  };

  const sharePDF = async () => {
    try {
      const pdfPath = await generatePDF();
      await Share.open({
        url: `file://${pdfPath}`,
        type: 'application/pdf',
        title: `Share ${document.name}`,
      });
    } catch (error) {
      console.log('--- EXPORT ERROR ---', error);
      Alert.alert('Error', 'Failed to generate and share PDF');
    }
  };

  const saveToStorage = async () => {
    try {
      const pdfPath = await generatePDF();
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${document.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      await RNFS.copyFile(pdfPath, downloadPath);
      Alert.alert('Success', `PDF saved to Downloads folder!\n\n${downloadPath}`);
    } catch (error) {
      console.log('--- SAVE ERROR ---', error);
      Alert.alert('Error', 'Failed to save PDF to storage.');
    }
  };

  return { generatePDF, sharePDF, saveToStorage };
};
