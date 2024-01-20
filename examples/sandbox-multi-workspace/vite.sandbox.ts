import { Alias, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { GlobSync } from 'glob'
import { resolve } from 'node:path'
import fs from 'fs-extra'
import basicSsl from '@vitejs/plugin-basic-ssl'

const getWorkspaceAlias = () => {
  const basePath = resolve(__dirname, '../../')
  const pkg = fs.readJSONSync(resolve(basePath, 'package.json')) || {}
  const alias: Alias[] = []
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const { found } = new GlobSync(pattern, { cwd: basePath })
      found.forEach((name) => {
        try {
          const pkg = fs.readJSONSync(resolve(basePath, name, './package.json'))
          alias.push({
            find: pkg.name,
            replacement: resolve(basePath, name, './src'),
          })
        } catch (error) {}
      })
    })
  }
  return alias
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      { find: '@', replacement: resolve(__dirname, 'src') },
      ...getWorkspaceAlias(),
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        charset: false,
      },
    },
  },
  build: {
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/sandbox.tsx'),
      name: 'sandbox',
      // the proper extensions will be added
      fileName: 'sandbox.bundle',
      formats: ['umd'],
    },
    cssTarget: 'chrome58',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'antd',
        'dayjs',
        // Designable
        '@antdev/designable-core',

        // Formily
        '@formily/react',
        '@formily/reactive',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          dayjs: 'dayjs',
          // Designable
          '@antdev/designable-core': 'Designable.Core',
          // Formily
          '@formily/core': 'Formily.Core',
          '@formily/reactive': 'Formily.Reactive',
        },
      },
    },
  },
})
