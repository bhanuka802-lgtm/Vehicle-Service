import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import client from '../../src/api/client';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';

export default function FeedbacksScreen() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    const res = await client.get('/feedbacks');
    setFeedbacks(res.data);
  };
  useEffect(() => { fetchFeedbacks(); }, []);

  const handleDelete = async (id) => {
    await client.delete(`/feedbacks/${id}`);
    fetchFeedbacks();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedbacks</Text>
        <Button title="+ Add" onPress={() => router.push('/feedbacks/form')} style={styles.addButton} />
      </View>
      <FlatList
        data={feedbacks}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.name}>{item.customer?.name}</Text>
              <Text style={{ fontWeight: 'bold', color: '#F59E0B' }}>{item.rating}/5 ⭐</Text>
            </View>
            <Text style={styles.detail}>"{item.comments}"</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/feedbacks/form', params: { id: item._id } })}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
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
  detail: { fontSize: 14, color: '#4B5563', marginBottom: 2, fontStyle: 'italic' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  editBtn: { color: '#4F46E5', fontWeight: '600', marginRight: 16 },
  deleteBtn: { color: '#EF4444', fontWeight: '600' },
});
