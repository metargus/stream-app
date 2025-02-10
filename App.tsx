// App.tsx
import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const App = () => {

   useEffect(() => {
      GoogleSignin.configure({
         webClientId: '46319718455-76qepinjbno546bp3kk6vrn91k6b0a00.apps.googleusercontent.com',
         offlineAccess: true,
      });
   }, []);
    
  return (
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
  );
};

export default App;