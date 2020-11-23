/// <reference types="node" />
/// <reference types="react" />

declare namespace NodeJS {
  interface Process {
    readonly browser: boolean
  }

  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
