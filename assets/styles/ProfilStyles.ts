import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  editButton: {
    backgroundColor: colors[7] || '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },  
});

export default styles;
