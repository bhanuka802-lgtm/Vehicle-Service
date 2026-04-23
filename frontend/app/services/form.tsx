import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function ServiceFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', durationMinutes: '' });

  useEffect(() => {
    if (id) client.get(`/services/${id}`).then(res => setFormData({...res.data, price: res.data.price?.toString(), durationMinutes: res.data.durationMinutes?.toString()}));
  }, [id]);

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    if (id) await client.put(`/services/${id}`, formData);
    else await client.post('/services', formData);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#ffffff', flexGrow: 1 }}>
      <Input label="Name" value={formData.name} onChangeText={(txt) => handleChange('name', txt)} />
      <Input label="Description" value={formData.description} onChangeText={(txt) => handleChange('description', txt)} />
      <Input label="Price" value={formData.price} onChangeText={(txt) => handleChange('price', txt)} keyboardType="numeric" />
      <Input label="Duration (minutes)" value={formData.durationMinutes} onChangeText={(txt) => handleChange('durationMinutes', txt)} keyboardType="numeric" />
      <Button title={id ? "Update" : "Add"} onPress={handleSubmit} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}
