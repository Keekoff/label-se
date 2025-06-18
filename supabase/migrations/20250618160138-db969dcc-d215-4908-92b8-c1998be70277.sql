
-- Ajouter les colonnes pour stocker les détails de paiement réels
ALTER TABLE public.label_submissions 
ADD COLUMN amount_paid INTEGER, -- Montant en centimes (comme Stripe)
ADD COLUMN currency TEXT DEFAULT 'eur',
ADD COLUMN discount_applied INTEGER DEFAULT 0, -- Montant de la remise en centimes
ADD COLUMN stripe_invoice_id TEXT, -- ID de la facture Stripe
ADD COLUMN stripe_session_id TEXT; -- ID de la session Stripe pour référence

-- Ajouter un index sur les IDs Stripe pour les performances
CREATE INDEX IF NOT EXISTS idx_label_submissions_stripe_session_id ON public.label_submissions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_label_submissions_stripe_invoice_id ON public.label_submissions(stripe_invoice_id);

-- Mettre à jour les données existantes de Florian avec le bon montant (1€ = 100 centimes)
UPDATE public.label_submissions 
SET 
  amount_paid = 100, -- 1€ en centimes
  discount_applied = 66567, -- 666,67€ - 1€ = 665,67€ de remise en centimes
  currency = 'eur'
WHERE courriel = 'florian.gardesse@gmail.com' 
AND nom_entreprise = 'Papacito';
