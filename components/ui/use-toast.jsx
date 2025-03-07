"use client"

import * as React from "react"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let TOAST_ID = 0

const toastTimeouts = new Map()

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

const toastReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case actionTypes.DISMISS_TOAST: {
      const { id } = action

      if (id) {
        addToRemoveQueue(id)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id || id === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.id === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }
    default:
      return state
  }
}

const listeners = [] // Declare listeners here

const addToRemoveQueue = (id) => {
  if (toastTimeouts.has(id)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(id)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      id,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(id, timeout)
}

const dispatch = (() => {
  return (action) => {
    listeners.forEach((listener) => {
      listener(action)
    })
  }
})()

const useToast = () => {
  const [state, setState] = React.useState({ toasts: [] })

  React.useEffect(() => {
    const listener = (action) => {
      setState((prevState) => toastReducer(prevState, action))
    }

    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast: (props) => {
      const id = props.id || String(TOAST_ID++)
      const update = (props) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...props, id },
        })
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, id })

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss()
          },
        },
      })

      return {
        id,
        dismiss,
        update,
      }
    },
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, id: toastId }),
  }
}

const Toaster = ({ ...props }) => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export { useToast, Toaster }

