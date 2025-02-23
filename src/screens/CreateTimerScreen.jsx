import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TimerPickerModal} from 'react-native-timer-picker';
import DropdownSelect from '../components/DropdownSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const CreateTimerScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState('Select an option');

  function objectToSeconds(timeObj) {
    return timeObj.hours * 3600 + timeObj.minutes * 60 + timeObj.seconds;
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  const createTimerHandler = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    let oldTimers = JSON.parse(savedTimers);

    const timer = {
      id: uuidv4(),
      name: name,
      duration: objectToSeconds(time),
      remainingTime: objectToSeconds(time),
      category: category,
      status: 'Paused',
    };

    if (oldTimers) {
      await AsyncStorage.setItem(
        'timers',
        JSON.stringify([...oldTimers, timer]),
      );
    } else {
      await AsyncStorage.setItem('timers', JSON.stringify([timer]));
    }
    navigation.goBack();
    console.log('timer===========>', timer);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: 'space-between',
          backgroundColor: '#EFF1FE',
        }}>
        <View
          style={{
            flex: 1,
            gap: 20,
          }}>
          <TextInput
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 10,
              paddingHorizontal: 15,
            }}
            placeholder="Enter timer name..."
            value={name}
            onChangeText={e => {
              setName(e);
            }}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              setShow(true);
            }}>
            <View
              style={{
                paddingVertical: 14,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 15,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  color: '#000000',
                  fontWeight: '400',
                }}>
                {time.hours || time.minutes || time.seconds
                  ? `Selected Time: ${time.hours}h ${time.minutes}m ${time.seconds}s`
                  : 'Select Duration'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TimerPickerModal
            visible={show}
            setIsVisible={setShow}
            onCancel={() => {
              setShow(false);
              setTime({hours: 0, minutes: 0, seconds: 0});
            }}
            onDismiss={() => {
              setShow(false);
              setTime({hours: 0, minutes: 0, seconds: 0});
            }}
            onConfirm={newTime => {
              setTime(newTime);
              setShow(false);
            }}
            hours={time.hours}
            minutes={time.minutes}
            seconds={time.seconds}
          />
          <DropdownSelect category={category} setCategory={setCategory} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (name !== '' && category !== 'Select an option' && time) {
              createTimerHandler();
            }
          }}>
          <View
            style={{
              backgroundColor: '#000000',
              borderRadius: 25,
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 23,
                color: '#ffffff',
                fontWeight: 'bold',
              }}>
              Add Timers
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default CreateTimerScreen;
