import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Header = ({children}: any) => {
  return <View style={styles.header}>{children}</View>;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
});
