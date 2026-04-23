import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import client from '../../src/api/client';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';

export default function ServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const response = await client.get('/services');
    setServices(response.data);
  };
  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id) => {
    await client.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Button title="+ Add" onPress={() => router.push('/services/form')} style={styles.addButton} />
      </View>
      <FlatList
        data={services}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Price: ${item.price} - Duration: {item.durationMinutes} mins</Text>
            <Text style={styles.detail}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/services/form', params: { id: item._id } })}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { paddingVertical: 8, paddingHorizontal: 16, marginVertical: 0 },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  detail: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  editBtn: { color: '#4F46E5', fontWeight: '600', marginRight: 16 },
  deleteBtn: { color: '#EF4444', fontWeight: '600' },
});
