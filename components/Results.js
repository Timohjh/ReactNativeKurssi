import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, Button, FlatList, Header, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('results.db');

export default function Results() {
  const [exercise, setExercise] = useState('');
  const [result, setResult] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState('');
  const [PullUp, setPullUp] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [benchpress, setBenchpress] = useState('');
  const [overheadpress, setOverheadpress] = useState('');
  const [results, setResults] = useState([]);
  
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists results (id integer primary key not null, exercise text, result integer, reps integer, date text);');
    });
    updateResults(); 

  }, []);

//haetaan huipputulokset yksi kerrallaan, joko toistojen tai painon mukaan.
  const PullUps = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results where exercise="Pull-Ups" order by reps desc limit 1;', [], (_, { rows }) =>
        setPullUp(rows._array)
        
      ); 
    });
  }
  const Squat = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results where exercise="Squats" order by result desc limit 1;', [], (_, { rows }) =>
        setSquat(rows._array)
        
      ); 
    });
  }
  
  const Deadlift = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results where exercise="Deadlifts" order by result desc limit 1;', [], (_, { rows }) =>
        setDeadlift(rows._array)
        
      ); 
    });
  }
  const BenchPress = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results where exercise="Bench Press" order by result desc limit 1;', [], (_, { rows }) =>
        setBenchpress(rows._array)
        
      ); 
    });
  }
  const OverheadPress = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results where exercise="Overhead Press" order by result desc limit 1;', [], (_, { rows }) =>
        setOverheadpress(rows._array)
        
      ); 
    });
  }

  //listojen päivitys ja haku uusimman mukaan.
  const updateResults = () => {
    db.transaction(tx => {
      tx.executeSql('select * from results order by date desc;', [], (_, { rows }) =>
        setResults(rows._array)
      ), PullUps(); 
      Squat();  
      Deadlift();
      BenchPress();
      OverheadPress();
    });
  }
//tuloksen poistaminen id:n mukaan.
  const deleteResult = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from results where id = ?;`, [id]);
      }, null, updateResults
    )    
  }
  //poisto nappia painettaessa varmistusikkuna.
  const buttonAlert = (id) => {
  Alert.alert(
          'Warning',
          'Are you sure you want to delete this item?',
          
          [
            {
              text:'cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            { text: 'OK', onPress: () => deleteResult(id) }
          ],
          { cancelable: false }
        )
  }

 
  return (
    <>
    {/* navigaatio*/}
    <View style={styles.container2}>
    <Text style={styles.text1}>Recents</Text>
    <Text style={styles.text2}>Records</Text>
    </View>
    {/* listataan kaikki tulokset uusimman mukaan */}
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style = {styles.list1}>
      <FlatList 
        style={styles.flist1}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.fullList}>
        <Text style={styles.listText, {fontSize: 17, textAlign: "center",color: 'blue', fontWeight: "bold"}}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        <Text style={{fontSize: 18, textAlign: "center", borderWidth: 1, color:'white', backgroundColor: 'red', borderColor: 'white', borderRadius: 3,}} 
        onPress={() => buttonAlert(item.id)} title="Delete" >Delete</Text>
        </View>
        } 
        data={results} 
      />
      </View>
      {/* yksi kerrallaan tulostetaan huipputulos jokaiselle liikkeelle */}
      <View style = {styles.list2}>
      <FlatList 
        style={styles.flist2}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.records}>
        <Text style={styles.listText1}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        </View>
        } 
        data={PullUp}
      />
      <FlatList 
        style={styles.flist2}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.records}>
        <Text style={styles.listText1}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        </View>
        } 
        data={squat}
      />
      <FlatList 
        style={styles.flist2}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.records}>
        <Text style={styles.listText1}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        </View>
        } 
        data={deadlift}
      />
    <FlatList 
        style={styles.flist2}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.records}>
        <Text style={styles.listText1}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        </View>
        } 
        data={benchpress}
      />
    <FlatList 
        style={styles.flist2}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
        <View style={styles.records}>
        <Text style={styles.listText1}>{item.exercise}</Text>
        <Text style={styles.listText}>{item.result} kg</Text>
        <Text style={styles.listText}>{item.reps} reps</Text>
        <Text style={styles.listText}>{item.date}</Text>
        </View>
        } 
        data={overheadpress}
      />
      </View>  
    </ScrollView>
    </>
  );
 
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'deepskyblue',
    flexDirection:'row',
    justifyContent: 'center',
    flex:3,
  }, 

  fullList: {
    backgroundColor: 'limegreen',
    fontWeight: 'bold',
    borderWidth: 3,
    borderColor: "green",
    borderRadius: 7,
    fontSize: 30,
    margin:0,
    marginBottom: 10,
  },
  listText: {
    fontSize: 16, 
    textAlign: "center",
    color: 'white',
    paddingBottom:1.5,
  }, 
  listText1: {
    fontSize: 17, 
    textAlign: "center",
    color: 'blue',
    fontWeight: 'bold',

  }, 
  flist1: {
    fontSize: 16, 
    color: 'white',
    width:'43%',
    marginTop: 9,
    marginRight:10,
    
  }, 
  flist2: {
    marginTop: 9,
  }, 
  list1: {
    color: 'white',
    flexDirection:'row',
    borderWidth:1.5,
    borderBottomWidth:0,
    borderLeftColor:'deepskyblue',
    borderBottomColor:'deepskyblue',
    borderTopColor:'deepskyblue',
    borderRightColor:'green',
  }, 
  list2: {
    color: 'white',
    flexDirection:'column',
    fontSize: 16, 
    color: 'white',
    width:'43%',
    marginLeft:10,
    paddingLeft:1,
    borderWidth:1.5,
    borderBottomWidth:0,
    borderColor:'deepskyblue',
  },     
  text1: {
    backgroundColor: 'blue',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection:'row',
    fontSize:30,
    margin:26,
    marginBottom:17,
    color:'white',
    padding:5,
},
text2: {
    backgroundColor: 'blue',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection:'row-reverse',
    fontSize:30,
    margin:26,
    marginBottom:17,
    color:'white',
    padding:5,
},
container2: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',

},
records: {
  backgroundColor:'limegreen',
  paddingBottom:3,
  paddingTop:3,
  borderRadius:10,
  borderColor: 'green',
  borderWidth:3,
}

});