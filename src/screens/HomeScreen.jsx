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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [timersData, setTimersData] = useState([]);
  const intervalsRef = useRef({});

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

  function objectToSeconds(timeObj) {
    return timeObj.hours * 3600 + timeObj.minutes * 60 + timeObj.seconds;
  }

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
            setTimersData(prevTimers =>
              prevTimers.map(t => {
                if (t.id === id) {
                  if (t.remainingTime > 0) {
                    return {...t, remainingTime: t.remainingTime - 1};
                  } else {
                    clearInterval(intervalsRef.current[id]);
                    return {...t, status: 'Completed'};
                  }
                }
                return t;
              }),
            );
          }, 1000);

          intervalsRef.current[id] = interval;
          return {...timer, status: 'Running'};
        }
        return timer;
      }),
    );
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
          renderItem={({item}) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  startTimer(item?.id);
                }}>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 12,
                    padding: 15,
                  }}>
                  <View>
                    <Text>{item?.name}</Text>
                    <Text>{formatTime(item?.remainingTime)}</Text>
                  </View>
                  <View></View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            AsyncStorage.clear();
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#3D4AEE',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
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
