import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AppThemeContext} from '../context/AppThemeContext';
import {Header} from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const {theme, setTheme} = useContext(AppThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused (returned to this screen)');
      getHistoryHandler(); // Call your function here

      return () => {
        console.log('Screen is unfocused (navigating away)');
      };
    }, []),
  );

  const getHistoryHandler = async () => {
    const data = await AsyncStorage.getItem('history');
    let finalData = JSON.parse(data);
    console.log('finalData==========>', finalData);
    if (finalData) {
      setData(finalData);
    } else {
      setData([]);
    }
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getHistoryHandler(); // Fetch updated timers from AsyncStorage
  };

  const clearSpecificKey = async key => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Key "${key}" removed successfully`);
      getHistoryHandler();
    } catch (error) {
      console.error('Error removing key:', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    // Get hours, minutes, and seconds
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Get month name and year
    const monthName = date.toLocaleString('en-US', {month: 'short'}); // "Feb"
    const year = date.getFullYear(); // 2025

    return `${hours}:${minutes}:${seconds}, ${monthName} ${year}`;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Header
        headerStyle={{
          backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
        }}
        headerTitleStyle={{
          color: theme === 'dark' ? '#ffffff' : '#000000',
          paddingLeft: 20,
        }}
        title="History"
        headerRight={() => (
          <View
            style={{
              paddingRight: 20,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                clearSpecificKey('history');
              }}>
              <View
                style={{
                  backgroundColor: '#3D4AEE',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    fontWeight: '500',
                  }}>
                  Clear History
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: theme === 'dark' ? '#121212' : '#EFF1FE',
          padding: 20,
        }}>
        {data?.length === 0 ? (
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
              No history available
            </Text>
          </View>
        ) : null}

        {data?.length > 0 ? (
          <FlatList
            data={data}
            contentContainerStyle={{
              gap: 20,
              paddingBottom: 10,
            }}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    AsyncStorage.clear();
                  }}>
                  <View
                    style={{
                      backgroundColor: theme === 'dark' ? '#2E2E2E' : '#ffffff',
                      borderRadius: 12,
                      padding: 15,
                      gap: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 23,
                          color: theme === 'dark' ? '#ffffff' : '#000000',
                          fontWeight: '500',
                        }}>
                        {item?.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 21,
                          color: theme === 'dark' ? '#FFA24D' : 'green',
                        }}>
                        {item.category}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 21,
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                      }}>
                      Completed at: {formatDate(item?.completedAt)}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
