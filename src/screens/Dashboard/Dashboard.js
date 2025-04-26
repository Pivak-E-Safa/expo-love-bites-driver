import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConfig';

const Dashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const OrderButton = ({ title, count, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonTitle}>{title}</Text>
      <Text style={styles.buttonCount}>{count} orders</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
                <Image 
                  source={require("../../../assets/logo.png")} 
                  style={styles.logo}
                  resizeMode="contain"
                />
        <View style={styles.content}>
          <OrderButton
            title="New Orders"
            count="2"
            onPress={() => navigation.navigate('NewOrders')}
          />
          <OrderButton
            title="In Progress"
            count="1"
            onPress={() => navigation.navigate('InProgressOrders')}
          />
          <OrderButton
            title="Delivered"
            count="2"
            onPress={() => navigation.navigate('DeliveredOrders')}
          />
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonTitle, styles.logoutButtonText]}>Logout</Text>
            <Text style={styles.buttonCount}>Sign out of your account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BA6B28',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  buttonCount: {
    fontSize: 15,
    color: '#8E8E93',
  },
  logoutButton: {
    marginTop: 'auto',
    borderColor: '#EC1E24',
  },
  logoutButtonText: {
    color: '#EC1E24',
  },
});

export default Dashboard; 