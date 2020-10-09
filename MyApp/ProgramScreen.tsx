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

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.otherParam : 'A Nested Details Screen',
            headerStyle: {
                backgroundColor: "#116466",

                alignItems: "center"
            },
            headerTintColor: "#FFCB9A",
            cardStyle: {
                backgroundColor: "#2C3531",
            }
        };
    };

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
        const { navigation } = this.props;
        return (
            <form>
                <h4>Name of the Program: </h4>
                <input
                    style={{ backgroundColor: '#116466', textDecorationColor: '#D1E8E2' }}
                    type="text"
                    placeholder="Name of the Program"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <h4>Current Stats</h4>

                <View style={styles.fixToText}>
                    <Button
                        color="#116466"
                        title="Calculate 1 Rep Max"
                        onPress={() => {
                            navigation.navigate('Calculator')
                        }}
                    />
                </View>

                {this.state.maxes.map((lift, index) => (
                    <View style={styles.list}>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter Lift`}
                            value={lift.val0}
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxNameChange(index)}
                        />
                        <Text style={styles.text}>Current 1RM: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Current 1RM`}
                            value={lift.val1}
                            keyboardType='numeric'
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxRMChange(index)}
                        />
                        <Text style={styles.text}>Increase every cycle by...</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Increase every cycle by...`}
                            value={lift.val2}
                            keyboardType='numeric'
                            onFocus={this.handleFocus}
                            onChange={this.handleMaxProgChange(index)}
                        />
                        <button
                            type="button"
                            onClick={this.handleMaxRemove(index)}
                            className="delete"
                        >
                            Delete Max
                        </button>
                    </View>
                ))}
                <button
                    type="button"
                    onClick={this.handleAddMax}
                    className="add"
                >
                    Add Max Lift
                </button>

                <h4>Days in Each Training Cycle</h4>

                <button
                    type="button"
                    onClick={() => this.props.navigation.navigate('Day', {
                        day: [],
                        visit: false
                    })}
                    className="add"
                >
                    Add Day
                </button>
                {navigation.getParam('program').map((day, idx) => ( // when clicked, pass the json list as param
                    <View>
                        <button
                            type="button"
                            onClick={this.handlePickDay(day.val0, idx)}
                            className="add"
                        >
                            {day.val0}
                        </button>
                    </View>
                ))}
                <View style={styles.footer}>
                    <Button
                        color="#116466"
                        title="Complete this Program"
                        onPress={this.completeProgram}
                    />
                </View>
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
    list: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    text: {
        color: "#D1E8E2"
    },
    input: {
        width: 100,
        color: "#D1E8E2"
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    button: {
        backgroundColor: "#2E9CCA"
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
