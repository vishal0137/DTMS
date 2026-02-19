import { useState, useEffect, useRef } from 'react'

export function useWebSocket(url, options = {}) {
  const [socket, setSocket] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [readyState, setReadyState] = useState(0) // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED
  const [error, setError] = useState(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = options.maxReconnectAttempts || 5
  const reconnectInterval = options.reconnectInterval || 3000

  const connect = () => {
    try {
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setReadyState(1)
        setError(null)
        reconnectAttempts.current = 0
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch (err) {
          setLastMessage(event.data)
        }
      }
      
      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setReadyState(3)
        setSocket(null)
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError(error)
        setReadyState(3)
      }
      
      setSocket(ws)
      setReadyState(0)
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError(err)
      setReadyState(3)
    }
  }

  useEffect(() => {
    connect()
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [url])

  const sendMessage = (message) => {
    if (socket && readyState === 1) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      socket.send(data)
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socket) {
      socket.close()
    }
    reconnectAttempts.current = maxReconnectAttempts // Prevent reconnection
  }

  return {
    socket,
    lastMessage,
    readyState,
    error,
    sendMessage,
    disconnect,
    isConnected: readyState === 1
  }
}