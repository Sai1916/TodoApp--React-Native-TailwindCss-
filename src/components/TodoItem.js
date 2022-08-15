import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox';
import Animated,{useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler';
import {Feather} from 'react-native-vector-icons'

const TodoItem = ({item}) => {
    const [isChecked, setIsChecked] = useState(item.checked);

    //console.log(item);

    const checkChange = () => {
        setIsChecked(!isChecked);
        //console.log(!isChecked);
        item.checked = !isChecked;
    }

    const translateX = useSharedValue(0);

    const gestureEvent = useAnimatedGestureHandler({ 
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
          },
        onActive : (event) => {
            translateX.value = event.translationX;
        },
        onEnd : (event) => {
            translateX.value = 0;
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

  return (
    <PanGestureHandler onGestureEvent={gestureEvent}>
      <>
        {/* <TouchableOpacity>
          <Feather name="trash-2" size={24} />
        </TouchableOpacity> */}
        <Animated.View className="mx-2 my-3 bg-blue-200 p-3 flex flex-row rounded-xl items-center shadow-lg elevation-1" style={animatedStyle}>
            <Checkbox className="rounded-full" value={isChecked} onValueChange={checkChange} />
            <Text className={`${isChecked ? 'line-through text-gray-400' : ''} px-3 text-base`}>{item.data}</Text>
        </Animated.View>
      </>
    </PanGestureHandler>
  )
}

export default TodoItem