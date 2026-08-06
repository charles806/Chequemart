import { useEffect, useRef, useCallback } from "react";

export function useSocket(url, options = {}) {
  const wsRef = useRef(null);
  const { onMessage, onOpen, onClose, onError, enabled = true } = options;

  useEffect(() => {
    if (!enabled || !url) return;
    
    const connect = () => {
      wsRef.current = new WebSocket(url);
      wsRef.current.onopen = (e) => onOpen?.(e);
      wsRef.current.onmessage = (e) => onMessage?.(e);
      wsRef.current.onclose = (e) => onClose?.(e);
      wsRef.current.onerror = (e) => onError?.(e);
    };

    connect();
    return () => wsRef.current?.close();
  }, [url, enabled]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send, ws: wsRef };
}
