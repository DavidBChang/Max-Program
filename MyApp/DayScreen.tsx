import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { NavigationScreenProp } from "react-navigation";
import {View, TextInput, Button, StyleSheet} from 'react-native';
import ReactSlider from 'react-slider'

import ReactDOM from "react-dom";

//import "./style.css";

interface DayScreenState {
    name: string;
    lifts: any[];
    setsReps: any[];
    days: any[];
    verification: any[];
    maxNames: any[];
    visitFlag: boolean;
}

interface DayScreenProps {
    navigation: any
}

class DayScreen extends Component<DayScreenProps, DayScreenState> {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.navigation.getParam('name'),   //""
            lifts: [],  //[{ name: "" }]
            setsReps: this.props.navigation.getParam('day'),    //[]
            days: [],
            verification: [],
            maxNames: [],
            visitFlag: this.props.navigation.getParam('visit')
        };
    }

    handleNameChange = evt => {
        this.setState({ name: evt.target.value });
    };

    handleLiftNameChange = idx => evt => {
        const newLift = this.state.lifts.map((lift, sidx) => {
            if (idx !== sidx) return lift;
            return { ...lift, name: evt.target.value };
        });
        this.setState({ lifts: newLift });
        let path = "changename?newname=" + evt.target.value + "&index=" + idx;
        this.sendRequestAddName(path);
    };

    handleSetsChange = (nameIdx, setIdx) => evt => {
        let path = "changesets?newsets=" + evt.target.value + "&nameindex=" + nameIdx + "&setindex=" + setIdx;
        this.sendRequestAddName(path);
    };

    handleRepsChange = (nameIdx, repIdx) => evt => {
        let path = "changereps?newreps=" + evt.target.value + "&nameindex=" + nameIdx + "&repindex=" + repIdx;
        this.sendRequestAddName(path);
    };

    handleRpeChange = (nameIdx, rpeIdx) => evt => {
        let path = "changerpe?newrpe=" + evt.target.value + "&nameindex=" + nameIdx + "&rpeindex=" + rpeIdx;
        if ((evt.target.value - 0.5) % 1 == 0) {
            let decimal: string = evt.target.value - 0.5 + "D";
            path = "changerpe?newrpe=" + decimal + "&nameindex=" + nameIdx + "&rpeindex=" + rpeIdx;
        }
        this.sendRequestAddName(path);
    };

    handlePercentChange = (lift, nameIdx, repIdx) => evt => {
        let path = "changepercent?newpercent=" + evt.target.value + "&nameindex=" + nameIdx + "&percentindex=" + repIdx;
        if (!this.state.maxNames.includes(lift)) {
            this.setState({
                maxNames: this.state.maxNames.concat(lift)
            });
        }
        this.sendRequestAddName(path);
    };

    handleAddLift = () => {
        this.setState({
            lifts: this.state.lifts.concat([{ name: "" }])
        });
        let path = "addname";
        this.sendRequestAddName(path);
    };

    handleAddSetsReps = idx => () => {
        let path = "addsetrep?index=" + idx;
        this.sendRequestAddName(path);
    };

    async sendRequestAddName(path) {
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
                setsReps: parsedObject
            }, () => {
                console.log("callback");
            });
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    handleRemoveLift = idx => () => {
        this.setState({
            lifts: this.state.lifts.filter((s, sidx) => idx !== sidx)
        });
        let path = "removename?index=" + idx;
        this.sendRequestAddName(path);
    };

    handleRemoveSetsReps = (nameIdx, srIdx) => () => {
        let path = "removesetrep?nameindex=" + nameIdx + "&srindex=" + srIdx;
        this.sendRequestAddName(path);
    };

    handleFocus = (event) => event.target.select();

    createDropDown = () => {
        let i: number;
        let listOptions: any[] = new Array(0);
        // create a list of rpe numbers
        for (i = 7; i <= 10; i += 0.5) {
            listOptions[(i - 7) * 2] = <option>{i}</option>;
        }
        return listOptions;
    };

    completeDay = () => {
        //let path = "complete?dayname=" + this.state.name;
        if (this.state.name !== "" && this.state.name !== undefined) {
            let path1 = "verify";
            let path2 = "checkduplicate?dayname=" + this.state.name;
            //console.log(this.sendRequestVerification(path1, path2));
            this.sendRequestVerification(path1, path2);
            /*
            if (this.sendRequestVerification(path1, path2)) {
                console.log("override is true");
                path += "&override=true";
                this.sendRequestComplete(path);
            } else if (!this.sendRequestVerification(path1, path2)) {   // is this for undefined returns or just false returns?
                console.log("override is false");
                path += "override=false";
                this.sendRequestComplete(path);
            }*/
        } else {
            alert("You have not declared the name of this day.")
        }
    };

    async sendRequestVerification(path1, path2) {
        //let parsedObject: any[] = [];
        try {
            let responsePromise = await fetch('http://localhost:4567/' + path1); // added await
            let response = await responsePromise;
            if (!response.ok) {
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            let parsedObject = await parsingPromise;
            this.setState({
                verification: parsedObject
            }, () => {
                console.log("callback: " + JSON.stringify(this.state.verification));
            });
            let i;
            for (i = 0; i < this.state.maxNames.length; i++) {
                if (!parsedObject.includes(this.state.maxNames[i].val0)) {
                    alert("You have not declared " + JSON.stringify(this.state.maxNames[i].val0) + " to be a max lift.");
                    return;// undefined;// false;
                }
            }

            let path = "complete?dayname=" + this.state.name;
            if (this.state.visitFlag) {
                path += "&override=true";
            } else {
                responsePromise = await fetch('http://localhost:4567/' + path2); // added await
                response = await responsePromise;
                if (!response.ok) {
                    alert("Error!");
                    return;
                }
                parsingPromise = response.json();
                parsedObject = await parsingPromise;
                console.log("dayname: " + parsedObject);
                if (parsedObject) {
                    if (confirm("You already have a day called " + this.state.name + ", do you want to override it with this day?")) {
                        path += "&override=true";
                        //return true;    // sendrequestcomplete override with this day
                    } else {
                        return;
                        //return undefined;   // don't override and don't complete the day
                    }
                } else {
                    path += "&override=false";
                }
            }
            this.sendRequestComplete(path);
            //return false;   // day's name does not already exist
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
                alert("Error!");
                return;
            }
            let parsingPromise = response.json();
            parsedObject = await parsingPromise;
            console.log(parsedObject);
            this.setState({
                days: []//parsedObject
            }, () => {
                console.log("callback: " + JSON.stringify(this.state.days));
            });
            // call another method that uses parsedObject or days and use that method to navigate; get rid of navigation in completeDay
            this.navigateToProgram(parsedObject);
        } catch (e) {
            console.log("Error in requesting data");
        }
    }

    navigateToProgram = (parsedObject) => {
        this.props.navigation.navigate('Program', {
            item: {"David": "chang"},
            program: parsedObject
        })
    };

    handleRemoveDay = () => {

    };

    render() {
        //const { navigation } = this.props;
        console.log("prop " + JSON.stringify(this.state.setsReps));
        return (
            <form>
                <input
                    type="text"
                    placeholder="Name of Day"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <h4>Lifts</h4>

                {this.state.setsReps.map((lift, nameIndex) => (
                    <View>
                        <input
                            type="text"
                            placeholder={`Lift #${nameIndex + 1} name`}
                            value={lift.val0}
                            onChange={this.handleLiftNameChange(nameIndex)}
                        />
                        <button
                            type="button"
                            onClick={this.handleRemoveLift(nameIndex)}
                            className="small"
                        >
                            Delete Lift
                        </button>
                        <button
                            type="button"
                            onClick={this.handleAddSetsReps(nameIndex)}
                            className="small"
                        >
                            Add Sets and Reps
                        </button>
                        {lift.val1.map((sr, srIndex) => ( // {lift.val1.map
                            <View>
                                <TextInput
                                    placeholder={`# of sets`}
                                    value={sr.sets}
                                    keyboardType='numeric'
                                    onFocus={this.handleFocus}
                                    onChange={this.handleSetsChange(nameIndex, srIndex)}
                                />
                                <TextInput
                                    placeholder={`# of reps`}
                                    value={sr.reps}
                                    keyboardType='numeric'
                                    onFocus={this.handleFocus}
                                    onChange={this.handleRepsChange(nameIndex, srIndex)}
                                />
                                <select value={sr.rpe} onChange={this.handleRpeChange(nameIndex, srIndex)}>
                                    <option value="">Select RPE ...</option>
                                    {this.createDropDown()}
                                </select>
                                <TextInput
                                    placeholder={`Percent of 1RM`}
                                    value={sr.percentage}
                                    keyboardType='numeric'
                                    maxLength={3}
                                    onFocus={this.handleFocus}
                                    onChange={this.handlePercentChange(lift, nameIndex, srIndex)}
                                />
                                <button
                                    type="button"
                                    onClick={this.handleRemoveSetsReps(nameIndex, srIndex)}
                                    className="small"
                                >
                                    Delete Sets and Reps
                                </button>

                            </View>
                        ))}
                    </View>
                ))}
                <button
                    type="button"
                    onClick={this.handleAddLift}
                    className="small"
                >
                    Add Lift
                </button>
                <Button
                    title="Complete this Day"
                    onPress={this.completeDay}
                />
            </form>
        );
    }
}

