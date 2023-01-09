import {View, StyleSheet, Text} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigator/RootNavigator';

type EditUserScreenRouteProps = RouteProp<RootStackParamList, 'EditUser'>;

export default function EditUser() {
  const {
    params: {user},
  } = useRoute<EditUserScreenRouteProps>();
  return (
    <View style={styles.container}>
      <Text>{`Edit User ${user?.name}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
