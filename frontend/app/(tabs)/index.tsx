import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  const modules = [
    { title: 'Customers', path: '/customers', icon: '👤', desc: 'Manage your client base' },
    { title: 'Vehicles', path: '/vehicles', icon: '🚗', desc: 'Vehicle registry & details' },
    { title: 'Services', path: '/services', icon: '🔧', desc: 'Service offerings & pricing' },
    { title: 'Bookings', path: '/bookings', icon: '📅', desc: 'Schedule & track jobs' },
    { title: 'Invoices', path: '/invoices', icon: '💰', desc: 'Payments & billing' },
    { title: 'Feedback', path: '/feedbacks', icon: '⭐', desc: 'Customer reviews' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Center</Text>
        <Text style={styles.subtitle}>Management Dashboard</Text>
      </View>
      
      <View style={styles.grid}>
        {modules.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(item.path)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Tailwind gray-100
  },
  header: {
    padding: 24,
    backgroundColor: '#4F46E5', // Indigo-600
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    marginTop: 4,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
