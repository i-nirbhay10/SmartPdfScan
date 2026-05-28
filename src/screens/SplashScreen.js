import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { useAppStore } from '../store';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  const { theme } = useAppStore();
  const currentColors = colors[theme];

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Logo Scale & Fade In
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 15,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title text Fade & Slide up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Show loader
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger onFinish callback after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.content}>
        {/* Brand Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              backgroundColor: currentColors.primary + '15', // Subtle transparent primary color
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Icon name="file-text" size={70} color={currentColors.primary} />
        </Animated.View>

        {/* Brand Name */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
          }}
        >
          <Text style={[styles.brandText, { color: currentColors.text }]}>
            Smart<Text style={{ color: currentColors.primary }}>PDF</Text>Scan
          </Text>
          <Text style={[styles.tagline, { color: currentColors.textSecondary }]}>
            Premium Document Scanner & Creator
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Loading Indicator */}
      <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
        <ActivityIndicator size="small" color={currentColors.primary} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
  },
});
