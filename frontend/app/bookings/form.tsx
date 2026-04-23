import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function BookingFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ customer: '', vehicle: '', services: '', bookingDate: '', status: 'Pending' });

  useEffect(() => {
    if (id) {
      client.get(`/bookings/${id}`).then(res => {
        setFormData({
          ...res.data,
          customer: res.data.customer?._id,
          vehicle: res.data.vehicle?._id,
          services: res.data.services?.map(s => s._id).join(','),
          bookingDate: new Date(res.data.bookingDate).toISOString().split('T')[0]
        });
      });
    }
  }, [id]);

  const handleChange = (name, value) => {
    if (name === 'services') value = value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (id) await client.put(`/bookings/${id}`, formData);
      else await client.post('/bookings', formData);
      router.back();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#ffffff', flexGrow: 1 }}>
      <Input label="Customer ID" value={formData.customer} onChangeText={(txt) => handleChange('customer', txt)} />
      <Input label="Vehicle ID" value={formData.vehicle} onChangeText={(txt) => handleChange('vehicle', txt)} />
      <Input label="Services (comma separated IDs)" value={Array.isArray(formData.services) ? formData.services.join(',') : formData.services} onChangeText={(txt) => handleChange('services', txt)} />
      <Input label="Booking Date (YYYY-MM-DD)" value={formData.bookingDate} onChangeText={(txt) => handleChange('bookingDate', txt)} />
      <Input label="Status (Pending, Confirmed, Completed, Cancelled)" value={formData.status} onChangeText={(txt) => handleChange('status', txt)} />
      <Button title={id ? "Update" : "Add"} onPress={handleSubmit} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}
