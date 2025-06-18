
-- Ajouter la colonne payment_date à la table label_submissions
ALTER TABLE public.label_submissions 
ADD COLUMN payment_date timestamp with time zone;

-- Optionnel : Mettre à jour les enregistrements déjà payés avec la date actuelle
-- (si vous voulez une estimation de la date de paiement pour les paiements existants)
UPDATE public.label_submissions 
SET payment_date = updated_at 
WHERE payment_status = 'paid' AND payment_date IS NULL;
