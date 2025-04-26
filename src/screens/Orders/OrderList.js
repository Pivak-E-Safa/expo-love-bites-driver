import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Dummy data for orders
const dummyOrders = {
  new: [
    {
      id: '1',
      orderNumber: '#12345',
      customerName: 'John Doe',
      address: '123 Main St, City',
      amount: '$25.99',
      time: '10:30 AM',
      deliveryCharges: '150',
    },
    {
      id: '2',
      orderNumber: '#12346',
      customerName: 'Jane Smith',
      address: '456 Oak Ave, Town',
      amount: '$32.50',
      time: '11:15 AM',
      deliveryCharges: '150',
    },
  ],
  inProgress: [
    {
      id: '3',
      orderNumber: '#12347',
      customerName: 'Mike Johnson',
      address: '789 Pine Rd, Village',
      amount: '$18.75',
      time: '12:00 PM',
      deliveryCharges: '150',
    },
  ],
  delivered: [
    {
      id: '4',
      orderNumber: '#12348',
      customerName: 'Sarah Wilson',
      address: '321 Elm St, County',
      amount: '$45.20',
      time: '9:00 AM',
      deliveryCharges: '150',
    },
    {
      id: '5',
      orderNumber: '#12349',
      customerName: 'David Brown',
      address: '654 Maple Dr, State',
      amount: '$28.90',
      time: '8:30 AM',
      deliveryCharges: '150',
    },
  ],
};

const OrderCard = ({ order, type }) => {
  const navigation = useNavigation();
  
  const handleAction = () => {
    // In a real app, this would update the order status in the database
    console.log(`Action performed for order ${order.orderNumber}`);
  };
  
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.orderTime}>{order.time}</Text>
        </View>
      </View>
      <Text style={styles.address}>{order.address}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.amount}>{order.amount}</Text>
        <View style={styles.buttonContainer}>
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
          <TouchableOpacity 
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => navigation.navigate('OrderDetail', { order, type })}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const OrderList = ({ route }) => {
  const navigation = useNavigation();
  const { type } = route.params;
  const orders = dummyOrders[type];
  const title = type === 'new' ? 'New Orders' : type === 'inProgress' ? 'In Progress' : 'Delivered';

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
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} type={type} />}
          contentContainerStyle={styles.listContainer}
        />
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
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#BA6B28',
    marginBottom: 4,
  },
  timeContainer: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    height: 24
  },
  orderTime: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  customerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  address: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  amount: {
    fontSize: 17,
    fontWeight: '600',
    color: '#BA6B28',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pickupButton: {
    backgroundColor: '#F58B1F',
  },
  deliverButton: {
    backgroundColor: '#4BB653',
  },
  detailsButton: {
    backgroundColor: '#BA6B28',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OrderList; 