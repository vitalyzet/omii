import React from 'react';
import { 
  Building2, 
  Car, 
  Briefcase, 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight
} from 'lucide-react';

interface OmiiFooterProps {
  onGoHome?: () => void;
}

export default function OmiiFooter({ onGoHome }: OmiiFooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto font-sans">
      {/* Top Banner / Feature Highlights */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-8">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Siguranță garantată</h4>
              <p className="text-xs text-gray-500">Anunțuri verificate manual</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Car size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Mii de vehicule</h4>
              <p className="text-xs text-gray-500">Mașini noi și rulate</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Imobiliare premium</h4>
              <p className="text-xs text-gray-500">Apartamente și case</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Locuri de muncă</h4>
              <p className="text-xs text-gray-500">Joburi active în România</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <div 
              onClick={onGoHome}
              className={`flex items-center space-x-2 ${onGoHome ? 'cursor-pointer select-none group' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                a
              </div>
              <span className="font-bold text-2xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">Omii</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Platforma ta de încredere pentru anunțuri din România: imobiliare, auto, locuri de muncă, servicii și multe altele. Simplu, sigur și rapid.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold text-xs">
                FB
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold text-xs">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold text-xs">
                LN
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold text-xs">
                YT
              </a>
            </div>
          </div>

          {/* Categorii */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Categorii</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Vehicule</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Imobiliare</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Locuri de muncă</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Compraventa</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Servicii</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Negocios</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Ocio</a></li>
            </ul>
          </div>

          {/* Links Utile */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Informații</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Despre noi</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cum funcționează</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Ajutor & FAQ</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Reguli de siguranță</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Termeni și condiții</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Politica de confidențialitate</a></li>
            </ul>
          </div>

          {/* Contact & Locații */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Orașe Principale</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">București <ArrowUpRight size={12} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">Cluj-Napoca <ArrowUpRight size={12} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">Timișoara <ArrowUpRight size={12} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">Brașov <ArrowUpRight size={12} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">Iași <ArrowUpRight size={12} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center justify-between">Constanța <ArrowUpRight size={12} /></a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-100 bg-gray-50 py-6">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} Omii. Toate drepturile rezervate.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Termeni</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Confidențialitate</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Harta site-ului</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
