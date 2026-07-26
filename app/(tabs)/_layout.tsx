import { Tabs } from 'expo-router';

import { CustomTabBar } from '../../components/ui/CustomTabBar';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar state={props.state} navigation={props.navigation} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
