import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import client from '../../src/api/client';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';

export default function CustomersScreen() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await client.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await client.delete(`/customers/${id}`);
          fetchCustomers();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete customer');
        }
      }}
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <Button title="+ Add New" onPress={() => router.push('/customers/form')} style={styles.addButton} />
      </View>

      <FlatList
        data={customers}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.detail}>{item.email}</Text>
            <Text style={styles.detail}>{item.phone}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/customers/form', params: { id: item._id } })}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No customers found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  addButton: { paddingVertical: 8, paddingHorizontal: 16, marginVertical: 0 },
  name: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  detail: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  editBtn: { color: '#4F46E5', fontWeight: '600', marginRight: 16 },
  deleteBtn: { color: '#EF4444', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6B7280' },
});
