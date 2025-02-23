import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  LogBox,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Header} from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppThemeContext} from '../context/AppThemeContext';
import notifee from '@notifee/react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {theme, setTheme} = useContext(AppThemeContext);
  const [timersData, setTimersData] = useState([]);
  const intervalsRef = useRef({});
  const [expand, setExpand] = useState([]);
  const [completedData, setCompletedData] = useState(null);
  const [showModel, setShowModel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused (returned to this screen)');
      getTimersHandler();

      return () => {
        console.log('Screen is unfocused (navigating away)');
      };
    }, []),
  );

  const getTimersHandler = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    let oldTimers = JSON.parse(savedTimers);

    if (oldTimers) {
      setTimersData(oldTimers);
    }
  };

  const completedDataHandler = async () => {
    if (completedData) {
      const data = await AsyncStorage.getItem('history');
      let finalData = JSON.parse(data);
      let history = finalData ? [...finalData, completedData] : [completedData];

      AsyncStorage.setItem('history', JSON.stringify(history));
    }
  };

  useEffect(() => {
    completedDataHandler();
  }, [completedData]);

  const saveTimers = async updatedTimers => {
    let data = [];
    if (updatedTimers) {
      updatedTimers?.filter(item => {
        let date = new Date();
        if (item?.status === 'Completed') {
          setCompletedData({...item, completedAt: date});
          setShowModel(true);
        } else {
          data.push(item);
        }
      });
    }

    setTimersData(data);
    await AsyncStorage.setItem('timers', JSON.stringify(data));
    getTimersHandler();
  };

  const formatTime = totalSeconds => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0',
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const startTimerHandler = id => {
    const interval = setInterval(() => {
      setTimersData(prevData => {
        let shouldClearInterval = false;

        const updatedTimers = prevData?.map(timer => {
          if (timer?.id === id) {
            if (timer?.remainingTime === 5) {
              onDisplayNotification(timer);
            }
            if (timer?.remainingTime > 0) {
              return {
                ...timer,
                remainingTime: timer?.remainingTime - 1,
                status: 'Running',
              };
            } else {
              shouldClearInterval = true;
              return {
                ...timer,
                status: 'Completed',
              };
            }
          }
          return timer;
        });

        saveTimers(updatedTimers);
        if (shouldClearInterval) {
          clearInterval(interval);
        }

        return updatedTimers;
      });
    }, 1000);
    intervalsRef.current[id] = interval;
  };

  const pauseTimerHandler = id => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }

    setTimersData(prev => {
      const updatedTimers = prev.map(timer =>
        timer.id === id ? {...timer, status: 'Paused'} : timer,
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const resetTimerHandler = id => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }

    setTimersData(prev => {
      const updatedTimers = prev.map(timer =>
        timer.id === id
          ? {...timer, remainingTime: timer.duration, status: 'Paused'}
          : timer,
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const getProgress = (duration, remainingTime) => {
    return Math.round(((duration - remainingTime) / duration) * 100);
  };

  const themeHandler = async val => {
    AsyncStorage.setItem('theme', val);
    setTheme(val);
  };

  async function onDisplayNotification(value) {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: `Timer-${value?.category}`,
      body: `Only 5 Seconds left to Complete Your ${value?.name} task`,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const expandHandler = index => {
    let arr = [];
    if (expand?.includes(index)) {
      expand.filter(item => {
        if (item !== index) {
          arr.push(item);
        }
      });
    } else {
      arr.push(...expand, index);
    }
    setExpand(arr);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Header
        headerLeft={() => (
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'lightgray',
              borderRadius: 50,
              marginLeft: 20,
              marginRight: 10,
            }}></View>
        )}
        headerStyle={{
          backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
        }}
        headerTitleStyle={{
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }}
        title="Wellcome"
        headerRight={() => (
          <View
            style={{
              paddingRight: 20,
            }}>
            {theme === 'dark' ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  themeHandler('light');
                }}>
                <View
                  style={{
                    backgroundColor: '#E4E4FF',
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={'light-mode'}
                    size={30}
                    color={theme === 'dark' ? '#121212' : '#EFF1FE'}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  themeHandler('dark');
                }}>
                <View
                  style={{
                    backgroundColor: '#E4E4FF',
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name={'dark-mode'} size={25} color={'#000000'} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: theme === 'dark' ? '#121212' : '#EFF1FE',
          paddingHorizontal: 20,
        }}>
        {timersData?.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: theme === 'dark' ? '#ffffff' : '#000000',
                fontWeight: 'bold',
              }}>
              No Active Timers
            </Text>
          </View>
        ) : null}
        {showModel ? (
          <Modal transparent={true} animationType="fade">
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: '70%',
                  // height: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  gap: 15,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'blue',
                    fontWeight: 'bold',
                  }}>
                  Congratulation
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'green',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {completedData?.name} is Completed
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShowModel(false);
                  }}>
                  <View
                    style={{
                      backgroundColor: 'blue',
                      paddingHorizontal: 40,
                      paddingVertical: 10,
                      borderRadius: 12,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#ffffff',
                        fontWeight: 'bold',
                      }}>
                      OK
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
        ) : null}

        {timersData?.length > 0 ? (
          <FlatList
            data={timersData}
            contentContainerStyle={{
              gap: 20,
              paddingVertical: 30,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
                    borderRadius: 12,
                    padding: 15,
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      expandHandler(index);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: expand?.includes(index) ? 20 : 0,
                      }}>
                      <View
                        style={{
                          gap: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 23,
                            fontWeight: '500',
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                          }}>
                          {item?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 23,
                            fontWeight: '500',
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                          }}>
                          {formatTime(item?.remainingTime)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'green',
                            }}>
                            {item?.category}
                          </Text>
                        </View>
                        {expand?.includes(index) ? (
                          <Icon
                            name={'keyboard-arrow-up'}
                            size={30}
                            color={theme === 'dark' ? '#ffffff' : '#000000'}
                          />
                        ) : (
                          <Icon
                            name={'keyboard-arrow-down'}
                            size={30}
                            color={theme === 'dark' ? '#ffffff' : '#000000'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  {expand?.includes(index) ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 20,
                        paddingBottom: 5,
                        borderTopWidth: 1,
                        borderColor: 'lightgray',
                        justifyContent: 'space-between',
                        gap: 15,
                      }}>
                      <View
                        style={{
                          width: '65%',
                          gap: 5,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: 15,
                            backgroundColor: '#EFF1FE',
                            borderRadius: 50,
                            justifyContent: 'center',
                            paddingLeft: 3,
                            paddingRight: 3,
                          }}>
                          <View
                            style={{
                              width: `${getProgress(
                                item?.duration,
                                item?.remainingTime,
                              )}%`,
                              height: 10,
                              backgroundColor: '#067AF8',
                              borderRadius: 50,
                            }}></View>
                        </View>
                        <Text
                          style={{
                            fontSize: 18,
                            lineHeight: 25,
                            fontWeight: 'bold',
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                          }}>
                          {getProgress(item?.duration, item?.remainingTime)}%
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 15,
                        }}>
                        {item?.status !== 'Running' ? (
                          <TouchableWithoutFeedback
                            onPress={() => {
                              startTimerHandler(item?.id);
                            }}>
                            <View
                              style={{
                                backgroundColor: '#E4E4FF',
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                name={'play-arrow'}
                                size={30}
                                color={'#000000'}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        ) : null}

                        {item?.status === 'Running' ? (
                          <TouchableWithoutFeedback
                            onPress={() => {
                              pauseTimerHandler(item?.id);
                            }}>
                            <View
                              style={{
                                backgroundColor: '#E4E4FF',
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                name={'pause'}
                                size={30}
                                color={'#000000'}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        ) : null}
                        <TouchableWithoutFeedback
                          onPress={() => {
                            resetTimerHandler(item?.id);
                          }}>
                          <View
                            style={{
                              backgroundColor: '#E4E4FF',
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Icon
                              name={'restart-alt'}
                              size={30}
                              color={'#000000'}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        ) : null}

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('createTimer');
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#3D4AEE',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 20,
              right: 20,
            }}>
            <Text
              style={{
                fontSize: 26,
                lineHeight: 25,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
              +
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
