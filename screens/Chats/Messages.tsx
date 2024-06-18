import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import Header from '../../components/Header';
import FA6 from 'react-native-vector-icons/FontAwesome6';
import FA from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {useAuthContext} from '../../context/AuthContext';
import moment from 'moment';
import {extractTime} from '../../utils/exportTims';
import useListenMessages from '../../hooks/useListenMessages';
import {useSocketContext} from '../../context/SocketContext';

const Messages = ({navigation, route}: {navigation: any; route: any}) => {
  let {fullName, profilePicture, _id} = route.params.user;
  const [loading, setLoading] = useState(false);
  const [messageLoading, setmessageLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const {authUser} = useAuthContext();
  const {onlineUsers} = useSocketContext();

  const flatListRef = useRef<FlatList<any>>(null);
  const ITEM_HEIGHT = 100;

  useListenMessages({messages, setMessages});

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({animated: true});
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [messages]);

  const handleMessage = async () => {
    setmessageLoading(true);
    try {
      const response = await axios.post(
        `https://wavoo.onrender.com/api/messages/send/${_id}`,
        {
          message: message.trim(),
        },
      );
      setMessages([...messages, response.data.data]);
      setMessage('');
    } catch (error) {
    } finally {
      setMessage('');
      setmessageLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = moment(dateString).utc().toDate(); 
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return moment(date).format('MMMM D, YYYY'); // Format using moment.js
    }
  };

  const Item = ({message, index}: {message: any; index: number}) => {
    const fromMe = message.senderId === authUser._id;
    const profilePic = fromMe ? authUser.profilePicture : profilePicture;
    const time = extractTime(message.createdAt);

    const date1 = message.createdAt;
    const date2 = index > 0 ? messages[index - 1].createdAt : null;

    const formattedDate =
      index === 0
        ? formatDate(message.createdAt)
        : formatDate(date1) === formatDate(date2)
        ? null
        : formatDate(message.createdAt);

    return (
      <>
        {formattedDate && (
          <View style={styles.dateComponent}>
            <Text style={{color: '#FFF', fontSize: 12, fontWeight: '600'}}>
              {formattedDate}
            </Text>
          </View>
        )}
        {fromMe ? (
          <View style={styles.fromMe}>
            <View style={{gap: 2}}>
              <View style={styles.fromMeChat}>
                <Text style={{color: '#FFF', fontWeight: '400', fontSize: 16}}>
                  {message.message}
                </Text>
              </View>
              <Text
                style={{alignSelf: 'flex-end', color: '#FFF', fontSize: 10}}>
                {time}
              </Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={30}
                source={{
                  uri: profilePic,
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.fromSender}>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={30}
                source={{
                  uri: profilePic,
                }}
              />
            </View>
            <View style={{gap: 2}}>
              <View style={styles.fromUserChat}>
                <Text style={{color: '#000', fontWeight: '400', fontSize: 16}}>
                  {message.message}
                </Text>
              </View>
              <Text
                style={{alignSelf: 'flex-start', color: '#FFF', fontSize: 10}}>
                {time}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://wavoo.onrender.com/api/messages/${_id}`,
        );
        setMessages(res.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [route.params.user]);

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
            <FA6
              name="angle-left"
              size={24}
              color="#fff"
              onPress={() => navigation.goBack()}
            />
            <View style={styles.user}>
              <Avatar.Image
                size={40}
                source={{
                  uri: profilePicture,
                }}
              />
              <View style={styles.content}>
                <Text style={styles.fullName}>{fullName}</Text>
                {onlineUsers.includes(_id) && (
                  <Text style={styles.active}>Active</Text>
                )}
              </View>
            </View>
          </View>
        </Header>
        <View style={{flex: 1}}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={{marginTop: '70%'}}
            />
          ) : messages.length ? (
            <FlatList
              style={styles.flatList}
              data={messages}
              ref={flatListRef}
              getItemLayout={(data, index) => {
                return {
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                };
              }}
              renderItem={({item, index}) => (
                <Item message={item} index={index} />
              )}
              keyExtractor={(item: any) => item._id}
              scrollEnabled
            />
          ) : (
            <View
              style={{width: '90%', alignItems: 'center', alignSelf: 'center'}}>
              <Text style={{fontSize: 12, color:"grey"}}>
                Why not break the ice with a quick hello?
              </Text>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={{
              borderWidth: 4,
              borderRadius: 30,
              height: 54,
              width: 54,
              justifyContent: 'center',
              paddingLeft: messageLoading ? 0 : 12,
              alignItems: messageLoading ? 'center' : 'flex-start',
              backgroundColor: '#FFF',
            }}
            onPress={handleMessage}>
            {!messageLoading ? (
              <FA name="send-o" size={20} color="#000000" />
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Messages;

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
    alignItems: 'center',
    gap: 15,
  },
  header: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
  },
  user: {
    flexDirection: 'row',
    gap: 15,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  active: {
    fontSize: 10,
    fontWeight: '600',
    color: 'green',
  },
  footer: {
    height: 62,
    width: '100%',
    position: 'absolute',
    bottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  input: {
    backgroundColor: 'black',
    borderRadius: 30,
    flex: 1,
    paddingHorizontal: 20,
    height: '90%',
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  flatList: {flex: 1, marginBottom: 65},
  fromMe: {
    padding: 5,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: '70%',
    alignSelf: 'flex-end',
    gap: 5,
  },
  avatarWrapper: {
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderRadius: 30,
    borderColor: '#A2AAB2',
  },
  fromMeChat: {
    minWidth: 50,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    backgroundColor: '#5068F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fromSender: {
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '70%',
    alignSelf: 'flex-start',
    gap: 5,
  },
  fromUserChat: {
    minWidth: 60,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: '#888',
  },
  dateComponent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#3B3B3B',
  },
  content: {
    justifyContent: 'center',
  },
});
