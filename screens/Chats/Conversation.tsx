import {
  Alert,
  FlatList,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {ActivityIndicator, Avatar, Searchbar} from 'react-native-paper';
import axios from 'axios';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSocketContext} from '../../context/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../../context/AuthContext';
import {findUserByUsername} from '../../utils/findUsers';

const Conversation = ({navigation}: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  // const [activeUsers, setactiveUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {onlineUsers} = useSocketContext();
  const {setAuthUser} = useAuthContext();

  const handleOnPress = (item: any) => {
    navigation.navigate('Messages', {user: item});
  };

  const handleSearch = () => {
    let users = findUserByUsername(conversations, searchValue);
    setConversations(users);
  };

  const handleLogout = () => {
    Alert.alert('Wavoo', 'Are you sure you want to logout', [
      {
        text: 'No',
        onPress: () => {
          return false;
        },
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await axios.post('https://wavoo.onrender.com/api/auth/logout');
            await AsyncStorage.removeItem('chat-user');
            setAuthUser(null);
            navigation.navigate('Login');
          } catch (error) {
            Alert.alert('Could not log out', 'Try again later');
          }
        },
        style: 'cancel',
      },
    ]);
  };

  const getConversations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://wavoo.onrender.com/api/users');
      setConversations(res.data.data);
    } catch (error: any) {
      console.log(error?.response?.data.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // const getOnlineUsers = () => {
  //   if (conversations) {
  //     let users = conversations.filter(user => onlineUsers.includes(user?._id));
  //     setactiveUsers(users);
  //   }
  // };

  const handleRefresh = () => {
    setRefreshing(true);
    getConversations();
  };

  // useEffect(() => {
  //   getOnlineUsers();
  // }, [onlineUsers]);

  useEffect(() => {
    getConversations();
  }, []);

  const Users = ({item}: any) => {
    return (
      <>
        <TouchableOpacity onPress={() => handleOnPress(item)}>
          <View
            style={{
              borderWidth: 3,
              borderRadius: 50,
              borderColor: 'green',
            }}>
            <Avatar.Image
              size={60}
              source={{
                uri: item.profilePicture,
              }}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const Item = ({item}: any) => {
    return (
      <>
        <TouchableOpacity
          style={styles?.item}
          onPress={() => handleOnPress(item)}>
          <View
            style={[
              styles.container,
              onlineUsers.includes(item?._id) && {
                borderWidth: 3,
                borderRadius: 30,
                borderColor: 'green',
              },
            ]}>
            <Avatar.Image
              size={50}
              source={{
                uri: item.profilePicture,
              }}
            />
          </View>

          <View>
            <Text style={styles?.fullName}>{item?.fullName}</Text>
            <Text style={styles?.userName}>{'@' + item?.userName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
      </>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../assets/splashscreenbg.png')}
        resizeMode="cover"
        style={styles.image}>
        <StatusBar
          animated={true}
          backgroundColor="#192849"
          barStyle={'light-content'}
        />
        <Header>
          <View style={styles.headerWrapper}>
            <Text style={[styles.header,{fontFamily: 'Pacifico-Regular'}]}>Wavoo 👋</Text>
            <MCI
              name="exit-to-app"
              size={28}
              color="#fff"
              onPress={() => handleLogout()}
            />
          </View>
        </Header>
        {/* <View style={{paddingHorizontal: 20}}>
          <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>
            Active Users
          </Text>
        </View>
        {!loading && (
          <FlatList
            data={activeUsers}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 10,
            }}
            style={styles.activeusers}
            horizontal
            renderItem={({item}) => <Users item={item} />}
            keyExtractor={(item: any) => item?._id}
          />
        )} */}
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search"
            value={searchValue}
            onSubmitEditing={handleSearch}
            onChangeText={setSearchValue}
            onClearIconPress={getConversations}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FFF"
            style={{marginTop: '60%'}}
          />
        ) : (
          <FlatList
            style={styles.flatList}
            data={conversations}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={(item: any) => item?._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['black']}
              />
            }
          />
        )}
      </ImageBackground>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  headerWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    color: '#FFF',
    fontSize: 30
  },
  searchBar: {
    width: '100%',
    padding: 10,
  },
  flatList: {
    width: '100%',
    padding: 10,
  },
  item: {
    height: 70,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'lightgrey',
    opacity: 0.4,
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeusers: {
    maxHeight: 80,
  },
});
