import { View, Text, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Checkbox from 'expo-checkbox';
import Animated,{useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler';
import {Feather} from 'react-native-vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const TodoItem = ({
  item,
  // simultaneousHandlers,
  // isEdit,
  // setIsEdit,
  // editInput,
  // setEditInput,
  onEditInputValue,
  onDeleteClick,
  index,
  onPressLabel,
  subject,
  isEditing,
  onChangeSubject,
  onFinishEditing
}) => {
    const [isChecked, setIsChecked] = useState(item?.checked);

    //console.log(item);

    const checkChange = () => {
        setIsChecked(!isChecked);
        //console.log(!isChecked);
        item.checked = !isChecked;
    }

    /// Normal PanGestureHandler Code


    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(48);

    const {width: screen_width} = Dimensions.get("window");

    const threshold = screen_width * .3;

    const gestureEvent = useAnimatedGestureHandler({ 
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
          },
        onActive : (event) => {
            translateX.value = event.translationX;
        },
        onEnd : (event) => {

          const shouldDelete = translateX.value < threshold;

          if(shouldDelete){
            translateX.value = withTiming(-screen_width);
            itemHeight.value = withTiming(0);
          }
          else if(event.translationX<-100){
            translateX.value = withTiming(0);
          }
        }
    })

    //console.log("x value ",translateX.value);

    const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            {
              translateX: translateX.value,
            },  
          ],
        }
    ));


    const rIconStyle = useAnimatedStyle(() => {
      const opacity = withTiming(translateX.value < threshold ? 1 : 0);
      return { opacity };
    });

    const rTaskContainerStyle = useAnimatedStyle(() =>{
      return { 
        height : itemHeight.value,
      }
    });


    /// Swipable code

    const trans = useSharedValue(0);
    const animStyles = useAnimatedStyle(() =>{
      return { 
        translateX: trans.value,
      }
    })

    const onEditClick = ({item}) => {
      //Alert.alert("edit clicked");
      if(item?.checked) return;

      return setIsEdit(!isEdit);
    }

    // const onDeleteClick = ({item}) => {
    //   //Alert.alert("edit clicked");
    //   if(item?.checked) return;

    //   return setIsEdit(!isEdit);
    // }
    const renderRightActions = () => {

      return (
        <>
            <Animated.View className="h-full w-32 flex-row items-center justify-evenly">
              <RectButton className="h-full w-1/2 items-center justify-center">
                <TouchableOpacity onPress={() => onEditClick(item)}>
                  <Feather name="edit" size={24} color={'green'}/>
                </TouchableOpacity>
              </RectButton>
              <RectButton className="h-full w-1/2 items-center justify-center">
                  <TouchableOpacity onPress={() => onDeleteClick(item?.id)}>
                    <Feather name="trash-2" size={24} color={'red'}/>
                  </TouchableOpacity>
              </RectButton>
            </Animated.View>
        </>
      );
    };


/////   PanGestureHandler return Code

  // return (
  //   <Animated.View className="flex-row-reverse w-screen m-2" style={rTaskContainerStyle}>
  //     <Animated.View className="absolute items-center justify-center h-full w-20" style={rIconStyle}>
  //       <Feather name="trash-2" size={24} color={'red'}/>
  //     </Animated.View>
  //    <PanGestureHandler simultaneousHandlers={simultaneousHandlers} onGestureEvent={gestureEvent}>
  //       <Animated.View className="w-full bg-blue-200 p-3 flex flex-row rounded-xl items-center shadow-lg elevation-1" 
  //         style={animatedStyle}
  //       >
  //           <Checkbox className="rounded-full" value={isChecked} onValueChange={checkChange} />
  //           <Text className={`${isChecked ? 'line-through text-gray-400' : ''} px-3 text-base`}>{item.data}</Text>
  //       </Animated.View>
  //     </PanGestureHandler>
  //   </Animated.View>
  // )


  ///Swipable return codes

  // const [isEdit,setIsEdit] = useState(false);
  // const [editInput,setEditInput] = useState(item.data);

  // const onEditInputValue = ({val,item}) => {
  //   if(item?.data!=val){
  //     setEditInput(val);
  //     let todosArray = [...data];
  //     todosArray[item?.id] = {...data[item?.id],key: val};
  //     setData(todosArray);
  //   }

  // }

  // const 

  const handleChangeSubject = useCallback(
    (e) => {
      onChangeSubject && onChangeSubject(e)
    },
    [onChangeSubject]
  )

    const [value,setValue] = useState(item?.text);
 
    useEffect(() => {
      if(isEditing && item.id === index && item.text!=value){
        onChangeSubject(value);
        onEditInputValue(value,item);
      }
    },[value])

    return ( 
      <Animated.View className="w-screen m-2" style={rTaskContainerStyle}>
        <Swipeable renderRightActions={renderRightActions}>
          <Animated.View className="w-full bg-blue-200 p-3 flex flex-row rounded-xl items-center shadow-lg elevation-1" 
            //  style={animatedStyle} 
          >
              <Checkbox className="rounded-full" value={isChecked} onValueChange={checkChange} />
              {isEditing && !isChecked ? (
                  <TextInput value={value} 
                  onChangeText={val => setValue(val)}
                  //onChange = {e => onChangeSubject(e.nativeEvent.text)}
                  //onBlur={onFinishEditing}
                  //onChangeText={({val,item}) => onEditInputValue(val,item)} 
                  className="px-3 text-base w-2/3" />
                ) : (
                <Text onPress={onPressLabel} className={`${isChecked ? 'line-through text-gray-400' : ''} px-3 text-base`}>{value}</Text>
              )}
          </Animated.View>
        </Swipeable>
      </Animated.View>
    )

}

export default TodoItem