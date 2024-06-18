import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  Animated,
} from 'react-native';

const SplashScreen = () => {
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateText = () => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    };

    animateText();
    return () => {
      textOpacity.setValue(0);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splashscreenbg.png')}
        resizeMode="cover"
        style={styles.image}>
        <StatusBar
          animated={true}
          backgroundColor="#192849"
          barStyle={'light-content'}
        />
        <Animated.Text
          style={[
            styles.text,
            {
              opacity: textOpacity,
              fontFamily: 'Pacifico-Regular',
            },
          ]}>
          Wavoo
        </Animated.Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 45,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default SplashScreen;
