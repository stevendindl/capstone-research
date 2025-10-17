import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { Text, Button } from 'react-native-paper'
import { router } from 'expo-router'

const Welcome = () => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/gymprobro.png')}
          style={styles.backgroundImage}
        />
      </View>
     
      {/* Content */}
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.welcomeText}>
          Welcome to...
        </Text>
        <Text variant="displayMedium" style={styles.titleText}>
          GYM PRO BRO
        </Text>
        <Text>
          Track your gym progress bro.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => router.push('/(onboard)/signup')}
          >
            Create an Account
          </Button>
          <Button 
            mode="elevated" 
            style={styles.button}
            onPress={() => router.push('/(onboard)/signin')}
          >
            Login
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    opacity: 0.4
  },
  backgroundImage: {
    height: '100%',
    width: '260%',
    left: '-155.67%'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 10,
  },
})

export default Welcome