import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';
import { WorkoutProvider } from '../contexts/workout-context';

export default function RootLayout() {
  const theme = lightTheme; // default to light theme (no option to change to keep simple)

  return (
    <WorkoutProvider>
      <PaperProvider theme = {theme}>
        <Stack>
          <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </WorkoutProvider>
  );
}