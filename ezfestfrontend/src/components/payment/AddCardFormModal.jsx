import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createSetupIntent } from '@/functions/createSetupIntent';
import { savePaymentMethod } from '@/functions/savePaymentMethod';

export default function AddCardFormModal({ isOpen, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardType, setCardType] = useState('credito');

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Criar Setup Intent
      const { data: setupData } = await createSetupIntent();
      
      if (!setupData || !setupData.clientSecret) {
        throw new Error('Erro ao preparar salvamento do cartão');
      }

      const cardElement = elements.getElement(CardElement);

      // Confirmar Setup Intent
      const { error, setupIntent } = await stripe.confirmCardSetup(
        setupData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Cliente',
            },
          }
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      // Salvar Payment Method no banco de dados
      const saveResponse = await savePaymentMethod({
        paymentMethodId: setupIntent.payment_method,
        cardType: cardType
      });

      if (saveResponse.data && saveResponse.data.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error('Erro ao salvar cartão no banco de dados');
      }

    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao salvar cartão: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Inter, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Adicionar Cartão</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo do cartão
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="credito"
                    checked={cardType === 'credito'}
                    onChange={(e) => setCardType(e.target.value)}
                    className="mr-2"
                  />
                  Crédito
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="debito"
                    checked={cardType === 'debito'}
                    onChange={(e) => setCardType(e.target.value)}
                    className="mr-2"
                  />
                  Débito
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dados do cartão
              </label>
              <div className="border-2 border-gray-200 rounded-xl p-4 focus-within:border-[#7C9885] transition-colors">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1 btn-primary"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Salvar Cartão
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}