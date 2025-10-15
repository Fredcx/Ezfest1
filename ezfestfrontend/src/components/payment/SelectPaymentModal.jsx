import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Plus, CreditCard } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import AddCardFormModal from './AddCardFormModal';

export default function SelectPaymentModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  savedCards = [], 
  onCardAdded,
  baseMethods = [],
  stripePromise 
}) {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddCardSuccess = () => {
    setIsAddCardOpen(false);
    onCardAdded && onCardAdded();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="bg-white w-full max-w-lg rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Escolher forma de pagamento</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Métodos base (PIX, Cartão) */}
            {baseMethods.map((method) => {
              const MethodIcon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    onSelect(method);
                    onClose();
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[#7C9885] text-left flex items-center space-x-3 transition-all bg-white"
                >
                  <MethodIcon className="w-6 h-6 text-gray-700" />
                  <span className="font-semibold text-gray-800">{method.name}</span>
                </button>
              );
            })}

            {/* Cartões Salvos */}
            {savedCards.length > 0 && (
              <>
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">CARTÕES SALVOS</h3>
                </div>
                {savedCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      onSelect({
                        id: card.id,
                        name: `${card.card_brand} •••• ${card.last_four_digits}`,
                        icon: CreditCard,
                        isCard: true,
                        savedCard: card
                      });
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[#7C9885] text-left flex items-center space-x-3 transition-all bg-white"
                  >
                    <CreditCard className="w-6 h-6 text-gray-700" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {card.card_brand} •••• {card.last_four_digits}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{card.card_type}</p>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Adicionar novo cartão */}
            <button
              onClick={() => setIsAddCardOpen(true)}
              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#7C9885] text-left flex items-center space-x-3 transition-all bg-gray-50 hover:bg-gray-100"
            >
              <Plus className="w-6 h-6 text-gray-500" />
              <span className="font-semibold text-gray-600">Adicionar novo cartão</span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal de Adicionar Cartão */}
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <AddCardFormModal
            isOpen={isAddCardOpen}
            onClose={() => setIsAddCardOpen(false)}
            onSuccess={handleAddCardSuccess}
          />
        </Elements>
      )}
    </>
  );
}