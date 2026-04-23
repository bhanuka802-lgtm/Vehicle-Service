import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import client from '../../src/api/client';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function VehicleFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ customer: '', make: '', model: '', year: '', licensePlate: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      client.get(`/vehicles/${id}`).then(res => setFormData({...res.data, customer: res.data.customer?._id || res.data.customer })).catch(err => console.log(err));
    }
  }, [id]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (id) {
        await client.put(`/vehicles/${id}`, formData);
        Alert.alert('Success', 'Vehicle updated');
      } else {
        await client.post('/vehicles', formData);
        Alert.alert('Success', 'Vehicle created');
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
      {/* Real app would use a Picker/Dropdown for customer selection */}
      <Input label="Customer ID" value={formData.customer} onChangeText={(txt) => handleChange('customer', txt)} error={errors.customer} />
      <Input label="Make (e.g., Toyota)" value={formData.make} onChangeText={(txt) => handleChange('make', txt)} error={errors.make} />
      <Input label="Model (e.g., Camry)" value={formData.model} onChangeText={(txt) => handleChange('model', txt)} error={errors.model} />
      <Input label="Year" value={formData.year?.toString()} onChangeText={(txt) => handleChange('year', txt)} keyboardType="numeric" error={errors.year} />
      <Input label="License Plate" value={formData.licensePlate} onChangeText={(txt) => handleChange('licensePlate', txt)} autoCapitalize="characters" error={errors.licensePlate} />
      
      <Button title={loading ? "Saving..." : (id ? "Update Vehicle" : "Add Vehicle")} onPress={handleSubmit} disabled={loading} style={styles.submitBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#ffffff', flexGrow: 1 },
  submitBtn: { marginTop: 24 },
});
