import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import { Language } from '../translations';

interface OmiiAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  initialMode?: 'login' | 'register';
}

export default function OmiiAuthModal({
  isOpen,
  onClose,
  lang = 'ro',
  initialMode = 'login'
}: OmiiAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMsg(null);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return lang === 'ro' 
          ? 'Emailul sau parola introduse sunt incorecte.' 
          : 'El correo o la contraseña son incorrectos.';
      case 'auth/email-already-in-use':
        return lang === 'ro' 
          ? 'Acest email este deja înregistrat. Încearcă să te autentifici.' 
          : 'Este correo ya está registrado. Intenta iniciar sesión.';
      case 'auth/weak-password':
        return lang === 'ro' 
          ? 'Parola trebuie să aibă cel puțin 6 caractere.' 
          : 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return lang === 'ro' 
          ? 'Adresa de email nu este validă.' 
          : 'La dirección de correo no es válida.';
      case 'auth/popup-closed-by-user':
        return lang === 'ro'
          ? 'Autentificarea cu Google a fost anulată.'
          : 'El inicio de sesión con Google fue cancelado.';
      default:
        return lang === 'ro' 
          ? 'A apărut o eroare la autentificare. Încearcă din nou.' 
          : 'Ocurrió un error al autenticar. Inténtalo de nuevo.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) {
          throw new Error(lang === 'ro' ? 'Te rugăm să introduci numele tău.' : 'Por favor ingresa tu nombre.');
        }
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res.user) {
          await updateProfile(res.user, { displayName: name.trim() });
        }
        onClose();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg(
          lang === 'ro' 
            ? 'Am trimis un email de resetare a parolei. Verifică-ți căsuța poștală!' 
            : 'Hemos enviado un correo para restablecer la contraseña. ¡Revisa tu bandeja!'
        );
      }
    } catch (err: any) {
      if (err.code) {
        setError(getFriendlyErrorMessage(err.code));
      } else {
        setError(err.message || 'Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 pt-8 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-blue-400/40">
            a
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login' && (lang === 'ro' ? 'Autentificare pe Omii' : 'Iniciar sesión en Omii')}
            {mode === 'register' && (lang === 'ro' ? 'Creează un cont nou' : 'Crear una cuenta nueva')}
            {mode === 'forgot' && (lang === 'ro' ? 'Resetare parolă' : 'Restablecer contraseña')}
          </h2>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            {lang === 'ro' ? 'Accesează anunțurile și profilul tău Omii' : 'Accede a tus anuncios y perfil de Omii'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-5 space-y-4">
          
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {lang === 'ro' ? 'Autentificare' : 'Iniciar sesión'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {lang === 'ro' ? 'Înregistrare' : 'Registrarse'}
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200/80 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Name Field (Register Mode) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  {lang === 'ro' ? 'Nume și prenume' : 'Nombre completo'}
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ro' ? 'ex. Alex Popescu' : 'ej. Alex Popescu'}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                {lang === 'ro' ? 'Adresă de email' : 'Correo electrónico'}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nume@domeniu.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field (Login / Register Mode) */}
            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    {lang === 'ro' ? 'Parolă' : 'Contraseña'}
                  </label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      {lang === 'ro' ? 'Ai uitat parola?' : '¿Olvidaste tu contraseña?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && (lang === 'ro' ? 'Intră în cont' : 'Entrar a la cuenta')}
                    {mode === 'register' && (lang === 'ro' ? 'Creează contul Omii' : 'Crear cuenta Omii')}
                    {mode === 'forgot' && (lang === 'ro' ? 'Trimite linkul de resetare' : 'Enviar enlace de restablecimiento')}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Google Login Button */}
          {mode !== 'forgot' && (
            <>
              <div className="relative flex items-center my-3">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="shrink-0 px-3 text-[11px] font-semibold text-gray-400 uppercase">
                  {lang === 'ro' ? 'sau' : 'o'}
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200/90 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span>{lang === 'ro' ? 'Continuă cu Google' : 'Continuar con Google'}</span>
              </button>
            </>
          )}

          {/* Footer Navigation */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full text-center text-xs font-bold text-blue-600 hover:underline cursor-pointer pt-1"
            >
              ← {lang === 'ro' ? 'Înapoi la autentificare' : 'Volver al inicio de sesión'}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
