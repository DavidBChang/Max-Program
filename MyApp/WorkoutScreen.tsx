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
                        <Text>{setsReps.sets} sets X {setsReps.reps} reps
                            {setsReps.percentage ? "@ " + setsReps.percentage + "% of 1RM": ""}:
                        </Text>
                        {this.handleInputVolume(setsReps.sets, setsReps.reps, setsReps.percentage)}
                    </View>
                ))}
            </View>
        )
    };

    handleInputVolume = (sets, reps, percent) => {
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
                {this.handleWeights(percent, numSets)}  {/* maybe only do this if percent is not undefined */}
            </View>
        )
    };

    handleWeights = (percentage, numSets) => {  // could percentage be undefined?
        let weight: any = (percentage * this.props.navigation.getParam('programMaxes')) / 100;   // check rounding
        return (                                                                                        // ALSO: use lift name to access max. maybe pass down lift from handleSetsReps
            <View style={{flexDirection: 'row'}}>
                {numSets.map((set, idx) => (
                    <View style={{flexDirection: 'row'}}>
                        <TextInput style={{ height: 20, width: 60, borderColor: 'gray', borderWidth: 1 }}
                                   value={weight}
                                   keyboardType='numeric'
                                   onFocus={this.handleFocus}
                                   onChange={this.handleWeightsChange(idx)}
                        />
                    </View>
                ))}
            </View>
        )
    };

    handleRepsChange = (idx) => () => {

    };

    handleWeightsChange = (idx) => () => {

    };

    render() {
        const { navigation } = this.props;
        return (
            <View style={{backgroundColor: "023e8a"}}>
                <Text>{navigation.getParam('programName')}</Text>
                {navigation.getParam('programDays').map((day, idx) => ( // already contains entire object
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

