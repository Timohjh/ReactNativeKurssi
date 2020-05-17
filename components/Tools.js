import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';

export default function Tools() {
  const [RegionLatitude, setRegionLatitude] = useState('')
  const [RegionLongitude, setRegionLongitude] = useState('')
  const [location, setLocation] = useState(null)
  let apikey = 'f7aa84176d612291390ca3d032db3f31';
  const [temper, setTemper] = useState('')
  const [wCondition, setWCondition] = useState('')
  const [kilos, setKilos] = useState('')
  const [pounds, setPounds] = useState('')

  //komponentin päivitystä
  useEffect(() => {
    getLocation();
  }, [temper]);

  useEffect(() => {
    handleKilos();
  }, [pounds]);

  useEffect(() => {
    handlePounds();
  }, [kilos]);

//kysytään lupa locationille, jonka jälkeen saadaan koordinaatit, joiden avulla apista haetaan säätiedot.
  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('No permission to access location')
        }
        else {
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location)
            setRegionLatitude(location.coords.latitude)
            setRegionLongitude(location.coords.longitude)
            fetch('http://api.openweathermap.org/data/2.5/onecall?lat=' + location.coords.latitude + '&lon=' + location.coords.longitude + '&exclude=hourly,daily&appid=' + apikey + '&units=metric')
            .then(res => res.json())
            .then(json => {
              console.log(json)
              setTemper(json.current.temp)
              setWCondition(json.current.weather[0].main)
            })
            
        } 
}

//painojen muuntaminen
const [kilosConverted, setKilosConverted] = useState('')
const [poundsConverted, setPoundsConverted] = useState('')

const handleKilos = () => {
    setKilosConverted((pounds * 2.2046).toFixed(2))
}
const handlePounds = () => {
    setPoundsConverted((kilos / 2.2046).toFixed(2))

} 

//BMI:n laskeminen
const [bodyWeight, setBodyWeight] = useState('')
const [height, setHeight] = useState('')
const [BMI, setBMI] = useState('')

const handleBMI = () => {
    setBMI((bodyWeight / ((height / 100) ** 2)).toFixed(2))
}

    return (
      <>
      {/* navigaatio*/}
      <View style={styles.containerNavi}>
        <Text style={styles.text1}>Tools</Text>
      </View>
      {/* säätiedot */}
      <View style={styles.container}>
          <Text style={styles.condition}>Current condition: {"\n"}{wCondition}</Text>
          <Text style={styles.temperature}>Temperature: {"\n"}{temper} °C </Text>
      </View>
      {/* painon muuntaminen*/}
      <View style={styles.convert}>
        <Text style={styles.header}>Weight Converter</Text>
          <TextInput
            placeholder="Enter kilograms"
            value={pounds}
            keyboardType="numeric"
            onChangeText={(pounds) => setPounds(pounds)}
            style={styles.inputField}
          />
        {pounds !== '' ? <Text style={styles.weightText}>{pounds} kilograms is {kilosConverted} lbs</Text>:null}
          <TextInput
            placeholder="Enter pounds"
            value={kilos}
            keyboardType="numeric"
            onChangeText={(kilos) => setKilos(kilos)}
            style={styles.inputField}
          /> 
        {kilos !== '' ? <Text style={styles.weightText}>{kilos} pounds is {poundsConverted} kg</Text>:null}
      </View>
      {/* BMI:n laskeminen */}
      <View style={styles.containerBMI}>
      <Text style={styles.header}>Body mass index</Text>
      <TextInput
            placeholder="Weight (kg)"
            value={bodyWeight}
            keyboardType="numeric"
            onChangeText={(bodyWeight) => setBodyWeight(bodyWeight)}
            style={styles.inputFieldBMI}
          /> 
      <TextInput
            placeholder="Height (cm)"
            value={height}
            keyboardType="numeric"
            onChangeText={(height) => setHeight(height)}
            style={styles.inputFieldBMI}
          /> 
          {/* tietojen lähetys ja tulostaminen */}
      <TouchableOpacity onPress={handleBMI} style={styles.button} title="ADD" >
        <Text style={styles.buttonText}>BMI</Text>
      </TouchableOpacity>
          {BMI !== '' ? <Text style={styles.weightText}>Your BMI is: {BMI}</Text> : null}
      </View>
          </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 0.50,
      backgroundColor: 'deepskyblue',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:'row',
      borderWidth:3,
      borderColor:'deepskyblue',
      borderBottomColor:'green',
    },
    text1: {
      backgroundColor: 'blue',
      flexDirection:'row',
      fontSize:25,
      margin:5,
      color:'white',
      padding:5,
  },

  containerNavi: {
    flex: 0.33,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    alignSelf: 'flex-start',
    fontSize:15,
    marginLeft: 'auto',
    backgroundColor:'limegreen',
    marginRight:5,
    marginTop:7,
    padding:5,
    paddingLeft:20,
    paddingRight:20,
    color:'white',
    borderRadius:10,
    borderWidth:3,
    borderColor:'green',
  },
  condition: {
    alignSelf: 'flex-start',
    fontSize:15,
    marginRight: 'auto',
    backgroundColor:'limegreen',
    marginLeft:5,
    marginTop:7,
    padding:5,
    paddingLeft:15,
    color:'white',
    borderRadius:10,
    borderWidth:3,
    borderColor:'green',
  },
  convert: {
    flex: 1.5,
    backgroundColor: 'deepskyblue',
    alignItems: 'center',
    borderWidth:3,
    borderColor:'deepskyblue',
    borderBottomColor:'green',

  },
  inputField: {
    backgroundColor:'limegreen',
    width:'90%',
    padding:10,
    marginBottom:5,
    borderWidth:1.5,
    borderRadius:5,
    borderColor:'black',
    fontSize:20,
    fontWeight:'bold',



  },
  header: {
    color:'white',
    marginBottom:5,
    fontSize:25,


  },
  weightText: {
    color:'white',
    marginBottom:5,
    fontSize:15,


  },
  containerBMI: {
    flex: 2.0,
    backgroundColor: 'deepskyblue',
    alignItems: 'center',
    flexDirection:'column',
  },
  inputFieldBMI: {
    backgroundColor:'limegreen',
    width:'90%',
    padding:10,
    borderWidth:1.5,
    borderRadius:5,
    borderColor:'black',
    fontSize:17,
    fontWeight:'bold',
    marginTop:5,
    marginLeft:10,

  },
  button:{
    backgroundColor:'blue',
    padding:10,
    paddingLeft:19,
    paddingRight:19,
    marginTop:5,
},
buttonText:{
    color: 'white',
    fontSize:13,
},

  });