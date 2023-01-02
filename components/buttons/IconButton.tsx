import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  name: string;
  size: number;
  color: string;
  onPress: () => void;
};

export default function IconButton({name, size, color, onPress}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={name} color={color} size={size} />
    </TouchableOpacity>
  );
}
