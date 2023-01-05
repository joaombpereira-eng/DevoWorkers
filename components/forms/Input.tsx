import {TextInput, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  isUserScreen: boolean;
  onChangeText: (text: string) => void;
  text: string;
};

export default function Input({isUserScreen, onChangeText, text}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder={isUserScreen ? 'Search By User' : 'Search by Project'}
        value={text}
        onChangeText={onChangeText}
      />
      <Icon name="search" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  text: {
    textAlign: 'left',
  },
});
