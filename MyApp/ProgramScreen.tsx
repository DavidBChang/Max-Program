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

    completeProgram = () => {
        if (this.state.name !== "" && this.state.name !== undefined) {
            let path1 = "verify";
            let path2 = "checkduplicateprogram?programname=" + this.state.name;
            this.sendRequestVerification(path1, path2);
        } else {
            alert("You have not declared the name of this Program.")
        }
    };

    async sendRequestVerification(path1, path2) {
        try {
            let responsePromise = await fetch('http://localhost:4567/' + path2); // added await
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            let path = "completeprogram?programname=" + this.state.name;
            if (parsedObject) {
                if (confirm("You already have a Program called " + this.state.name + ", do you want to override it with this Program?")) {
                } else {
                    return;
                }
            }
            this.sendRequestComplete(path);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    async sendRequestComplete(path) {
        let parsedObject: any[] = [];
        try {
            let responsePromise = await fetch('http://localhost:4567/' + path); // added await
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!: " + path);
                return;
            }
            let parsingPromise = response.json();
            parsedObject = await parsingPromise;
            console.log(parsedObject);
            this.navigateToHome(parsedObject);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    navigateToHome = (parsedObject) => {
        this.props.navigation.navigate('Home', {
            home: parsedObject
        })
    };

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

                <h4>Days in Each Training Cycle</h4>
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
                <Button
                    title="Complete this Program"
                    onPress={this.completeProgram}
                />
            </form>
        );
    }
}

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
