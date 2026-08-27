'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FAField, setShow2FAField] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Mode Réinitialisation de mot de passe
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetErrors, setResetErrors] = useState<string[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: show2FAField ? twoFactorCode : undefined,
          require2FA: show2FAField,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setIsLocked(true);
        }
        setErrorMessage(data.error || 'Échec de l\'authentification.');
        return;
      }

      // Connexion réussie -> Redirection
      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMessage('Une erreur de communication est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: resetEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Erreur lors de la demande.');
        return;
      }

      setResetSuccess(data.message);
      if (data.debugToken) {
        setResetToken(data.debugToken);
      }
      setResetStep(2);
    } catch {
      setErrorMessage('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetErrors([]);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          token: resetToken,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Échec de la réinitialisation.');
        if (data.details) setResetErrors(data.details);
        return;
      }

      setResetSuccess('Mot de passe mis à jour ! Vous pouvez vous connecter.');
      setTimeout(() => {
        setIsResetMode(false);
        setResetStep(1);
        setPassword(newPassword);
        setEmail(resetEmail);
      }, 2000);
    } catch {
      setErrorMessage('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-caffeine-dark flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white border border-caffeine-gold/50 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(180,130,80,0.18)] space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-caffeine-gold to-caffeine-goldHover text-white flex items-center justify-center mx-auto shadow-gold-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-caffeine-gold tracking-widest block">
              Pâtisserie Royale • Espace Sécurisé
            </span>
            <h1 className="font-display font-black text-2xl text-caffeine-cream mt-1">
              {isResetMode ? 'Réinitialisation Mot de Passe' : 'Connexion Administrateur'}
            </h1>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">{errorMessage}</span>
              {resetErrors.length > 0 && (
                <ul className="list-disc list-inside text-[11px] space-y-0.5">
                  {resetErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {resetSuccess && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {!isResetMode ? (
          /* ========================================================================= */
          /* FORMULAIRE DE CONNEXION PRINCIPAL                                         */
          /* ========================================================================= */
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                Adresse Email Administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-caffeine-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={isLocked || loading}
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-caffeine-subtle uppercase">
                  Mot de Passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-caffeine-gold hover:underline font-bold"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-caffeine-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLocked || loading}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream placeholder:text-caffeine-muted focus:outline-none focus:border-caffeine-gold focus:bg-white shadow-sm transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-caffeine-subtle hover:text-caffeine-cream absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Option 2FA Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-caffeine-subtle">
                <input
                  type="checkbox"
                  checked={show2FAField}
                  onChange={(e) => setShow2FAField(e.target.checked)}
                  className="accent-caffeine-gold rounded"
                />
                <span className="font-semibold">Activer la vérification à deux facteurs (2FA)</span>
              </label>

              {show2FAField && (
                <div className="mt-2 animate-fade-in">
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-caffeine-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Code OTP (ex: 123456 ou code secours)"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-gold/50 text-xs text-caffeine-cream focus:outline-none focus:bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="btn-caffeine-primary w-full text-sm !py-3.5 shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Accéder au Back-Office</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Note de sécurité */}
            <div className="p-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder/60 text-[10px] text-caffeine-subtle text-center">
              🔒 Connexion chiffrée SSL • Hachage PBKDF2 SHA-512 • Protection Anti-Brute-force
            </div>

          </form>
        ) : (
          /* ========================================================================= */
          /* FORMULAIRE DE RÉINITIALISATION DU MOT DE PASSE                            */
          /* ========================================================================= */
          <div className="space-y-4 animate-fade-in">
            {resetStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                    Votre Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-caffeine-primary w-full text-xs !py-3 shadow-gold-sm"
                >
                  {loading ? 'Génération...' : 'Générer un Jeton Sécurisé'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                    Jeton à usage unique (Token)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jeton cryptographique (64 caractères)"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs text-caffeine-cream font-mono focus:outline-none focus:border-caffeine-gold shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-caffeine-subtle uppercase mb-1">
                    Nouveau Mot de Passe Robuste
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 10 car., Maj., Min., Chiffre & Spécial"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-caffeine-surface border border-caffeine-cardBorder text-xs sm:text-sm text-caffeine-cream focus:outline-none focus:border-caffeine-gold shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-caffeine-primary w-full text-xs !py-3 shadow-gold-sm"
                >
                  {loading ? 'Mise à jour...' : 'Appliquer le Nouveau Mot de Passe'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setResetStep(1);
                setErrorMessage(null);
                setResetSuccess(null);
              }}
              className="text-xs text-caffeine-subtle hover:text-caffeine-gold text-center block w-full pt-2 font-bold"
            >
              ← Retour à la connexion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-caffeine-dark flex items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full border-4 border-caffeine-gold border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
