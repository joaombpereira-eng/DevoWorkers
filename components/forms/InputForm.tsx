import {View, Text, StyleSheet, TextInput} from 'react-native';

type Props = {
  info: string;
  text: string;
  onChangeText: (text: string) => void;
  isBirthday: boolean;
};

export default function InputForm({
  info,
  text,
  onChangeText,
  isBirthday,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.valueContainer}>
        <TextInput
          style={styles.value}
          placeholder={isBirthday ? 'DD/MM/YYYY' : ''}
          value={text}
          onChangeText={onChangeText}
        />
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
    paddingVertical: 12,
  },
  info: {
    color: 'black',
    fontSize: 16,
  },
  valueContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
  },
  value: {
    color: 'black',
    fontSize: 16,
  },
});
