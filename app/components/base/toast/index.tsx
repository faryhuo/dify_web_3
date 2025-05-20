'use client'
import classNames from 'classnames'
import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import { createContext, useContext } from 'use-context-selector'

export type IToastProps = {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  message: string
  children?: ReactNode
  onClose?: () => void
}
type IToastContext = {
  notify: (props: IToastProps) => void
}
const defaultDuring = 3000

export const ToastContext = createContext<IToastContext>({} as IToastContext)
export const useToastContext = () => useContext(ToastContext)

const Toast = ({
  type = 'info',
  duration,
  message,
  children,
}: IToastProps) => {
  // sometimes message is react node array. Not handle it.
  if (typeof message !== 'string')
    return null

  return <div className={classNames(
    'fixed rounded-lg p-4 my-4 mx-8 z-50',
    'top-4',
    'right-4',
    'shadow-lg backdrop-blur-sm',
    'transform transition-all duration-300 ease-in-out',
    'hover:shadow-xl',
    type === 'success' ? 'bg-green-50/90 border border-green-200' : '',
    type === 'error' ? 'bg-red-50/90 border border-red-200' : '',
    type === 'warning' ? 'bg-yellow-50/90 border border-yellow-200' : '',
    type === 'info' ? 'bg-blue-50/90 border border-blue-200' : '',
  )}>
    <div className="flex items-start">
      <div className="flex-shrink-0">
        {type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-500" aria-hidden="true" />}
        {type === 'error' && <XCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />}
        {type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" aria-hidden="true" />}
        {type === 'info' && <InformationCircleIcon className="w-5 h-5 text-blue-500" aria-hidden="true" />}
      </div>
      <div className="ml-3">
        <h3 className={
          classNames(
            'text-sm font-medium',
            type === 'success' ? 'text-green-900' : '',
            type === 'error' ? 'text-red-900' : '',
            type === 'warning' ? 'text-yellow-900' : '',
            type === 'info' ? 'text-blue-900' : '',
          )
        }>{message}</h3>
        {children && <div className={
          classNames(
            'mt-2 text-sm',
            type === 'success' ? 'text-green-800' : '',
            type === 'error' ? 'text-red-800' : '',
            type === 'warning' ? 'text-yellow-800' : '',
            type === 'info' ? 'text-blue-800' : '',
          )
        }>
          {children}
        </div>
        }
      </div>
    </div>
  </div>
}

export const ToastProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const placeholder: IToastProps = {
    type: 'info',
    message: 'Toast message',
    duration: 3000,
  }
  const [params, setParams] = React.useState<IToastProps>(placeholder)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        setMounted(false)
      }, params.duration || defaultDuring)
    }
  }, [mounted])

  return <ToastContext.Provider value={{
    notify: (props) => {
      setMounted(true)
      setParams(props)
    },
  }}>
    {mounted && <Toast {...params} />}
    {children}
  </ToastContext.Provider>
}

Toast.notify = ({
  type,
  message,
  duration,
}: Pick<IToastProps, 'type' | 'message' | 'duration'>) => {
  if (typeof window === 'object') {
    const holder = document.createElement('div')
    const root = createRoot(holder)

    root.render(<Toast type={type} message={message} duration={duration} />)
    document.body.appendChild(holder)
    setTimeout(() => {
      if (holder)
        holder.remove()
    }, duration || defaultDuring)
  }
}

export default Toast
