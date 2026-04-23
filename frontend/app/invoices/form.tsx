import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function InvoiceFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ booking: '', amount: '', status: 'Unpaid', paymentMethod: 'None' });

  useEffect(() => {
    if (id) {
      client.get(`/invoices/${id}`).then(res => {
        setFormData({
          ...res.data,
          booking: res.data.booking?._id,
          amount: res.data.amount?.toString()
        });
      });
    }
  }, [id]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (id) await client.put(`/invoices/${id}`, formData);
      else await client.post('/invoices', formData);
      router.back();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Error');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#ffffff', flexGrow: 1 }}>
      <Input label="Booking ID" value={formData.booking} onChangeText={(txt) => handleChange('booking', txt)} />
      <Input label="Amount ($)" value={formData.amount} onChangeText={(txt) => handleChange('amount', txt)} keyboardType="numeric" />
      <Input label="Status (Unpaid, Paid)" value={formData.status} onChangeText={(txt) => handleChange('status', txt)} />
      <Input label="Payment Method (Cash, Credit Card, Online, None)" value={formData.paymentMethod} onChangeText={(txt) => handleChange('paymentMethod', txt)} />
      <Button title={id ? "Update" : "Add"} onPress={handleSubmit} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}
