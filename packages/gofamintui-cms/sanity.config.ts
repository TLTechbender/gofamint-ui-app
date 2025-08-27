import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CodeIcon, RocketIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'

export default defineConfig([
  {
    name: 'development-workspace',
    title: 'GOFAMINT UI - Development',
    basePath: '/development',
    subtitle: 'Development workspace',
    icon: CodeIcon,
    projectId: '276it5za',
    dataset: 'development',
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: 'production-workspace',
    title: 'GOFAMINT UI - Production',
    basePath: '/production',
    subtitle: 'Live content',
    icon: RocketIcon,
    projectId: '276it5za',
    dataset: 'production',
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
])
