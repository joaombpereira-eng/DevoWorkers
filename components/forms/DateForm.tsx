import {View, Text, StyleSheet, Pressable} from 'react-native';
import IconButton from '../buttons/IconButton';
import DatePicker from 'react-native-date-picker';

type Props = {
  info: string;
  value: string;
  open: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  onPressButton: () => void;
};

export default function DateForm({
  info,
  value,
  open,
  date,
  onConfirm,
  onCancel,
  onPressButton,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.button}>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={onConfirm}
          onCancel={onCancel}
          mode="date"
        />
      </View>
      <Pressable style={styles.valueContainer} onPress={onPressButton}>
        <Text style={styles.value}>{value}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 1,
  },
  button: {
    marginRight: 10,
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
