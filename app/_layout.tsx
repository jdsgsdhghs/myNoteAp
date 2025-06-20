import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{}}>
      {/*<Stack.Screen name="(tabs)" options={{headerShown:false}} />*/}
      <Stack.Screen name="index" options={{headerShown:false}} />
      <Stack.Screen name="form" options={{headerShown:false}} />
    </Stack>
  );
}
