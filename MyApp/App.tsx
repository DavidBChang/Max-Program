import 'react-native-gesture-handler';
import React, {Component, useState} from 'react';
import { SectionList, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
//import { createStackNavigator } from '@react-navigation/stack';
import DayScreen from "./DayScreen";
import ProgramScreen from "./ProgramScreen";
import OneRMCalc from "./OneRMCalc";
import WorkoutScreen from "./WorkoutScreen";

interface homeProps {
    navigation: any;
}

interface homeState {
    home: any[];
}

class HomeScreen extends Component<homeProps, homeState> {
    constructor(props){
        super(props);
        this.state = {
            home: this.props.navigation.getParam('home'),
        }
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;

        return {
            title: params ? params.otherParam : 'MAX&PROGRAM',
            /* These values are used instead of the shared configuration! */
            headerStyle: {
                backgroundColor: "#116466",
            },
            headerTintColor: "#FFCB9A",
            cardStyle: {
                backgroundColor: "#2C3531",
            }
        };
    };

    handlePickProgram = (programName) => () => {
        let daysPath = "program?programname=" + programName;
        let maxesPath = "programmaxes?programname=" + programName;
        this.sendRequest(programName, daysPath, maxesPath);
    };

    async sendRequest(programName, daysPath, maxesPath) {
        try {
            let responsePromise = fetch('http://localhost:4567/' + daysPath);
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedDays = await parsingPromise;

            responsePromise = fetch('http://localhost:4567/' + maxesPath);
            response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            parsingPromise = response.json();
            let parsedMaxes = await parsingPromise;
            this.navigateToWorkout(programName, parsedDays, parsedMaxes);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    navigateToWorkout = (programName, parsedDays, parsedMaxes) => {
        this.props.navigation.navigate('Workout', {
            programName: programName,
            programDays: parsedDays,
            programMaxes: parsedMaxes
        })
    };

    render() {
        const { navigation } = this.props;
        console.log(navigation.getParam('home'));
        console.log(JSON.stringify(this.state.home));
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#2C3531" }}>
                <Text style={{color: "#AAABB8", fontSize: 24, marginBottom: 50, padding: 20}}>Max&Program</Text>
                <Text>{navigation.getParam('input')}</Text>
                {(navigation.getParam('input', 'default value') !== 'default value' &&
                 navigation.getParam('input', 'default value') !== [])
                    ? <Text>{JSON.stringify(navigation.getParam('input', 'default value'))}</Text>
                    : null }
                <Button
                    color='#116466'
                    title="Create New Program"
                    onPress={() => {
                        this.props.navigation.navigate('Program', {
                            program: []
                        });
                    }}
                />
                {navigation.getParam('home') !== undefined ? navigation.getParam('home').map((program, idx) => ( // when clicked, pass the json list as param
                    <View>
                        <button
                            type="button"
                            onClick={this.handlePickProgram(program.val0)}
                            className="small"
                        >
                            {program.val0}
                        </button>
                    </View>
                )): null}
            </View>
        );
    }
}

const RootStack = createStackNavigator({
    Home: HomeScreen,
    Program: ProgramScreen,
    Day: DayScreen,
    Calculator: OneRMCalc,
    Workout: WorkoutScreen,
},
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#25274D',
            },
            headerTintColor: 'red',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    });

export default createAppContainer(RootStack);
