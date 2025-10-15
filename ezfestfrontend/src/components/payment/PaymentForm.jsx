import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm({ 
  clientSecret, 
  orderId, 
  total, 
  onSuccess, 
  onCancel,
  selectedPayment 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Cliente', // Você pode pedir o nome do cliente se necessário
          },
        }
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pagamento bem-sucedido
        onSuccess(orderId);
      }
    } catch (err) {
      setError('Erro ao processar pagamento: ' + err.message);
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
    <motion.div
      className="bg-[#FAEEDD] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="px-6 pt-8 pb-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onCancel} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-lg font-bold text-gray-800">Pagamento com Cartão</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-6 h-6 text-gray-700 mr-3" />
            <span className="font-semibold text-gray-800">Digite os dados do cartão</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="border-2 border-gray-200 rounded-xl p-4 focus-within:border-[#7C9885] transition-colors">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="saveCard"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="mr-3"
              />
              <label htmlFor="saveCard" className="text-sm text-gray-600">
                Salvar cartão para próximas compras
              </label>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-bold text-lg text-[#7C9885]">
                  R${total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full btn-primary py-6 rounded-xl text-base font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finalizar Pagamento
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}