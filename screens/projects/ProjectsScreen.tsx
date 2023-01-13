import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Input from '../../components/forms/Input';
import IconButton from '../../components/buttons/IconButton';
import ProjectCard from '../../components/cards/ProjectCard';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';
import {ProjectData} from '../../data/projects';

export type ProjectsScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Projects'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProjectsScreen() {
  const [filteredData, setFilteredData] = useState<ProjectData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [dateAscending, setDateAscending] = useState<boolean>(false);
  const [nameAscending, setNameAscending] = useState<boolean>(true);
  const [nameSort, setNameSort] = useState<boolean>(true);
  const {projects} = useSelector(selectProjects);

  const onTypePress = (type: string) => {
    const newData = projects.filter(item => {
      return item.status === type;
    });
    if (newData.length === 0) {
      setFilteredData([]);
    } else {
      setFilteredData(newData);
    }
  };

  const date = () => {
    if (!nameSort) {
      let dateSorted =
        filteredData !== projects && filteredData.length !== 0
          ? [...filteredData]
          : [...projects];
      dateSorted = dateSorted.sort((a, b) => {
        if (dateAscending) {
          return a.startDate > b.startDate ? 1 : -1;
        } else {
          return a.startDate < b.startDate ? 1 : -1;
        }
      });
      return dateSorted;
    } else {
      let nameSorted =
        filteredData !== projects && filteredData.length !== 0
          ? [...filteredData]
          : [...projects];
      nameSorted = nameSorted.sort((a, b) => {
        if (nameAscending) {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } else {
          return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
        }
      });
      return nameSorted;
    }
  };

  const lengthDataFiltered = (type: string) => {
    const dataFiltered = projects.filter(project => {
      return project.status === type;
    });
    return dataFiltered.length;
  };

  const searchFilter = (text: string) => {
    if (text) {
      const newData = projects.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(projects);
      setSearch(text);
    }
  };

  const onSortAlphaIconPress = () => {
    setNameAscending(!nameAscending);
    setNameSort(true);
  };

  const onSortAmountIconPress = () => {
    setDateAscending(!dateAscending);
    setNameSort(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Projects</Text>
        <View style={styles.sortContainer}>
          <View style={styles.sort}>
            {nameAscending ? (
              <IconButton
                name="sort-alpha-asc"
                size={25}
                color="black"
                onPress={onSortAlphaIconPress}
              />
            ) : (
              <IconButton
                name="sort-alpha-desc"
                size={25}
                color={'black'}
                onPress={onSortAlphaIconPress}
              />
            )}
          </View>
          <View style={styles.sort}>
            {dateAscending ? (
              <IconButton
                name="sort-amount-asc"
                size={25}
                color="black"
                onPress={onSortAmountIconPress}
              />
            ) : (
              <IconButton
                name="sort-amount-desc"
                size={25}
                color="black"
                onPress={onSortAmountIconPress}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => {
            setFilteredData(projects);
          }}>
          <Text style={styles.filter}>All ({projects.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTypePress('ToStart')}>
          <Text style={styles.filter}>
            To Start ({lengthDataFiltered('ToStart')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTypePress('Active')}>
          <Text style={styles.filter}>
            Active ({lengthDataFiltered('Active')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTypePress('Finished')}>
          <Text style={styles.filter}>
            Finished ({lengthDataFiltered('Finished')})
          </Text>
        </TouchableOpacity>
      </View>
      <Input isUserScreen={false} onChangeText={searchFilter} text={search} />
      <View style={styles.bodyContainer}>
        <FlatList
          data={date()}
          renderItem={({item}) => <ProjectCard {...item} />}
          keyExtractor={item => item.projectId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe7c2',
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    height: '15%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  bodyContainer: {
    backgroundColor: '#EFEDEC',
    flex: 1,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sort: {
    marginLeft: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filter: {
    color: 'black',
    fontSize: 16,
  },
});
