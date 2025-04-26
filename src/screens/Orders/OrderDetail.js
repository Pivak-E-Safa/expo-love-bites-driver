import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

// Dummy order items data
const dummyOrderItems = {
  '1': [
    { id: '1', name: 'Cheeseburger', quantity: 2, price: '$5.99' },
    { id: '2', name: 'French Fries', quantity: 1, price: '$2.99' },
    { id: '3', name: 'Coke', quantity: 1, price: '$1.99' },
  ],
  '2': [
    { id: '4', name: 'Chicken Sandwich', quantity: 1, price: '$6.99' },
    { id: '5', name: 'Onion Rings', quantity: 1, price: '$3.99' },
  ],
  '3': [
    { id: '6', name: 'Veggie Burger', quantity: 1, price: '$5.99' },
    { id: '7', name: 'Salad', quantity: 1, price: '$4.99' },
  ],
  '4': [
    { id: '8', name: 'Pizza', quantity: 1, price: '$12.99' },
    { id: '9', name: 'Garlic Bread', quantity: 1, price: '$3.99' },
  ],
  '5': [
    { id: '10', name: 'Pasta', quantity: 1, price: '$8.99' },
    { id: '11', name: 'Garlic Bread', quantity: 1, price: '$3.99' },
  ],
};

const OrderItem = ({ item }) => (
  <View style={styles.orderItem}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
  </View>
);

const OrderDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);

  const handleAction = () => {
    // In a real app, this would update the order status in the database
    console.log(`Action performed for order ${order.orderNumber}`);
  };

  useEffect(() => {
    const loadData = () => {
      try {
        if (route.params?.order) {
          const orderData = route.params.order;
          setOrder(orderData);
          setItems(dummyOrderItems[orderData.id] || []);
          setType(route.params.type);
        } else {
          console.warn('No order data provided');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [route.params]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BA6B28" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number:</Text>
              <Text style={styles.infoValue}>{order.orderNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer:</Text>
              <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{order.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{order.address}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
            <View style={styles.deliveryRow}>
              <Text style={styles.infoLabel}>Delivery Charges:</Text>
              <Text style={styles.infoValue}>{order.deliveryCharges}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>{order.amount}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {type === 'new' && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.pickupButton]}
                onPress={handleAction}
              >
                <Text style={styles.actionButtonText}>Mark as Picked up</Text>
              </TouchableOpacity>
            )}
            {type === 'inProgress' && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.deliverButton]}
                onPress={handleAction}
              >
                <Text style={styles.actionButtonText}>Mark as Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: '#BA6B28',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginRight: 5,
    marginLeft: 5,
  },
  orderItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BA6B28',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#8E8E93',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BA6B28',
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickupButton: {
    backgroundColor: '#F58B1F',
  },
  deliverButton: {
    backgroundColor: '#4BB653',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetail; 