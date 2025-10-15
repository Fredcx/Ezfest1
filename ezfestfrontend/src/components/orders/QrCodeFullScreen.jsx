import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';

export default function QRCodeFullScreen({ qrData, isOpen, onClose }) {
  if (!qrData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Card principal com o código e QR */}
          <motion.div
            className="bg-white rounded-3xl p-6 text-center w-full max-w-xs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-500 text-sm mb-2">SEU CÓDIGO</p>
            <p className="text-4xl font-bold text-gray-800 tracking-wider mb-6">
              {qrData.code}
            </p>
            
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center">
                <QRCodeDisplay data={qrData.code} size={250} />
            </div>
          </motion.div>

          {/* Botão de fechar centralizado abaixo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <X className="w-8 h-8" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}