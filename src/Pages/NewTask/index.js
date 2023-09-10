import React, {useState, useRef, useContext} from "react";
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {AuthContext} from '../../Context/auth';

function NewTask(){

    const navigation = useNavigation();
    const textNoteRef = useRef(null);
    const { user } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [textNote, setTextNote] = useState('');


    function Focus(){
        textNoteRef.current.focus();
    }

    async function AddTasks(){

        const userTasks = firestore().collection('tasks').doc(user.uid);
        
        await userTasks.collection('userTasks').add({
            userName: user.name,
            userId: user.uid,
            title: title,
            description: textNote,
            created: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            navigation.navigate('Home')
            setTitle('')
            setTextNote('')
        })
        .catch((err) => {
            console.log(err)
            setTitle('')
            setTextNote('')
        })
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.areaBack}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                    <Feather
                    name="arrow-left"
                    size={40}
                    color="#000"
                    />
                    <Text style={styles.textBack}>Back</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.areaDescription}>
                <View style={styles.title}>
                    <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    style={styles.textTitle}
                    />
                </View>
                <TouchableOpacity style={styles.note} onPress={Focus}>
                    <TextInput
                    placeholder="Note"
                    value={textNote}
                    onChangeText={(text) => setTextNote(text)}
                    style={styles.textNote}
                    multiline={true}
                    ref={textNoteRef}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.AddTask} onPress={AddTasks}>
                <MaterialIcons
                name="domain-verification"
                size={40}
                color="#fff"
                />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default NewTask;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f3f3f3'
    },
    areaBack:{
        borderBottomWidth: 2,
        borderBottomColor: '#c9c9c9',
        backgroundColor: '#d9d9d9',
        elevation: 1.3
    },
    buttonBack:{
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
        paddingVertical: 15,
    },
    textBack:{
        fontSize: 25,
        color: '#000',
        fontWeight: "bold",
        marginLeft: 10
    },
    areaDescription:{
        justifyContent: "flex-start"
    },
    title:{
        height: 55,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
    },
    textTitle:{
        padding: 10,
        fontSize: 20,
        color: '#000',
        fontWeight: '700'
    },
    note:{
        width: '100%',
        height: '100%',
    },
    textNote:{
        padding: 10,
        fontSize: 15,
    },
    AddTask:{
        backgroundColor: '#57D132',
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        right: '7%',
        borderRadius: 15,
        bottom: '4%'
    }
})