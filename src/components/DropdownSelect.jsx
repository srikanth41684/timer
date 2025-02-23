import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {AppThemeContext} from '../context/AppThemeContext';

const DropdownSelect = ({category, setCategory}) => {
  const {theme, setTheme} = useContext(AppThemeContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const options = [
    {id: '1', label: 'Workout'},
    {id: '2', label: 'Study'},
    {id: '3', label: 'Break'},
  ];

  const selectItem = item => {
    setDropdownVisible(false);
    setCategory(item.label);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => setDropdownVisible(!isDropdownVisible)}>
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
              fontSize: 16,
              color: theme === 'dark' ? '#ffffff' : '#000000',
            }}>
            {category}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Dropdown List */}
      {isDropdownVisible && (
        <View
          style={{
            backgroundColor: theme === 'dark' ? '#121212' : '#EFF1FE',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderColor: 'lightgray',
            borderWidth: 1,
            borderTopWidth: 0,
          }}>
          <FlatList
            data={options}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => selectItem(item)}>
                <Text
                  style={{
                    fontSize: 16,
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                  }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownButton: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectedText: {
    fontSize: 16,
  },
  dropdown: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    position: 'absolute',
    top: 60, // Adjust position below button
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default DropdownSelect;
