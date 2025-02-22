import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const {theme, setTheme} = useContext(AppThemeContext);
  const [timersData, setTimersData] = useState([]);
  const intervalsRef = useRef({});
  const [expand, setExpand] = useState('');
  const [completedData, setCompletedData] = useState(null);

  // useEffect(() => {
  //   getTimersHandler();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused (returned to this screen)');
      getTimersHandler(); // Call your function here

      return () => {
        console.log('Screen is unfocused (navigating away)');
      };
    }, []),
  );

  const getTimersHandler = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    let oldTimers = JSON.parse(savedTimers);
    console.log('savedTimers============>', JSON.parse(savedTimers));
    if (oldTimers) {
      setTimersData(oldTimers);
    }
  };

  const completedDataHandler = async () => {
    if (completedData) {
      const data = await AsyncStorage.getItem('history');
      let finalData = JSON.parse(data);
      if (finalData) {
        AsyncStorage.setItem(
          'history',
          JSON.stringify([...finalData, completedData]),
        );
      } else {
        AsyncStorage.setItem('history', JSON.stringify([...completedData]));
      }
    }
  };

  useEffect(() => {
    completedDataHandler();
  }, [completedData]);

  const saveTimers = async updatedTimers => {
    let data = [];
    if (updatedTimers) {
      updatedTimers?.filter(item => {
        if (item?.status === 'Completed') {
          setCompletedData(item);
        } else {
          data.push(item);
        }
      });
    }

    console.log('data=========>', data);

    setTimersData(data);
    await AsyncStorage.setItem('timers', JSON.stringify(data));
    getTimersHandler();
    console.log('data=========>************', data);
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
  };

  const startTimer = id => {
    setTimersData(prev =>
      prev.map(timer => {
        if (timer.id === id) {
          if (timer.status === 'Running') return timer;

          const interval = setInterval(() => {
            setTimersData(prevTimers => {
              const updatedTimers = prevTimers.map(t => {
                if (t.id === id) {
                  if (t.remainingTime > 0) {
                    return {...t, remainingTime: t.remainingTime - 1};
                  } else {
                    return {...t, status: 'Completed'};
                  }
                } else {
                  return t;
                }
              });

              saveTimers(updatedTimers);
              return updatedTimers;
            });
          }, 1000);

          intervalsRef.current[id] = interval;
          return {...timer, status: 'Running'};
        }
        return timer;
      }),
    );
  };

  const pauseTimer = id => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }

    setTimersData(prev => {
      const updatedTimers = prev.map(timer =>
        timer.id === id ? {...timer, status: 'Paused'} : timer,
      );

      saveTimers(updatedTimers); // Save the paused state
      return updatedTimers;
    });
  };

  const resetTimer = id => {
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

      saveTimers(updatedTimers); // Save reset state
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

  useEffect(() => {
    console.log('timersData===========>', timersData, theme);
  }, [timersData, theme]);

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
          padding: 20,
        }}>
        <FlatList
          data={timersData}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 10,
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
                    if (expand === '' || index !== expand) {
                      setExpand(index);
                    } else {
                      setExpand('');
                    }
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingBottom: expand === index ? 20 : 0,
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
                    <View>
                      {expand === index ? (
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
                {expand === index ? (
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
                            pauseTimer(item?.id);
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
                            <Icon name={'pause'} size={30} color={'#000000'} />
                          </View>
                        </TouchableWithoutFeedback>
                      ) : null}
                      <TouchableWithoutFeedback
                        onPress={() => {
                          resetTimer(item?.id);
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
              alignSelf: 'flex-end',
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
