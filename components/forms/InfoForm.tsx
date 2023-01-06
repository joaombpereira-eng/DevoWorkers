import {View, Text, StyleSheet} from 'react-native';

type Props = {
  info: string;
  value?: string;
};

export default function InfoForm({info, value}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 1,
  },
  infoContainer: {
    paddingVertical: 14,
  },
  info: {
    color: 'black',
    fontSize: 18,
  },
  valueContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  value: {
    color: 'black',
    fontSize: 16,
  },
});
