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

interface homeProps {
    navigation: any;
}

class HomeScreen extends Component<homeProps, {}> {
    render() {
        const { navigation } = this.props;
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
                            itemId: 86,
                            program: []
                        });
                    }}
                />
            </View>
        );
    }
}

const RootStack = createStackNavigator({
    Home: HomeScreen,
    Program: ProgramScreen,
    Day: DayScreen,
    Calculator: OneRMCalc
});

export default createAppContainer(RootStack);



// function HomeScreen({ navigation }) {
//     return (
//         <View style={{ flex: 1, alignItems: 'center' }}>
//             <Text>Home Screen</Text>
//             <Button
//                 title="Create New Program"
//                 onPress={() => {
//                     /* 1. Navigate to the Details route with params */
//                     navigation.navigate('Details', {
//                         itemId: 86,
//                         otherParam: 'anything you want here',
//                     });
//                 }}
//             />
//         </View>
//     );
// }

// function ProgramScreen({ route, navigation }) { // if route not empty, then display all the information from DayScreen under "add a day"
//     /* 2. Get the param */
//     const { itemId } = route.params;
//     const { otherParam } = route.params;
//     const styles = StyleSheet.create({
//         text: {
//             color: '#4A90E2',
//             fontSize: 24,
//             padding: 10,
//         }
//     });
//     return (
//         <View>
//             <View style={{alignItems: 'center'}}>
//                 <Text style={styles.text}>
//                     Number of Days in Your Split
//                 </Text>
//             </View>
//             <Button title='Add a Day' onPress={() => navigation.navigate('Day')} />
//         </View>
//         /*
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Details Screen</Text>
//             <Text>itemId: {JSON.stringify(itemId)}</Text>
//             <Text>otherParam: {JSON.stringify(otherParam)}</Text>
//             <Button
//                 title="Go to Details... again"
//                 onPress={() =>
//                     navigation.push('Details', {
//                         itemId: Math.floor(Math.random() * 100),
//                     })
//                 }
//             />
//             <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
//         </View>
//          */
//     );
// }
//
// function DayScreen({ navigation }) {
//     /*
//     const [count, setCount] = React.useState(0);
//
//     const handleIncrease = () => {
//         setCount(count + 1);
//     };
//
//     const handleDecrease = () => {
//         setCount(count - 1);
//     };
//     // instead of Count: {count}, have if else. state will be a boolean. after clicking button, switch value of state
//     // complete this day by sending liftsarr to programscreen
//     return (
//         <div>
//             Count: {count}
//             <hr />
//             <div>
//                 <button type="button" onClick={handleIncrease}>
//                     Increase
//                 </button>
//                 <button type="button" onClick={handleDecrease}>
//                     Decrease
//                 </button>
//             </div>
//         </div>
//     );
//
//      */
//
//     const [dayClicked, setDayClicked] = useState(false);
//     const [day, setDay] = useState('');
//     const [liftClicked, setLiftClicked] = useState(0);
//     const [lift, setLift] = useState('');
//     const handleDay = () => {
//         setDayClicked(true);
//     };
//     const handleLift = () => {
//         setLiftClicked(1);
//     };
//     const createLift = (lift) => {
//         setLift(lift);
//         setLiftClicked(0);
//     };
//     console.log(liftClicked);
//
//     return (
//         <View>
//             <TextInput
//                 style={{height: 40}}
//                 placeholder="Enter the Name of this Day"
//                 onChangeText={day => setDay(day)}
//                 defaultValue={day}
//             />
//             <Text style={{padding: 10, fontSize: 42}}>
//                 {day}
//             </Text>
//             <Text>{liftClicked}</Text>
//             {liftClicked ?
//                 <View>
//                     <TextInput
//                         style={{height: 40}}
//                         placeholder="Enter the Name of this Lift"
//                         onChangeText={lift => createLift(lift)}
//                         defaultValue={lift}
//                     />
//                     <Text>{liftClicked}</Text>
//                 </View> : null}
//             <button type="button" onClick={handleLift}>
//                 Add a Lift
//             </button>
//         </View>
//     )
    /*
    const [day, setDay] = useState('');
    let liftsArray: any[][] = [[]];
    const [lift, setLift] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRpe] = useState(''); // make it optional later
    return (
        <View style={{padding: 10}}>
            <TextInput
                style={{height: 40}}
                placeholder="Enter the Name of this Day"
                onChangeText={day => setDay(day)}
                defaultValue={day}
            />
            <Text style={{padding: 10, fontSize: 42}}>
                {day}
            </Text>

            <button onClick={() => setLift('a')}>
                Add a Lift
            </button>
            {lift === 'a' ?
            <TextInput
                style={{height: 40}}
                placeholder="Enter the Name of this Lift"
                onChangeText={lift => setLift(lift)}
                defaultValue={lift}
            /> : setLift('')}
            <Text>the lift is {}</Text>
            <Button title="Add a Lift" onPress={() =>
                Lift(lift, setLift, sets, setSets)
            } />
            <Button title="Complete this Day" onPress={() => navigation.navigate('Details')} />
        </View>
    );

     */
//}

function Lift(lift, setLift, sets, setSets) {
    return (
        <View>
            <TextInput
                style={{height: 40}}
                placeholder="Enter the Name of this Lift"
                onChangeText={lift => setLift(lift)}
                defaultValue={lift}
            />
            <Text style={{padding: 10, fontSize: 42}}>
                {lift}
            </Text>

            <Button title="Enter new Sets and Reps" onPress={() =>
                <View>
                    <TextInput
                        style={{height: 40}}
                        placeholder="Number of Sets"
                        onChangeText={sets => setSets(sets)}
                        defaultValue={sets}
                    />
                    <Text style={{padding: 10, fontSize: 42}}>
                        {sets}
                    </Text>
                </View>
            } />
        </View>
    )
}
/*
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={MyClass} />
                <Stack.Screen name="Day" component={DayScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
*/




/*
export default function App() {
  let x: number = 3;
  console.log(x);
  return (
    <View style={styles.container}>
      <Text>OPEN up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

 */
