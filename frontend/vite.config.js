import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        adminDashboard: resolve(
          __dirname,
          'admin-dashboard.html'
        ),
        volunteerDashboard: resolve(
          __dirname,
          'volunteer-dashboard.html'
        ),
        radio: resolve(
          __dirname,
          'radio.html'
        ),
      },
    },
  },
})