import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Front from './components/Front';
export default function App() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{flex: 1}}>
        <Front />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
