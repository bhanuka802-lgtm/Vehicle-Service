import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function CustomerFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      client.get(`/customers/${id}`).then(res => setFormData(res.data)).catch(err => console.log(err));
    }
  }, [id]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};
    if (!formData.name) { newErrors.name = 'Name is required'; valid = false; }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Valid email is required'; valid = false; }
    if (!formData.phone) { newErrors.phone = 'Phone is required'; valid = false; }
    if (!formData.address) { newErrors.address = 'Address is required'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (id) {
        await client.put(`/customers/${id}`, formData);
        Alert.alert('Success', 'Customer updated');
      } else {
        await client.post('/customers', formData);
        Alert.alert('Success', 'Customer created');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input 
        label="Full Name" 
        value={formData.name} 
        onChangeText={(txt) => handleChange('name', txt)} 
        error={errors.name} 
      />
      <Input 
        label="Email Address" 
        value={formData.email} 
        onChangeText={(txt) => handleChange('email', txt)} 
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email} 
      />
      <Input 
        label="Phone Number" 
        value={formData.phone} 
        onChangeText={(txt) => handleChange('phone', txt)} 
        keyboardType="phone-pad"
        error={errors.phone} 
      />
      <Input 
        label="Address" 
        value={formData.address} 
        onChangeText={(txt) => handleChange('address', txt)} 
        multiline
        error={errors.address} 
      />
      
      <Button 
        title={loading ? "Saving..." : (id ? "Update Customer" : "Add Customer")} 
        onPress={handleSubmit} 
        disabled={loading}
        style={styles.submitBtn} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#ffffff', flexGrow: 1 },
  submitBtn: { marginTop: 24 },
});
