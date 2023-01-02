import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import Input from '../../components/forms/Input';
import {ProjectData, projects} from '../../data/projects';
import ProjectCard from '../../components/cards/ProjectCard';
import {useEffect, useState} from 'react';
import {status} from '../../data/status';
import IconButton from '../../components/buttons/IconButton';

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

  useEffect(() => {
    setFilteredData(projects);
  }, [projects]);

  function onPressHandler(type: number) {
    const newData = projects.filter(item => {
      return item.status.id === type;
    });
    setFilteredData(newData);
  }

  function date() {
    if (!nameSort) {
      const dateSort = filteredData.sort((a, b) => {
        if (dateAscending) {
          return new Date(a.startingDate) > new Date(b.startingDate) ? 1 : -1;
        } else {
          return new Date(a.startingDate) < new Date(b.startingDate) ? 1 : -1;
        }
      });
      return dateSort;
    } else {
      const nameSort = filteredData.sort((a, b) => {
        if (nameAscending) {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } else {
          return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
        }
      });
      return nameSort;
    }
  }

  function lengthDataFiltered(type: number) {
    const dataFiltered = projects.filter(project => {
      return project.status.id === type;
    });
    return dataFiltered.length;
  }

  function searchFilter(text: string) {
    if (text) {
      const newData = filteredData.filter(item => {
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
  }

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
                onPress={() => {
                  setNameAscending(!nameAscending);
                  setNameSort(true);
                }}
              />
            ) : (
              <IconButton
                name="sort-alpha-desc"
                size={25}
                color={'black'}
                onPress={() => {
                  setNameAscending(!nameAscending);
                  setNameSort(true);
                }}
              />
            )}
          </View>
          <View style={styles.sort}>
            {dateAscending ? (
              <IconButton
                name="sort-amount-asc"
                size={25}
                color="black"
                onPress={() => {
                  setDateAscending(!dateAscending);
                  setNameSort(false);
                }}
              />
            ) : (
              <IconButton
                name="sort-amount-desc"
                size={25}
                color="black"
                onPress={() => {
                  setDateAscending(!dateAscending);
                  setNameSort(false);
                }}
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
        <TouchableOpacity onPress={() => onPressHandler(status[0].id)}>
          <Text style={styles.filter}>
            To Start ({lengthDataFiltered(status[0].id)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressHandler(status[1].id)}>
          <Text style={styles.filter}>
            Active ({lengthDataFiltered(status[1].id)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressHandler(status[2].id)}>
          <Text style={styles.filter}>
            Finished ({lengthDataFiltered(status[2].id)})
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
