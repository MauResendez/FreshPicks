import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";

const Splash = () => {
	const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 250,
          height: 250,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../../assets/splash.json')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});

export default Splash