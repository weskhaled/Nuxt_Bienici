declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const value: DocumentNode
  export = value
}

declare module '#graphql/schema'
