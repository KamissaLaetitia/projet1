import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-caffeine-dark min-h-[75vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-caffeine-card border border-caffeine-gold/30 flex items-center justify-center text-caffeine-gold mb-6 shadow-gold-sm animate-float">
        <Sparkles className="w-10 h-10" />
      </div>
      <span className="text-xs uppercase font-bold text-caffeine-gold tracking-widest block mb-2">
        Erreur 404
      </span>
      <h1 className="font-display font-black text-4xl sm:text-5xl text-caffeine-cream mb-3">
        Page Pâtissière Introuvable
      </h1>
      <p className="text-sm text-caffeine-subtle max-w-md mb-8 leading-relaxed">
        Oups ! Il semblerait que cette douceur ait déjà été dévorée ou que le lien soit expiré.
      </p>
      <Link href="/" className="btn-caffeine-primary text-sm !py-3.5 !px-8 flex items-center gap-2 shadow-gold-md">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à l&apos;Accueil</span>
      </Link>
    </div>
  );
}
