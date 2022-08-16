import { View, Text, Image,Modal, TouchableOpacity, Alert, Pressable, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SvgUri } from "react-native-svg";
import TodoItem from '../components/TodoItem';
import {Feather,AntDesign} from 'react-native-vector-icons';
import AddTodo from './AddTodo';
import todos from '../../assets/data/todos'
import {
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

        setData([...data,newTodo])

        count++;

        setInput('');

    }
    console.log(data);

    // useEffect(() => {
    //     setData(data);
    // },[data])

    const scrollRef = useRef(null);

    //// Todo Edit and Delete Codes


    const [isEdit,setIsEdit] = useState(false);
    const [isEditing,setIsEditing] = useState(false);

    const [subject,setSubject] = useState('task');

  const [editInput,setEditInput] = useState('');

  const onEditInputValue = (val,item) => {
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
      todosArray[item?.id] = newDataVal;
      setData(todosArray);
      
      console.log("todos array",todosArray);
    }    
    else setEditInput(item?.text);
    
  }



  const onDeleteClick = (index) => {
    console.log("onDeleteClick",index);
   // let itemValues = data.filter(val => val.id!==index);
    const newData = [...data];
    // const indexVal = data.findIndex(dataItem => dataItem.id === index);
    newData.splice(index,1);
    //console.log("id ",newData)

    let itemValues = [...data];

    let newArray = itemValues.filter((val) => val?.id !==index);
    //console.log("new array ",newArray)
    console.log("new array ",newData)

    // setData(newArray.map((item,index) => ({
    //     id: `${index}`,
    //     text: item.text,
    //     checked: item.checked
    // })));

    setData(newData);
  }

  useEffect(() =>{
    setData(data);
  },[data]);

  return (
    <>
        {data.length>0 ? (
            <GestureHandlerRootView className="bg-white flex-1">
                <ScrollView ref={scrollRef}>
                    {data.map((item,index) => (
                        <TodoItem 
                        item = {item}
                        key={index}
                        index = {item?.id}
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
                    ))}
                </ScrollView> 
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
                                   <Text>Add the Task</Text>
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