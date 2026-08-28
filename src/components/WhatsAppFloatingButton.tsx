'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside aria-label="Assistance WhatsApp">
      <a
        href="https://wa.me/2250787932595"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp avec le service client"
        className="fixed bottom-5 right-5 z-50 group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 sm:px-5 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        {/* Pulse effect ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping duration-1000 -z-10" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current" />

        {/* Label Text */}
        <span className="font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
          WhatsApp
        </span>
      </a>
    </aside>
  );
};
