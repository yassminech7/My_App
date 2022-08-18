import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Form, InputText } from 'validate-form-in-expo-style';
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { WhiteBalance } from 'expo-camera';
class App extends React.Component {
    state = {
        first_name: "",
        number: "",
        last_name: "",
        email: '',
        user: { password: "", repeatPassword: "" },
    }
    componentDidMount() {
        Form.addValidationRule('isValidPassword', (value) => {
            let passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            if (passwordReg.test(value) === false) {
                return false;
            }
            return true;
        });
        Form.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.user.password) {
                return false;
            }
            return true;
        });
    }
    componentWillUnmount() {
        Form.removeValidationRule('isPasswordMatch');
        Form.removeValidationRule('isValidPassword');
    }

    handlePassword = (event) => {
        const { user } = this.state;
        user.password = event.nativeEvent.text;
        this.setState({ user });
    }

   

    handleChange = (email) => {
        this.setState({ email });
    }

    submit = () => {
        alert("You are successfully logged in.")
    }
    handleSubmit = () => {
        this.refs.form.submit()
        this.props.navigation.navigate("CameraScr")
    
    }
    render() {
        let Image_Http_URL = { uri: 'https://radhakishan.vpran.in/img/radhakishan-web-3.jpg' };
        const { user } = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    
                    <Text style={styles.logo}>Welcome</Text>
                    
                    <View style={styles.action} >
                        <Form ref="form" onSubmit={this.submit} >
          
                            <InputText
                                name="email"
                                validateNames={['required', 'validEmail']}
                                errorMessages={['This field is required', 'Enter valid email address']}
                                placeholder="Email"
                                placeholderTextColor="#f2f4f5"
                                type="text"
                                keyboardType="email-address"
                                value={this.state.email}
                                onChangeText={this.handleChange}
                                leftIcon={<Feather name="mail" color="#f2f4f5" size={20} />}
                                invalidIcon={< Feather
                                    name="alert-circle"
                                    color="red"
                                    size={20}
                                />}
                                validIcon={<Feather name="check-circle" color="green" size={20} />}
                            />
                            <InputText 
                                name="password"
                                secureTextEntry
                                validateNames={['isValidPassword', 'required']}
                                errorMessages={['Minimum 8 characters, at least one uppercase letter, one lowercase letter and one number', 'This field is required']}
                                type="text"
                                value={user.password}
                                placeholder="Password"
                                placeholderTextColor="#f2f4f5"
                                leftIcon={<FontAwesome name="lock" color="#f2f4f5" size={20} />}
                                onChange={this.handlePassword}
                                invalidIcon={< Feather
                                    name="alert-circle"
                                    color="red"
                                    size={20}
                                    
                                />}
                                validIcon={<Feather name="check-circle" color="green" size={20} />}
                            />
                        
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.handleSubmit}
                                style={styles.loginBtn}
                            >
                                <Text style={styles.loginText}>LOGIN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginBtn} onPress={()=>this.props.navigation.navigate("Signup")}>
          <Text style={styles.loginText}>Don't have an account?  SIGNUP </Text>
        </TouchableOpacity>
                            
                        </Form>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default App;

const styles = StyleSheet.create({
    
    action: {
        width: Dimensions.get('window').width,
        padding: 40,
        height: Dimensions.get('window').height
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 10
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      
    },
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#fb5b5a",
      marginBottom:70,
      marginTop:90
    },
    inputText:{
        color: "#f2f4f5",
    },
    inputView:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:40
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"white",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#fb5b5a",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:30,
      marginLeft: 33
    },
    loginText:{
      color:"white"
    },
    Button:{
      width:"80%",
      backgroundColor:"#fb5b5a",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    }
        

});