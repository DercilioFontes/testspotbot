import React from 'react'
import { StyleSheet,Text, View, Image, TextInput, TouchableHighlight, 
  Button, ActivityIndicator } from 'react-native'
const buffer = require('buffer')

export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: 'Username',
      password: 'Password',
      showProgress: false
    }
  }

  onLoginSubmited() {
    console.log('Attempting to log in with username' + this.state.username + this.state.password)
    this.setState({showProgress: true})

    const b = new buffer.Buffer(this.state.username + ':' + this.state.password)
    const encodedAuth = b.toString('base64')
    fetch('https://api.github.com/user', {
      headers: {
        'Authorization' : 'Basic ' + encodedAuth
      }
    })
    .then((response) => {
      if(response.status >= 200 && response.status < 300) {
        return response
      }
      throw {
        badCredentials: response.status == 401,
        unknownError: response.status != 401
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((results) => {
      console.log(results)
    })
    .catch((err) => {
      this.setState(err)
    })
    .finally(() => {
      this.setState({showProgress: false})
    })
  }

  render() {
    const hello = 'Login!'
    let errorCtrl = <View />

    if (this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        That username and password combination did nor work
      </Text>
    }
    if (this.state.unknowError) {
      errorCtrl = <Text style={styles.error}>
        That username and password combination did nor work
      </Text>
    }

    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={{uri: 'https://cdn.pixabay.com/photo/2013/04/06/11/50/image-editing-101040_1280.jpg'}}/>
        <Text style={{color: 'green'}}>{hello}</Text>
        <TextInput
        style={styles.input}
        onChangeText={(username) => this.setState({username})}
        value={this.state.username}
        />
        <TextInput
        style={styles.input}
        onChangeText={(password) => this.setState({password})}
        value={this.state.password}
        secureTextEntry={true}
        />
        <TouchableHighlight style={styles.button}>
        <Button title='Submit' onPress={this.onLoginSubmited.bind(this)}/></TouchableHighlight>

        {errorCtrl}

        <ActivityIndicator
        animating={this.state.showProgress}
        size='large'
        style={styles.loader}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  logo: {
    width: 300,
    height: 100
  },
  input: {
    height: 40, 
    width: 300,
    marginTop: 1,
    marginBottom: 1,
    borderColor: 'gray', 
    borderWidth: 1,
    padding: 4
  },
  button: {
    height: 40, 
    width: 300, 
    marginTop: 5,
    backgroundColor: '#ccffcc', 
    borderWidth: 1,
    padding: 4
  },
  loader: {
    marginTop: 20
  },
  error: {
    
  }
});