import { View, Text, Image,Modal, TouchableOpacity, Alert, Pressable, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SvgUri } from "react-native-svg";
import TodoItem from '../components/TodoItem';
import {Feather,AntDesign} from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import todos from '../../assets/data/todos'
import {
  FlatList,
    GestureHandlerRootView,
    PanGestureHandler,
    ScrollView,
  } from 'react-native-gesture-handler';


const Todo = () => {

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, 
        })
    },[])

    

    const [data,setData] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [input,setInput] = useState('');
    
    var count = data.length;

    const addTodo = () => {
        if(input==='') return;

        console.log(`value is ${input}`)
        const newTodo = {
            id: count,
            text: input,
            checked: false,
        }

       // setData([...data,newTodo])

        storeData(newTodo);

        count++;
        
        setInput('');
        
    }
    // console.log(data);
    
   
    // useEffect(() => {
    //     setData(data);
    // },[data])

    const scrollRef = useRef(null);

    //// Todo Edit and Delete Codes


    const [isEdit,setIsEdit] = useState(false);
    const [isEditing,setIsEditing] = useState(false);

    const [subject,setSubject] = useState('task');

  const [editInput,setEditInput] = useState('');

  const onEditInputValue = async (val,item) => {
    console.log("inside edit",val);
    const dataVal = item?.text;
    if(dataVal!=val){
        console.log("inside if in edit");
      setEditInput(val);
      let todosArray = [...data];
      let newDataVal = {
        id: item?.id, 
        text: val,
        checked: item?.checked
      }
      //todosArray[item?.id] = newDataVal;
      //setData(todosArray);

      await AsyncStorage.mergeItem(`@todo_${item?.id}`, JSON.stringify(newDataVal));
      
      console.log("todos array",todosArray);
    }    
    else setEditInput(item?.text);
    
  }



  const onDeleteClick = (idVal) => {
    console.log("onDeleteClick",idVal);
   // let itemValues = data.filter(val => val.id!==index);
   // const indexVal = data.findIndex(dataItem => dataItem.id === index);
   //console.log("id ",newData)
   
   
//    const newData = [...data];
//     newData.splice(index,1);

//     let itemValues = [...data];

//     let newArray = itemValues.filter((val) => val?.id !==index);
//     console.log("new array ",newData)

    // setData(newArray.map((item,index) => ({
    //     id: `${index}`,
    //     text: item.text,
    //     checked: item.checked
    // })));

    // setData(newData);

    const key = `@todo_${idVal}`;
    removeTodo(key);

}


/// AsyncStorage Code  

const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      console.log("jsonValue ",jsonValue);
      await AsyncStorage.setItem(`@todo_${value?.id}`, jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getTodo = async (key) => {
    try {
        //return await AsyncStorage.getItem(key);
        const jsonValue = await AsyncStorage.getItem(key);
        // console.log("getTodo ",jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
  }

  const removeTodo = async (key) => {
    try {
        console.log("key to remove ",key);
      await AsyncStorage.removeItem(key);

    } catch(e) {
      // remove error
    }
  }

const getAllTodos = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
  
    // console.log("keys ",keys)
    
    //let todoDataFromAsyncStorage = await AsyncStorage.multiGet(keys);
    let result = []

    for(var i=0;i<keys.length;i++) {
        const val = await getTodo(keys[i]);
        // const val = todoDataFromAsyncStorage[i][1];
        // console.log("val inside getallkeys ",val);
        result.push(val);
    }

    setData(result);    

    //   console.log(result)
  }

  useEffect(() =>{
       // AsyncStorage.clear();  // to clear all the objects stored in the async storage
      getAllTodos();
  },[getAllTodos,addTodo,removeTodo]);

  return (
    <>
        {data.length>0 ? (
            <GestureHandlerRootView className="flex-1 bg-white">
                    {/* <ScrollView ref={scrollRef}>
                        {data.map((item,index) => ( 
                            
                        ))} 
                    </ScrollView>  */}
                    <FlatList 
                      data={data}
                      keyExtractor = {item => item?.id}
                      renderItem = {({item,index}) => (
                        <TodoItem 
                                itemData = {item}
                                key={item?.id}
                                index = {index}
                                //simultaneousHandlers = {scrollRef}
                                onPressLabel = {() =>setIsEditing(true)}
                                onFinishEditing = {() =>setIsEditing(false)}
                                isEditing = {isEditing}
                                subject = {subject}
                                onChangeSubject = {setSubject}
                                // isEdit = {isEdit}
                                // setIsEdit = {setIsEdit}
                                // editInput = {editInput}
                                // setEditInput = {setEditInput}
                                onEditInputValue = {(subject,item) => onEditInputValue(subject,item)}
                                onDeleteClick = {() => onDeleteClick(item?.id)}
                            />
                      )}
                    />
            </GestureHandlerRootView>
        ) : (
            <View className="flex-1 items-center justify-center bg-white">
                <Image source = {require('../../assets/todoList1.png')} className="h-4/6 w-full resize"/>  
                <Text className="text-center font-bold text-lg bottom-20">No Todos Available</Text>
            </View> 
        )}

            <TouchableOpacity 
                onPress = {() => setShowModal(!showModal)}
                className="bg-blue-500 rounded-full p-2 w-14 h-14 items-center justify-center 
                    absolute bottom-10 right-10 z">
                <Feather name="plus" size={32} color={'black'} />
            </TouchableOpacity>


           { showModal && (

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible = {showModal} 
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setShowModal(!showModal);
                          }}
                    >
                        
                            <View className="h-300 w-full flex justify-between p-4 bg-neutral-200 shadow-transparent absolute z-30 bottom-0 rounded-t-3xl">
                                <View className="flex-row items-center justify-between">
                                   <Text className="text-xl font-bold">Add the Task</Text>
                                    <Pressable className="bg-red-600 rounded-full h-8 w-8 items-center justify-center" onPress={() => setShowModal(!showModal)}>
                                        <AntDesign name="close" size={24} color={'white'} />
                                    </Pressable>
                                </View>
                                <View className="flex m-3">
                                        <TextInput className="p-2 flex-1 border-2 border-red-300 rounded-lg" value={input} onChangeText={(val) => setInput(val)} placeholder="Enter the task..."/>
                                    <TouchableOpacity 
                                        className="px-4 py-3 mt-4 bg-blue-300 w-1/3 rounded-lg items-center" activeOpacity={0.6}
                                        onPress={addTodo}    
                                        > 
                                        <Text>Add Todo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </Modal>
            )
           } 

    </>
  ) 
}

export default Todo