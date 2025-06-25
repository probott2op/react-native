import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  animatedValue: Animated.Value;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  animatedValue: Animated.Value;
}

const DriveSafeHomepage = ({ navigation }: { navigation: any }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const mousePos = useState(new Animated.ValueXY())[0];

  useEffect(() => {
    // Generate animated particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      const animatedValue = new Animated.Value(0);
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        animatedValue,
      });

      // Start floating animation
      const floatAnimation = () => {
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => floatAnimation());
      };
      floatAnimation();
    }
    setParticles(newParticles);

    // Generate floating elements
    const newFloatingElements: FloatingElement[] = [];
    for (let i = 0; i < 3; i++) {
      const animatedValue = new Animated.Value(0);
      newFloatingElements.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        animatedValue,
      });

      // Start floating animation
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000 + i * 2000,
          useNativeDriver: true,
        })
      ).start();
    }
    setFloatingElements(newFloatingElements);
  }, []);

  const handleButtonPress = (path: string) => {
    console.log(`Navigate to: ${path}`);
    // Navigate to the appropriate screen
    if (path === '/login') {
      navigation.navigate('Login');
    } else if (path === '/register') {
      navigation.navigate('Register');
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      mousePos.setValue({
        x: (locationX / width - 0.5) * 20,
        y: (locationY / height - 0.5) * 20,
      });
    },
  });

  const renderParticle = (particle: Particle) => {
    const translateY = particle.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });

    const opacity = particle.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.4, 0.8, 0.4],
    });

    return (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            left: particle.x,
            top: particle.y,
            transform: [{ translateY }],
            opacity,
          },
        ]}
      />
    );
  };

  const renderFloatingElement = (element: FloatingElement) => {
    const translateX = element.animatedValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, 10, -5, -8, 0],
    });

    const translateY = element.animatedValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -10, -15, 8, 0],
    });

    return (
      <Animated.View
        key={element.id}
        style={[
          styles.floatingElement,
          {
            left: element.x,
            top: element.y,
            transform: [{ translateX }, { translateY }],
          },
        ]}
      />
    );
  };

  return (
    <ScrollView style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.gradient}>
        {/* Background Particles */}
        {particles.map(renderParticle)}

        {/* Floating Elements */}
        {floatingElements.map(renderFloatingElement)}

        {/* Main Content */}
        <View style={styles.heroSection}>
          {/* Content */}
          <View style={styles.heroContent}>
            <Text style={styles.title}>Welcome to DriveSafeAI</Text>

            <Text style={styles.subtitle}>
              Revolutionizing road safety with cutting-edge AI technology. Our
              platform provides intelligent risk assessment, real-time safety
              monitoring, and smart insurance management to keep you protected on
              every journey.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleButtonPress('/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleButtonPress('/register')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.9}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🚗</Text>
                </View>
                <Text style={styles.featureTitle}>Smart Monitoring</Text>
                <Text style={styles.featureDescription}>
                  Real-time driving analysis and safety alerts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featureCard} activeOpacity={0.9}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🧠</Text>
                </View>
                <Text style={styles.featureTitle}>AI Risk Assessment</Text>
                <Text style={styles.featureDescription}>
                  Predictive safety scoring and recommendations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featureCard} activeOpacity={0.9}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🛡️</Text>
                </View>
                <Text style={styles.featureTitle}>Insurance Integration</Text>
                <Text style={styles.featureDescription}>
                  Seamless policy management and claims
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Visual */}
          <View style={styles.heroVisual}>
            <View style={styles.heroImage}>
              <Text style={styles.heroEmoji}>🤖</Text>
              <Text style={styles.heroImageText}>
                AI-Powered{'\n'}Driving Safety{'\n'}Technology
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    minHeight: height,
    position: 'relative',
    backgroundColor: '#667eea',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1.5,
  },
  floatingElement: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  heroSection: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 30,
  },
  heroContent: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontSize: Math.min(width * 0.08, 48),
    fontWeight: '700',
    marginBottom: 20,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
    lineHeight: Math.min(width * 0.09, 52),
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  primaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 20,
    marginTop: 20,
  },
  featureCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#4facfe',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  heroVisual: {
    flex: 1,
    marginTop: 30,
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#764ba2',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 20,
  },
  heroEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  heroImageText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
});

export default DriveSafeHomepage;