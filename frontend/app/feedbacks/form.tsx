import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function FeedbackFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ customer: '', rating: '', comments: '' });

  useEffect(() => {
    if (id) {
      client.get(`/feedbacks/${id}`).then(res => {
        setFormData({
          ...res.data,
          customer: res.data.customer?._id,
          rating: res.data.rating?.toString()
        });
      });
    }
  }, [id]);

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    try {
      if (id) await client.put(`/feedbacks/${id}`, formData);
      else await client.post('/feedbacks', formData);
      router.back();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Error');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#ffffff', flexGrow: 1 }}>
      <Input label="Customer ID" value={formData.customer} onChangeText={(txt) => handleChange('customer', txt)} />
      <Input label="Rating (1-5)" value={formData.rating} onChangeText={(txt) => handleChange('rating', txt)} keyboardType="numeric" />
      <Input label="Comments" value={formData.comments} onChangeText={(txt) => handleChange('comments', txt)} multiline />
      <Button title={id ? "Update" : "Add"} onPress={handleSubmit} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}
