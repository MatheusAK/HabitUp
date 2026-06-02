import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.habitup.app',
  appName: 'HabitUp',
  webDir: 'mobile/dist', // ← aponta para o build do mobile
}

export default config