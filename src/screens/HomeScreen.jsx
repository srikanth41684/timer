import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [timersData, setTimersData] = useState([]);
  const intervalsRef = useRef({});
  const [expand, setExpand] = useState('');

  useEffect(() => {
    getTimersHandler();
  }, []);

  const getTimersHandler = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    let oldTimers = JSON.parse(savedTimers);
    console.log('savedTimers============>', JSON.parse(savedTimers));
    if (oldTimers) {
      setTimersData(oldTimers);
    }
  };

  const saveTimers = async updatedTimers => {
    setTimersData(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
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

  const startTimer = id => {
    setTimersData(prev =>
      prev.map(timer => {
        if (timer.id === id) {
          if (timer.status === 'Running') return timer;

          const interval = setInterval(() => {
            setTimersData(prevTimers => {
              const updatedTimers = prevTimers.map(t =>
                t.id === id && t.remainingTime > 0
                  ? {...t, remainingTime: t.remainingTime - 1}
                  : t,
              );

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

  useEffect(() => {
    console.log('timersData=========>', timersData);
  }, [timersData]);

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
        title="Wellcome"
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#EFF1FE',
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
                    backgroundColor: '#ffffff',
                    borderRadius: 12,
                    padding: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
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
                          color: '#000000',
                        }}>
                        {item?.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 23,
                          fontWeight: '500',
                          color: '#000000',
                        }}>
                        {formatTime(item?.remainingTime)}
                      </Text>
                    </View>
                    <View>
                      {expand === index ? (
                        <Icon
                          name={'keyboard-arrow-up'}
                          size={30}
                          color={'#000000'}
                        />
                      ) : (
                        <Icon
                          name={'keyboard-arrow-down'}
                          size={30}
                          color={'#000000'}
                        />
                      )}
                    </View>
                  </View>
                  {expand === index ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                        alignSelf: 'center',
                      }}>
                      {item?.status === 'Paused' ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            startTimer(item?.id);
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
                  ) : null}
                </View>
              </TouchableWithoutFeedback>
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
                fontSize: 18,
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
