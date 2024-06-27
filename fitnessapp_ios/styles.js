import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2c3e50',
  },
  footerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f4f6f8',
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    width: Dimensions.get('window').width, // Use width for landscape
    height: Dimensions.get('window').height - 100, // Use height for landscape, adjusted
  },
  graphContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    position: 'absolute', // Ensure the container takes up the full screen
    top: 0,
    left: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  statText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
  },
  exerciseName: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1e69de',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  rotateText: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});

export default styles;
