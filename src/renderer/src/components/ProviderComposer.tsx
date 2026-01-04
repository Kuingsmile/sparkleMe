import { ComponentType, ReactNode } from 'react'

interface ProviderProps {
  children: ReactNode
}

export type ProviderConfig = ComponentType<ProviderProps> | [ComponentType<any>, any]

interface Props {
  providers: ProviderConfig[]
  children: ReactNode
}

export const ProviderComposer = ({ providers, children }: Props) => {
  return (
    <>
      {providers.reduceRight((acc, provider) => {
        if (Array.isArray(provider)) {
          const [Provider, props] = provider
          return <Provider {...props}>{acc}</Provider>
        }
        const Provider = provider
        return <Provider>{acc}</Provider>
      }, children)}
    </>
  )
}
