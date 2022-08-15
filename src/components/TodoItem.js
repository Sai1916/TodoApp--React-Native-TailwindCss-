import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox';
import Animated,{useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler';
import {Feather} from 'react-native-vector-icons'

const TodoItem = ({item,simultaneousHandlers}) => {
    const [isChecked, setIsChecked] = useState(item.checked);

    //console.log(item);

    const checkChange = () => {
        setIsChecked(!isChecked);
        //console.log(!isChecked);
        item.checked = !isChecked;
    }

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
    })

  return (
    <Animated.View className="flex-row-reverse w-screen m-2" style={rTaskContainerStyle}>
      <Animated.View className="absolute items-center justify-center h-full w-20" style={rIconStyle}>
        <Feather name="trash-2" size={24} color={'red'}/>
      </Animated.View>
     <PanGestureHandler simultaneousHandlers={simultaneousHandlers} onGestureEvent={gestureEvent}>
        <Animated.View className="w-full bg-blue-200 p-3 flex flex-row rounded-xl items-center shadow-lg elevation-1" 
          style={animatedStyle}
        >
            <Checkbox className="rounded-full" value={isChecked} onValueChange={checkChange} />
            <Text className={`${isChecked ? 'line-through text-gray-400' : ''} px-3 text-base`}>{item.data}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default TodoItem