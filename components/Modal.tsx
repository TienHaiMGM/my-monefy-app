// components/Modal.tsx
"use client";
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-lg">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
}
