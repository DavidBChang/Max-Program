import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { NavigationScreenProp } from "react-navigation";
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {parse} from "@typescript-eslint/parser";
import ProgramScreen from "./ProgramScreen";

interface workoutProps {
    navigation: any;
}

interface workoutState {
    home: any[];
}

class WorkoutScreen extends Component<workoutProps, workoutState> {
    constructor(props) {
        super(props);
        this.state = {
            home: this.props.navigation.getParam('home'),
        }
    }

    handleFocus = (event) => event.target.select();

    handleLifts = (day) => {
        return (
            <View>
                {day.val1.map((lift, idx) => (
                <View>
                    <Text>{lift.val0}</Text>
                    {this.handleSetsReps(lift)}
                </View>
                ))}
            </View>
        )
    };

    handleSetsReps = (lift) => {
        return (
            <View>
                {lift.val1.map((setsReps, idx) => (
                    <View>
                        <Text>{setsReps.sets} sets X {setsReps.reps} reps</Text>
                        {this.handleInputVolume(setsReps.sets, setsReps.reps)}
                    </View>
                ))}
            </View>
        )
    };

    handleInputVolume = (sets, reps) => {
        let numSets = new Array(sets);
        for (let i = 0; i < numSets.length; i++) {
            numSets[i] = 1;
        }
        return (
            <View style={{flexDirection: 'row'}}>
                {numSets.map((set, idx) => (
                    <View style={{flexDirection: 'row'}}>
                        <TextInput style={{ height: 20, width: 60, borderColor: 'gray', borderWidth: 1 }}
                            value={reps}
                            keyboardType='numeric'
                            onFocus={this.handleFocus}
                            onChange={this.handleRepsChange(idx)}
                        />
                    </View>
                ))}
            </View>
        )
    };

    handleRepsChange = (idx) => () => {

    };

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text>{navigation.getParam('programName')}</Text>
                {navigation.getParam('program').map((day, idx) => ( // already contains entire object
                    <View>
                        <Text> </Text>
                        <Text>{day.val0}</Text>
                        {this.handleLifts(day)}
                    </View>
                ))}
            </View>
        );
    }
}

export default WorkoutScreen;

