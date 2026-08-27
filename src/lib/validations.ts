import { z } from 'zod';

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom complet est requis (au moins 2 caractères)'),
  customerEmail: z.string().email('Veuillez renseigner une adresse email valide'),
  customerPhone: z.string().min(10, 'Numéro de téléphone requis pour la livraison'),
  deliveryAddress: z.string().min(5, 'Adresse complète requise'),
  deliveryCity: z.string().min(2, 'Ville requise'),
  deliveryPostalCode: z.string().min(4, 'Code postal requis'),
  deliveryDate: z.string().min(1, 'Date de livraison ou de retrait requise'),
  deliveryTimeSlot: z.string().min(1, 'Veuillez choisir un créneau horaire'),
  deliveryMethod: z.enum(['livraison_express', 'retrait_boutique']),
  paymentMethod: z.enum(['carte', 'paypal', 'livraison']),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const customCakeFormSchema = z.object({
  fullName: z.string().min(2, 'Votre nom est requis'),
  email: z.string().email('Email valide requis'),
  phone: z.string().min(10, 'Numéro de téléphone requis'),
  eventType: z.enum(['anniversaire', 'mariage', 'bapteme', 'entreprise', 'autre']),
  guestCount: z.coerce.number().min(5, 'Minimum 5 personnes'),
  eventDate: z.string().min(1, 'Date de l\'événement requise'),
  budgetRange: z.string().min(1, 'Fourchette de budget requise'),
  flavorPreference: z.string().min(2, 'Préférences de saveurs requises'),
  description: z.string().min(10, 'Veuillez décrire votre projet de gâteau (au moins 10 caractères)'),
});

export type CustomCakeFormData = z.infer<typeof customCakeFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Votre nom est requis'),
  email: z.string().email('Email valide requis'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Objet de votre message requis'),
  message: z.string().min(10, 'Votre message doit comporter au moins 10 caractères'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const productAdminSchema = z.object({
  name: z.string().min(3, 'Nom du gâteau requis'),
  tagline: z.string().min(5, 'Slogan court requis'),
  description: z.string().min(10, 'Description détaillée requise'),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0'),
  discountPrice: z.coerce.number().optional(),
  category: z.enum(['anniversaire', 'mariage', 'cupcakes', 'personnalises', 'entremets', 'coffrets']),
  imageUrl: z.string().url('URL d\'image valide requise'),
  stock: z.coerce.number().min(0, 'Le stock ne peut pas être négatif'),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPromotion: z.boolean().optional(),
  defaultPortions: z.coerce.number().min(1),
  preparationTimeHours: z.coerce.number().min(1),
});

export type ProductAdminFormData = z.infer<typeof productAdminSchema>;
