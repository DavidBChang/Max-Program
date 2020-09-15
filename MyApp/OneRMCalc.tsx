import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { NavigationScreenProp } from "react-navigation";
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import ProgramScreen from "./ProgramScreen";

interface OneRMCalcState {
    oneRM: number;
    weight: any;
    reps: any;
    table: any[];
}

interface OneRMCalcProps {
    navigation: any
}

class OneRMCalc extends Component<OneRMCalcProps, OneRMCalcState> {
    constructor(props) {
        super(props);
        this.state = {
            oneRM: 0,
            weight: "",
            reps: "Select Reps ...",
            table: []
        };
    }

    handleWeight = evt => {
        this.setState({
            weight: evt.target.value
        }, () => {
            console.log("callback");
        });
    };

    handleReps = evt => {
        this.setState({
            reps: evt.target.value
        }, () => {
            console.log("callback");
        });
    };

    createDropDown = () => {
        let i: number;
        let listOptions: any[] = new Array(0);
        // create a list of rpe numbers
        for (i = 1; i <= 10; i++) {
            listOptions[i] = <option>{i}</option>;
        }
        return listOptions;
    };

    handleCalculate = () => {
        let repMax: number = (this.state.weight * 36) / (37 - this.state.reps);
        this.setState({
            oneRM: repMax
        }, () => {
            console.log("callback");
        });
        console.log(JSON.stringify(this.state.weight));
        if (this.state.weight !== "" && this.state.reps !== "Select Reps ...") {
            let percentTable: any[] = [];
            percentTable.push(
                <View style={styles.rowStyle}>
                    <View style={styles.cellStyle}>
                        <Text style={styles.text}>Percentage of 1RM</Text>
                    </View>
                    <View /*style={styles.cellStyle}*/>
                        <Text style={styles.text}>Weight</Text>
                    </View>
                </View>
            );
            let i: number;
            for (i = 200; i >= 100; i = i - 10) {
                let percent = i / 2;
                percentTable.push(
                    <View style={styles.rowStyle}>
                        <View style={styles.cellStyle}>
                            <Text style={styles.text}>{percent}%</Text>
                        </View>
                        <View /*style={styles.cellStyle}*/>
                            <Text style={styles.text}>{Math.round((percent / 100) * repMax)} lbs</Text>
                        </View>
                    </View>
                );
            }
            this.setState({
                table: percentTable
            })
        }
    };

    handleFocus = (event) => event.target.select();

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, backgroundColor: "#191970" }}>
                <View style={styles.rowStyle}>
                    <Text style={styles.text}>{"                      Weight: "}</Text>
                    <TextInput style={styles.text}
                               placeholder={`Enter Weight`}
                               value={this.state.weight}
                               onFocus={this.handleFocus}
                               onChange={this.handleWeight}
                    />
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.text}>{"Reps: "}</Text>
                    <select value={this.state.reps} onChange={this.handleReps}>
                        <option value="">Select Reps ...</option>
                        {this.createDropDown()}
                    </select>
                </View>
                <button style={{ marginBottom: 20 }}
                    type="button"
                    onClick={this.handleCalculate}
                    className="small"
                >
                    Calculate 1RM
                </button>
                <View>
                    <Text style={{ color: '#FFF', fontStyle: 'italic' }}>This calculation uses the Brzycki formula,</Text>
                    <Text style={{ color: '#FFF', fontStyle: 'italic' }}>which may be less accurate with higher reps.</Text>
                </View>
                {this.state.table}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gridContainer: {
        width: 220,
    },
    rowStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        margin: 10,
    },
    cellStyle: {
        flex: 10,
        margin: 10,
        marginRight: 50,
    },
    text: {
        color: '#FFF',
        fontSize: 25,
    }
});

export default OneRMCalc;

