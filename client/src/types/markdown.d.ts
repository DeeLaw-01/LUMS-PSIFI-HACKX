import { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react-markdown' {
  interface CodeProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    inline?: boolean
  }
}

export {}
