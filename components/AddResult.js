import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import Results from './Results';
import RNPickerSelect from 'react-native-picker-select';

const db = SQLite.openDatabase('results.db');

export default function AddResults() {
    const [exercise, setExercise] = useState('');
    const [result, setResult] = useState('');
    const [reps, setReps] = useState('');
    const [date, setDate] = useState('');
    const [results, setResults] = useState([]);
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //päivämäärän hankinta
    useEffect(() => {
      setDate(month + "." + day + "." + year);
        db.transaction(tx => {
          tx.executeSql('create table if not exists results (id integer primary key not null, exercise text, result integer, reps integer, date text);');
        });
        updateResults(); 
      }, []);

    const updateResults = () => {
        db.transaction(tx => {
          tx.executeSql('select * from results;', [], (_, { rows }) =>
            setResults(rows._array)
          );
        })
      }
    //tuloksen lisääminen
    const saveResults = () => {
        db.transaction(tx => {
            tx.executeSql('insert into results (exercise, result, reps, date) values (?, ?, ?, ?);', [ exercise, result, reps, date]);    
          }, null,  updateResults
        )
      }
    //placeholder pickerille
    const placeholder = {
        label: 'Tap to select an exercise...',
        value: null,
        color: 'white',
      };


    return (
      <>
      {/* navigaatio*/}
      <View style={styles.containerNavi}>
      <Text style={styles.text1}>Add results</Text>
      </View>
      {/* tuloksen lisäämisen formi */}
      <View style={styles.container}>
      <Text style={styles.header}>Enter your results</Text>

      <RNPickerSelect style={pickerSelectStyles}
            placeholder={placeholder}
            onValueChange={(value) => setExercise(value)}
            items={[
                { label: 'Pull-Ups', value: 'Pull-Ups' },
                { label: 'Squats', value: 'Squats' },
                { label: 'Deadlifts', value: 'Deadlifts' },
                { label: 'Bench Press', value: 'Bench Press' },
                { label: 'Overhead Press', value: 'Overhead Press' },
            ]}
        />
      <TextInput placeholder='result (kg)' style={styles.tinput}
        onChangeText={(result) => setResult(result)}
        keyboardType="numeric" value={result}/>      
      <TextInput placeholder='reps' style={styles.tinput}
        onChangeText={(reps) => setReps(reps)}
        keyboardType="numeric" value={reps}/>  
        
      <TouchableOpacity onPress={saveResults} style={styles.button} title="ADD" >
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>
      </View>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'deepskyblue',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    tinput:{
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 3,
        textAlign: "center",
        fontSize: 30,
        marginBottom: 10,
        width:'100%',
        backgroundColor:'limegreen',
    },
    button:{
        backgroundColor:'blue',
        padding:15,
        paddingLeft:30,
        paddingRight:30,
    },
    buttonText:{
        color: 'white',
        fontSize:19,
    },
    text1: {
        backgroundColor: 'blue',
        fontSize:30,
        margin:26,
        marginBottom:17,
        color:'white',
        padding:5,
  },

    containerNavi: {
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
    
  },
    header:{
        fontSize:30,
        color:'white',
  },

});
{/* pickerin tyylittely */}
const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 13,
    padding:10,
    paddingHorizontal: 9,
    paddingVertical: 8,
    paddingRight: 30,
    borderColor: 'black',
    color: 'white',
    marginBottom:15,
    marginTop:15,
    backgroundColor:'limegreen',
  },
  inputIOS: {
    paddingVertical: 10,
    paddingHorizontal: 9,
    paddingRight: 30,
    borderColor: 'black',
    color: 'white',
    marginBottom:15,
    marginTop:15,
    backgroundColor:'limegreen',
  },

});