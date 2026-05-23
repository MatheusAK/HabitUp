import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.habitlevelling.app',
  appName: 'HabitLevelling',
  webDir: 'mobile/dist', // ← aponta para o build do mobile
}

export default config