export default DayScreen;

/*
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            lifts: [{ name: "" }],
            setsReps: [{ name: "NAME", scheme: [{sets: "SETS1", reps: "REPS"}, {sets: "SETS2", reps: "REPS"}]}]   // there will already be a sets reps box before clicking add
        };
    }*/
/*
    handleLiftNameChange = idx => evt => {

        const newLift = this.state.setsReps.map((lift, sidx) => {
            if (idx !== sidx) return lift;
            return { ...lift, name: evt.target.value };
        });
        console.log(evt.target.value);
        this.setState({ setsReps: newLift });
        console.log("setsReps after name change: " + this.state.setsReps[idx].name);
    };

    handleSetsRepsNameChange = (nameIdx: number, idx: number) => evt => {

        const newSetsReps = this.state.setsReps[nameIdx].scheme.map((scheme, sidx) => {
            if (idx != sidx) {
                return scheme.sets; // ?
            }
            return { ...scheme, sets: evt.target.value };
        });
        console.log("setsreps: " + evt.target.value);
        this.setState({
            setsReps: [...this.state.setsReps[nameIdx].scheme, newSetsReps]
        });
        //
        console.log("setsreps: " + evt.target.value);
        this.setState( () => ({
            setsReps: {
                ...this.state.setsReps[nameIdx],
                scheme: {
                    ...this.state.setsReps[nameIdx].scheme[idx],
                    sets: evt.target.value
                }
            }
        }));
    };

    handleSubmit = evt => {
        const { name, lifts } = this.state;
        alert(`Incorporated: ${name} with ${lifts.length} shareholders`);
    };

    handleAddLift = () => {
        this.setState({
            setsReps: this.state.setsReps.concat([{ name: "", scheme: [{sets: "", reps: "REPS"}]}])
        })
        //
        this.setState({
            lifts: this.state.lifts.concat([{ name: "" }])
        });
    };

    handleAddSetsReps = (nameIndex: number) => {

        let i: number;
        for (i = 0; i < this.state.setsReps.length; i++) {
            if (this.state.setsReps[i].name === liftName) {
                this.setState({
                    setsReps: this.state.setsReps[i].scheme.concat([{sets: "", reps: "REPS"}])
                });
            }
        }
        console.log("scheme");
        const newSetsReps = this.state.setsReps[nameIndex].scheme.concat([{sets: "", reps: "REPS"}]);

        this.setState({
            setsReps: [...this.state.setsReps[nameIndex].scheme, newSetsReps]
        });
        console.log("scheme: " + this.state.setsReps[nameIndex].scheme);



        console.log("in handleaddsetsreps: " + this.state.setsReps[liftName]);
        if (this.state.setsReps[liftName] === undefined) {
            const elementsIndex = this.state.setsReps.findIndex(element => element.liftName === liftName );
            let newSetReps = [...this.state.setsReps];
            newSetReps[liftName] = {...newSetReps[liftName], sets: ""}
            // need this set state outside the if block?
            this.setState({
                setsReps: newSetReps
            })


            let newSetName = this.state.setsReps.concat([{liftName: [{sets: ""}]}]);
            console.log("in");
            console.log(newSetName);
            this.setState({
                setsReps: newSetName //this.state.setsReps.concat([{liftName: [{sets: ""}]}])
            }, () => {
                console.log(this.state.setsReps); //prints length of 5
            });
            console.log("still in, state is: " + this.state.setsReps);

        }

        console.log(this.state.setsReps[liftName]);
        this.setState({
            setsReps: this.state.setsReps[liftName].concat([{sets: ""}])
        });



    };

    handleRemoveLift = idx => () => {
        this.setState({
            setsReps: this.state.setsReps.filter((s, sidx) => idx !== sidx)
        });
    };

    handleRemoveSetsReps = (name, idx) => () => {
        this.setState({
            setsReps: this.state.setsReps.filter((s, sidx) => idx !== sidx)
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Name of Day"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <h4>Lifts</h4>

                {this.state.setsReps.map((lift, nameIndex) => (    // {this.state.lifts.map((lift, nameIndex) => (
                    <View>
                        <input
                            type="text"
                            placeholder={`Lift #${nameIndex + 1} name`}
                            value={lift.name}
                            onChange={this.handleLiftNameChange(nameIndex)}
                        />
                        <button
                            type="button"
                            onClick={this.handleRemoveLift(nameIndex)}
                            className="small"
                        >
                            -
                        </button>
                        <button
                            type="button"
                            onClick={() => this.handleAddSetsReps(nameIndex)}   //used to be lift.name
                            className="small"
                        >
                            Add Sets and Reps
                        </button>

                        {this.state.setsReps[nameIndex].name !== "" ?
                            this.state.setsReps[nameIndex].scheme.map((set, setIndex) => (
                                <View>
                                    <input
                                        type="text"
                                        placeholder={`Set #${setIndex + 1} name`}
                                        value={set.sets}
                                        onChange={this.handleSetsRepsNameChange(nameIndex, setIndex)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => this.handleRemoveSetsReps(lift.name, setIndex)}
                                        className="small"
                                    >
                                        -
                                    </button>
                                </View>
                            ))
                            : null
                        }
                        <button
                            type="button"
                            onClick={() => this.handleAddSetsReps(nameIndex)}   //used to be lift.name
                            className="small"
                        >
                            Add Sets and Reps
                        </button>

                    </View>
                ))}
                <button
                    type="button"
                    onClick={this.handleAddLift}
                    className="small"
                >
                    Add Lift
                </button>
                <button>Incorporate</button>
            </form>
        );
    }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<IncorporationForm />, rootElement);

export default DayScreen;



//
// interface DayScreenState {
//     name: string;
//     textInput: any[];
//     inputData: any[];
//     setsRepsInput: any[][];
//     setsRepsData: {[key:string]:string[];};
// }
//
// interface DayScreenProps {
//     navigation: any
// }
//
// class DayScreen extends Component<DayScreenProps, DayScreenState> {
//
//     constructor(props){
//         super(props);
//         this.state = {
//             name: "",
//             textInput : [[]],         // should this be a double array?
//             inputData : [],
//             setsRepsInput: [[]],
//             setsRepsData: {}
//         }
//     }
//
//     // function to add sets, reps
//     addSetsReps = (nameIndex, valuesIndex) => {
//         let textInput = this.state.setsRepsInput;   // ?              //this.state.setsRepsInput;
//         textInput[nameIndex] = [];
//         textInput[nameIndex].push(<TextInput style={styles.textInput}
//                                   onChangeText={(text) => this.addValsSetsReps(text, nameIndex)} />);
//         this.setState({
//             setsRepsInput: textInput
//         });
//         console.log(this.state.setsRepsInput);
//     };
//
//     // add values of sets and reps
//     addValsSetsReps = (text, nameIndex) => {
//         let textInput = this.state.setsRepsData;
//         let dataArray = this.state.inputData;
//         let liftName = '';
//         if (dataArray.length !== 0){
//             dataArray.forEach(element => {
//                 // inputData must contain the nameIndex index, so liftName won't be empty
//                 if (element.index === nameIndex ){
//                     liftName = element.text;
//                 }
//             });
//
//             if (textInput.hasOwnProperty(liftName)) { //textInput.some(item => item.hasOwnProperty(liftName))) {
//                 textInput[liftName].push(text)
//             } else {
//                 let newArr: any[] = [text];
//                 textInput[liftName] = newArr;
//             }
//
//             this.setState( {
//                 setsRepsData: textInput
//             })
//         }
//     };
//
//     //function to add TextInput dynamically
//     addTextInput = (index) => {
//         let textInput = this.state.textInput;
//         /*
//         textInput.push(
//             <TextInput style={styles.textInput}
//                        onChangeText={(text) => this.addValues(text, index)} />);
//
//          */
//         textInput.push(
//             <View>
//                 <TextInput style={styles.textInput}
//                            onChangeText={(text) => this.addValues(text, index)} />
//             </View>);
//
//         this.setState({ textInput });
//         console.log('outer element: ' + this.state.textInput);
//         textInput.push(             // we already pushed here
//             <View>
//                 <Button title='Add' onPress={() => this.addSetsReps(index, this.state.setsRepsInput.length)} />
//             </View>);
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
//         return(
//             <View>
//                 <View style= {styles.row}>
//                     <View style={{margin: 10}}>
//                         <Button title='Add' onPress={() => this.addTextInput(this.state.textInput.length)} />
//                     </View>
//                     <View style={{margin: 10}}>
//                         <Button title='Remove' onPress={() => this.removeTextInput()} />
//                     </View>
//                 </View>
//                 <TextInput
//                     placeholder='Name of this Day'
//                     onChangeText={(text) => {
//                         this.setState({
//                             name: text
//                         })
//                     }}/>
//                 {this.state.textInput.map((value) => {
//                     return value
//                 })}
//                 <Button title='Get Values' onPress={() => this.getValues()} />
//                 {this.state.name !== '' ?
//                     <Button
//                         title="Complete this Day"
//                         onPress={() => this.props.navigation.navigate('Program', {
//                             name: this.state.name,
//                             input: this.state.inputData
//                         })}
//                     />
//                     : null
//                 }
//             </View>
//         )
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white',
//     },
//     buttonView: {
//         flexDirection: 'row'
//     },
//     textInput: {
//         height: 40,
//         borderColor: 'black',
//         borderWidth: 1,
//         margin: 20
//     },
//     row:{
//         flexDirection: 'row',
//         justifyContent: 'center'
//     },
// });
//
// export default DayScreen;



