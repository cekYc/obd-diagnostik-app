import { Drawer } from 'expo-router/drawer';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="vehicle-selection"
        options={{
          drawerLabel: 'Araç Seçimi',
          title: 'Araç Seçimi',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="diagnostics"
        options={{
          drawerLabel: 'Tanılama',
          title: 'Tanılama',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="build" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Ayarlar',
          title: 'Ayarlar',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
