import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TailwindProvider } from 'tailwindcss-react-native';
import Navigation from './navigation/TabNavigation';
import { registerRootComponent } from 'expo';


function App() {
  return (
    <TailwindProvider>
        <View className="flex-1">
          <StatusBar style="auto" />
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>          
        </View> 
    </TailwindProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
