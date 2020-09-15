import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { NavigationScreenProp } from "react-navigation";
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {parse} from "@typescript-eslint/parser";

interface ProgramScreenState {
    name: string;
    day: any[];
    maxes: any[];
    program: any[];
}

interface ProgramScreenProps {
    navigation: any
}

class ProgramScreen extends Component<ProgramScreenProps, ProgramScreenState> {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            day: [],
            maxes: [{"val0": "Squat", "val1": 0, "val2": 0},
                    {"val0": "Bench", "val1": 0, "val2": 0},
                    {"val0": "Deadlift", "val1": 0, "val2": 0}],
            program: this.props.navigation.getParam('program'), // no need if we delete in the dayscreen
        }
    }

    handleNameChange = evt => {
        this.setState({ name: evt.target.value });
    };

    handleFocus = (event) => event.target.select();

    handleAddMax = () => {
        let path = "addmax";
        this.sendRequestMaxes(path);
    };

    handleMaxNameChange = (idx) => evt => {
        let path = "changemaxname?name=" + evt.target.value + "&index=" + idx;
        this.sendRequestMaxes(path);
    };

    handleMaxRMChange = (idx) => evt => {
        let path = "changemaxrm?rm=" + evt.target.value + "&index=" + idx;
        this.sendRequestMaxes(path);
    };

    handleMaxProgChange = (idx) => evt => {
        let path = "changemaxprog?prog=" + evt.target.value + "&index=" + idx;
        this.sendRequestMaxes(path);
    };

    handleMaxRemove = (idx) => () => {
        let path = "removemax?index=" + idx;
        this.sendRequestMaxes(path);
    };

    async sendRequestMaxes(path) {
        try {
            let responsePromise = fetch('http://localhost:4567/' + path);
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            this.setState({
                maxes: parsedObject
            }, () => {
                console.log("callback: " + JSON.stringify(this.state.maxes));
            });
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    handlePickDay = (day, idx) => () => {
        let path = "day?index=" + idx;
        this.sendRequest(day, path);             // picked day out of the list; so that we can modify java data
        /*
        this.props.navigation.navigate('Day', {
            day: this.state.day             // so that day screen renders correct data
        })
        */
    };

    async sendRequest(day, path) {
        try {
            let responsePromise = fetch('http://localhost:4567/' + path);
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            this.setState({
                day: parsedObject
            }, () => {
                console.log("callback");
            });
            console.log("parsedOBj: " + JSON.stringify(parsedObject));
            this.navigateToDay(day, parsedObject);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    navigateToDay = (dayName, parsedObject) => {
        this.props.navigation.navigate('Day', {
            name: dayName,
            day: parsedObject,
            visit: true
        })
    };

    handleRemoveDay = idx => () => {
        if (confirm("Are you sure you want to delete this day?")) {
            let path = "removeday?index=" + idx;
            this.sendRequestRemove(path);
        }
    };

    async sendRequestRemove(path) {
        try {
            let responsePromise = fetch('http://localhost:4567/' + path);
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            this.setState({
                day: parsedObject
            }, () => {
                console.log("callback");
            });
            console.log("parsedOBj: " + JSON.stringify(parsedObject));
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    render() {
        console.log(JSON.stringify(this.state.maxes));
        const { navigation } = this.props;
        console.log(JSON.stringify(this.state.program));
        console.log(JSON.stringify(navigation.getParam('program')));
        return (
            <form>
                <input
                    type="text"
                    placeholder="Name of the Program"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <h4>Current Stats</h4>

                <button
                    type="button"
                    onClick={() => {
                        navigation.navigate('Calculator')
                    }}
                    className="small"
                >
                    Calculate 1 Rep Max
                </button>

                {this.state.maxes.map((lift, index) => (
                    <View>
                        <TextInput
                            placeholder={`Enter Lift`}
                            value={lift.val0}
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxNameChange(index)}
                        />
                        <TextInput
                            placeholder={`Current 1RM`}
                            value={lift.val1}
                            keyboardType='numeric'
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxRMChange(index)}
                        />
                        <TextInput
                            placeholder={`Increase every cycle by...`}
                            value={lift.val2}
                            keyboardType='numeric'
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxProgChange(index)}
                        />
                        <button
                            type="button"
                            onClick={this.handleMaxRemove(index)}
                            className="small"
                        >
                            Delete Max
                        </button>
                    </View>
                ))}
                <button
                    type="button"
                    onClick={this.handleAddMax}
                    className="small"
                >
                    Add Max Lift
                </button>

                <h4>Days</h4>
                <button // [] as param
                    type="button"
                    onClick={() => this.props.navigation.navigate('Day', {
                        day: [],
                        visit: false
                    })}
                    className="small"
                >
                    Add Day
                </button>
                {navigation.getParam('program').map((day, idx) => ( // when clicked, pass the json list as param
                    <View>
                        <button
                            type="button"
                            onClick={this.handlePickDay(day.val0, idx)}
                            className="small"
                        >
                            {day.val0}
                        </button>
                    </View>
                ))}

            </form>
        );
        /*
        // do alert if name already exists - need function for this
        // the if statement below will turn into else if
        if (navigation.getParam('name') !== '') {
            return (
                <View>
                    <Text>{navigation.getParam('name')}</Text>
                    <Button title='Add New Day' onPress={() => this.props.navigation.navigate('Day')}/>
                </View>
            )
            //
            return (
                <View>
                    <View style={styles.row}>
                        <View style={{margin: 10}}>
                            <Button title='Add' onPress={() => this.addTextInput(this.state.textInput.length)}/>
                        </View>
                        <View style={{margin: 10}}>
                            <Button title='Remove' onPress={() => this.removeTextInput()}/>
                        </View>
                    </View>
                    {this.state.textInput.map((value) => {
                        return value
                    })}
                    <Button title='Add New Day' onPress={() => this.props.navigation.navigate('Day')}/>
                    <Button
                        title="Complete this Program"
                        onPress={() => this.props.navigation.navigate('Home', {
                            input: this.state.inputData
                        })}
                    />
                </View>
            )

        }*/
    }
}

// class ProgramScreen extends Component<ProgramScreenProps, ProgramScreenState> {
//
//     constructor(props){
//         super(props);
//         this.state = {
//             name: '',
//             textInput : [],
//             inputData : [],
//             day: []
//         }
//     }
//
//     // (name, set, rep, ...)
//     // function to show the day lifts, called by a button (the button title will be the param name)
//     // it will set state at the end of the function where the state will be the completed fill-ins
//     // of all the days. Same body as addTextInput but with buttons (will the push part work?).
//     // Buttons will call function taking in the same parameters and will show completed fill-ins of that day.
//     // Editing a day will require accessing the day name as a key
//
//     //function to add TextInput dynamically
//     addTextInput = (index) => {
//         let textInput = this.state.textInput;
//         textInput.push(<TextInput style={styles.textInput}
//                                   onChangeText={(text) => this.addValues(text, index)} />);
//         this.setState({ textInput });
//     };
//
//     //function to remove TextInput dynamically
//     removeTextInput = () => {
//         let textInput = this.state.textInput;
//         let inputData = this.state.inputData;
//         textInput.pop();
//         inputData.pop();
//         this.setState({ textInput,inputData });
//     };
//
//     //function to add text from TextInputs into single array
//     addValues = (text, index) => {
//         let dataArray = this.state.inputData;
//         let checkBool = false;
//         if (dataArray.length !== 0){
//             dataArray.forEach(element => {
//                 if (element.index === index ){
//                     element.text = text;
//                     checkBool = true;
//                 }
//             });
//         }
//         if (checkBool){
//             this.setState({
//                 inputData: dataArray
//             });
//         }
//         else {
//             dataArray.push({'text':text,'index':index});
//             this.setState({
//                 inputData: dataArray
//             });
//         }
//     };
//
//     //function to console the output
//     getValues = () => {
//         console.log('Data',this.state.inputData);
//     };
//
//
//     render(){
//         const { navigation } = this.props;
//         console.log(navigation.getParam('name'));
//         // do alert if name already exists - need function for this
//         // the if statement below will turn into else if
//         if (navigation.getParam('name') !== '') {
//             return (
//                 <View>
//                     <Text>{navigation.getParam('name')}</Text>
//                     <Button title='Add New Day' onPress={() => this.props.navigation.navigate('Day')}/>
//                 </View>
//             )
//             //
//             return (
//                 <View>
//                     <View style={styles.row}>
//                         <View style={{margin: 10}}>
//                             <Button title='Add' onPress={() => this.addTextInput(this.state.textInput.length)}/>
//                         </View>
//                         <View style={{margin: 10}}>
//                             <Button title='Remove' onPress={() => this.removeTextInput()}/>
//                         </View>
//                     </View>
//                     {this.state.textInput.map((value) => {
//                         return value
//                     })}
//                     <Button title='Add New Day' onPress={() => this.props.navigation.navigate('Day')}/>
//                     <Button
//                         title="Complete this Program"
//                         onPress={() => this.props.navigation.navigate('Home', {
//                             input: this.state.inputData
//                         })}
//                     />
//                 </View>
//             )
//
//         }
//     }
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonView: {
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        margin: 20
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
});

export default ProgramScreen;
