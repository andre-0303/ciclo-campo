import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'CicloCampo',
        short_name: 'CicloCampo',
        description: 'Diário de Bordo Digital para Hortas Escolares',
        theme_color: '#15803d',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [] // Deixado vazio para o usuário adicionar seus próprios ícones depois
      }
    })
  ],
})
