import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Phone, Mail } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const helpOptions = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Fale conosco pelo WhatsApp",
      action: () => window.open("https://wa.me/5511999999999", "_blank"),
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Mail,
      title: "E-mail",
      description: "Envie um e-mail para o suporte",
      action: () => window.open("mailto:suporte@festapay.com", "_blank"),
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Phone,
      title: "Telefone",
      description: "Ligue para nosso suporte",
      action: () => window.open("tel:+5511999999999", "_blank"),
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Ajuda & Suporte</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              Como podemos te ajudar hoje? Escolha uma das opções abaixo:
            </p>

            <div className="space-y-3">
              {helpOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={index}
                    onClick={option.action}
                    className="w-full flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mr-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{option.title}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#7C9885]/10 rounded-xl">
              <h4 className="font-semibold text-[#7C9885] mb-2">Dicas Rápidas</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Verifique se seu pedido está na aba correta</li>
                <li>• Para PIX, o código expira em 6:30 minutos</li>
                <li>• Retirada é feita no balcão com seu código</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}