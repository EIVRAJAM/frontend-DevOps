import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

// === LLAVE PÚBLICA DE PRUEBA DE STRIPE ===
// En producción, esto debería venir de una variable de entorno como import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js no ha cargado aún
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard/portal?payment_intent=success',
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado al procesar el pago.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pagar ahora'}
        </button>
      </div>
    </form>
  );
};

interface StripeCheckoutDialogProps {
  clientSecret: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StripeCheckoutDialog: React.FC<StripeCheckoutDialogProps> = ({
  clientSecret,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#111827',
      colorText: '#f3f4f6',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-gray-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Completa tu pago</h2>

        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <StripeCheckoutForm onSuccess={onSuccess} onCancel={onClose} />
        </Elements>
      </div>
    </div>
  );
};
