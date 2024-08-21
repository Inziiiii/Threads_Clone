import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
		port: 3000,
		// Get rid of the CORS error
		// proxy: {
		// 	"/api": 'https://threads-backend-kzv5.onrender.com',
		// },
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
})
