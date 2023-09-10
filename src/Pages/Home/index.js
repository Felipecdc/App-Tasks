import React, {useContext, useState, useEffect} from "react";
import {View, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, FlatList, } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ListTasks from "../../Components/ListTasks";
import {AuthContext} from '../../Context/auth'

function Home(){

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { signed, user } = useContext(AuthContext);

    const [input, setInput] = useState('');
    const [refresh, setRefresh] = useState(false)
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        let isActive = true

        async function PushTasks(){
            await firestore().collection('tasks').doc(user.uid)
            .collection('userTasks')
            .get()
            .then((snapshot) => {
                setTasks([])
                
                const tasksList = [];
        
                snapshot.docs.map( doc => {
                    tasksList.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })
        
                setTasks(tasksList);
            })
        }

        PushTasks();

        return () => {
            isActive = false;
         }

    }, [isFocused, refresh])

    async function DeletTask(id){
        await firestore().collection('tasks')
        .doc(user.uid)
        .collection('userTasks')
        .doc(id)
        .delete()

        setRefresh(!refresh)
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.containerNav}>
                <View style={styles.AreaNavi}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}
                    style={{position: 'absolute', left: 10}}
                    >
                        <Feather
                        name="menu"
                        size={30}
                        color="#000"
                        />
                    </TouchableOpacity>
                    <View style={styles.areaInput}>
                        <TextInput
                        placeholder="Search your notes"
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        style={styles.input}
                        />
                    </View>
                    <TouchableOpacity style={{position: 'absolute', right: 10}}>
                        <FontAwesome
                        name="user-circle"
                        size={30}
                        color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.AddTask} onPress={() => navigation.navigate('NewTask')}>
                <Feather
                name="plus"
                size={40}
                color="#fff"
                />
            </TouchableOpacity>

            <View style={{flex: 1}}>
                <FlatList
                showsVerticalScrollIndicator={false}
                data={tasks}
                renderItem={({item}) => <ListTasks data={item} Delet={() => DeletTask(item.id)}/>}
                />
            </View>
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f3f3f3'
    },
    containerNav:{
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: 100,
    },
    AreaNavi:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#d8d8d8',
        width: '85%',
        paddingHorizontal: 15,
        borderRadius: 30,
    },
    areaInput:{
        width: '80%',
    },
    input:{
        fontSize: 20,
        textAlign: "center",
        paddingHorizontal: 10
    },
    AddTask:{
        backgroundColor: '#2389EF',
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        right: '7%',
        borderRadius: 15,
        bottom: '4%',
        zIndex: 99
    }
})