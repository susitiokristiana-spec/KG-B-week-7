import React, { useState } from 'react';
import { Trophy, Star, Award, CheckCircle2, Lock, Sparkles, Printer } from 'lucide-react';
import { Sticker } from '../types';

interface StickerAlbumProps {
  stickers: Sticker[];
  totalScore: number;
  totalCorrectGuesses: number;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({
  stickers,
  totalScore,
  totalCorrectGuesses,
}) => {
  const [studentName, setStudentName] = useState<string>('Siswa Cilik Hebat');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overview header */}
      <div className="bg-white/90 p-5 rounded-3xl border border-amber-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 flex items-center justify-center border-2 border-amber-300">
            <img
              src="/src/assets/images/badge_super_explorer_1794212616425.jpg"
              alt="Juara"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-amber-950">
              Lemari Stiker & Prestasi TK B 🏆
            </h3>
            <p className="text-xs md:text-sm text-amber-800">
              Koleksi stiker juara yang kamu dapatkan saat bermain dan menebak suara!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-700 block">Stiker Terbuka</span>
            <span className="text-lg font-extrabold text-amber-900">
              {unlockedCount} / {stickers.length}
            </span>
          </div>

          <button
            onClick={() => setShowCertificate(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Sertifikat</span>
          </button>
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stickers.map((sticker) => {
          return (
            <div
              key={sticker.id}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center text-center ${
                sticker.unlocked
                  ? 'bg-gradient-to-b from-yellow-50 to-amber-100/70 border-yellow-400 shadow-sm'
                  : 'bg-slate-50/80 border-slate-200 opacity-65'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center my-2 shadow-xs ${
                  sticker.unlocked ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {sticker.unlocked ? (
                  <Sparkles className="w-8 h-8 animate-pulse" />
                ) : (
                  <Lock className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-base font-extrabold text-slate-900 mt-1">{sticker.title}</h4>
              <p className="text-xs text-slate-600 mt-1 flex-1">{sticker.description}</p>

              <div className="mt-3 w-full">
                {sticker.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Terbuka!
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                    Tebak {sticker.requiredCorrect} kali untuk buka
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 border-4 border-amber-400 shadow-2xl relative space-y-5 animate-scale-up">
            {/* Certificate Header */}
            <div className="text-center space-y-1 border-b-2 border-amber-200 pb-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600">
                PENGHARGAAN PRESTASI TK B
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-amber-950">
                Sertifikat Bintang Peternak Cilik 🌟
              </h3>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs md:text-sm text-slate-600">Diberikan dengan penuh rasa bangga kepada:</p>

              {/* Editable Student Name */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-center font-extrabold text-xl md:text-2xl text-amber-900 border-b-2 border-amber-400 focus:outline-none focus:border-amber-600 w-full py-1 bg-amber-50/50 rounded-lg"
                  placeholder="Ketik Nama Siswa..."
                />
                <span className="text-[10px] text-slate-400 block mt-1">(Bisa diketik nama siswa)</span>
              </div>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                Telah berhasil mengenali suara-suara <strong>Hewan Peliharaan</strong> dan <strong>Hewan Ternak</strong>{' '}
                dengan telinga yang cermat dan hati yang menyayangi ciptaan Tuhan.
              </p>

              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300">
                    <img
                      src="/src/assets/images/badge_super_explorer_1794212616425.jpg"
                      alt="Champion Badge"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 block mt-1">Bintang 5 TK B</span>
                </div>
              </div>
            </div>

            {/* Certificate Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan</span>
              </button>

              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-bold shadow-xs transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
