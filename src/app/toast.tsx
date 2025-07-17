import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  useEffect(() => {
    if (!show) {
      const t = setTimeout(onClose, 300);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  return (
    <div
      aria-live="assertive"
      className={`pointer-events-auto fixed bottom-6 right-6 z-50 max-w-sm transform rounded-lg bg-red-600/90 p-4 text-sm text-white shadow-lg transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="grow font-medium">{message}</span>
        <button
          onClick={() => setShow(false)}
          className="rounded p-0.5 hover:bg-red-700/30 focus:outline-none"
        >
          X
        </button>
      </div>
    </div>
  );
};