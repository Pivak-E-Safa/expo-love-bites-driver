import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Title, Card } from 'react-native-paper';

const SignInPage = ( { promptAsync } ) => {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={require('../assets/logo.png')} // Replace with your logo image
        style={styles.logo}
      />

      {/* Title */}
      <Title style={styles.title}>Welcome to Expo Love Bites</Title>

      {/* Sign In Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>Please sign in to continue</Text>
        </Card.Content>

        {/* Google Sign In Button */}
        <Button
          icon="google"
          mode="contained"
          onPress={() => {
            promptAsync();
          }}
          style={styles.button}
        >
          Sign in with Google
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4285F4',
  },
});

export default SignInPage;
