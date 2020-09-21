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

    handlePickProgram = (programName) => () => {
        let path = "program?programname=" + programName;
        this.sendRequest(programName, path);
    };

    async sendRequest(programName, path) {
        try {
            let responsePromise = fetch('http://localhost:4567/' + path);
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            this.navigateToWorkout(programName, parsedObject);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    navigateToWorkout = (programName, parsedObject) => {
        this.props.navigation.navigate('Workout', {
            programName: programName,
            program: parsedObject,
        })
    };

    render() {
        const { navigation } = this.props;
        console.log(navigation.getParam('home'));
        console.log(JSON.stringify(this.state.home));
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text>Home Screen</Text>
                <Text>{navigation.getParam('input')}</Text>
                {(navigation.getParam('input', 'default value') !== 'default value' &&
                 navigation.getParam('input', 'default value') !== [])
                    ? <Text>{JSON.stringify(navigation.getParam('input', 'default value'))}</Text>
                    : null }
                <Button
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
});

export default createAppContainer(RootStack);
