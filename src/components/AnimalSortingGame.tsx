import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Home, Tractor, CheckCircle2, RotateCcw, Volume2, Sparkles, Star } from 'lucide-react';
import { Animal } from '../types';
import { ANIMALS } from '../data/animals';
import { AnimalAvatar } from './AnimalAvatar';
import {
  playAnimalSound,
  playSuccessFanfare,
  playEncouragingSound,
  playClickBubble,
  speakIndonesian,
} from '../utils/audioSynthesizer';

interface AnimalSortingGameProps {
  onSuccessSort: () => void;
  voiceEnabled: boolean;
}

export const AnimalSortingGame: React.FC<AnimalSortingGameProps> = ({
  onSuccessSort,
  voiceEnabled,
}) => {
  const [animalQueue, setAnimalQueue] = useState<Animal[]>(() =>
    [...ANIMALS].sort(() => 0.5 - Math.random())
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sortedPets, setSortedPets] = useState<Animal[]>([]);
  const [sortedFarms, setSortedFarms] = useState<Animal[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentAnimal = animalQueue[currentIndex];

  const handleSort = (chosenCategory: 'peliharaan' | 'ternak') => {
    if (!currentAnimal || isCompleted) return;

    playClickBubble();

    if (currentAnimal.category === chosenCategory) {
      // Correct sorting!
      setIsSuccess(true);
      playSuccessFanfare();
      setTimeout(() => {
        playAnimalSound(currentAnimal.id);
      }, 500);

      if (chosenCategory === 'peliharaan') {
        setSortedPets((prev) => [...prev, currentAnimal]);
        const msg = `Tepat sekali! ${currentAnimal.name} adalah Hewan Peliharaan yang tinggal di rumah bersama kita! 🏡`;
        setFeedback(msg);
        if (voiceEnabled) speakIndonesian(`Benar! ${currentAnimal.name} adalah hewan peliharaan!`);
      } else {
        setSortedFarms((prev) => [...prev, currentAnimal]);
        const msg = `Hebat! ${currentAnimal.name} adalah Hewan Ternak yang tinggal di peternakan! 🚜`;
        setFeedback(msg);
        if (voiceEnabled) speakIndonesian(`Benar! ${currentAnimal.name} adalah hewan ternak!`);
      }

      onSuccessSort();

      // Check if finished
      if (currentIndex + 1 >= animalQueue.length) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsSuccess(null);
          setFeedback('');
        }, 1500);
      }
    } else {
      // Incorrect category
      setIsSuccess(false);
      playEncouragingSound();

      if (chosenCategory === 'peliharaan') {
        setFeedback(
          `Ups, ${currentAnimal.name} biasanya dipelihara di Peternakan (Hewan Ternak) untuk diambil manfaatnya lho. Coba lagi ya!`
        );
        if (voiceEnabled) {
          speakIndonesian(`${currentAnimal.name} tinggal di peternakan, bukan di dalam rumah.`);
        }
      } else {
        setFeedback(
          `Ups, ${currentAnimal.name} adalah Hewan Peliharaan yang cocok tinggal bersama kita di rumah. Coba sentuh Rumah ya!`
        );
        if (voiceEnabled) {
          speakIndonesian(`${currentAnimal.name} adalah hewan peliharaan keluarga.`);
        }
      }
    }
  };

  const handleReset = () => {
    setAnimalQueue([...ANIMALS].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
    setSortedPets([]);
    setSortedFarms([]);
    setFeedback('');
    setIsSuccess(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title & Progress */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
            <span>Ayo Kelompokkan Hewan! 🏡🚜</span>
          </h3>
          <p className="text-xs md:text-sm text-amber-800">
            Pilah apakah hewan ini adalah <strong>Hewan Peliharaan</strong> atau <strong>Hewan Ternak</strong>!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
            {currentIndex} / {animalQueue.length} Selesai
          </span>
          <button
            onClick={handleReset}
            className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition-all"
            title="Mulai Ulang"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isCompleted && currentAnimal ? (
        <div className="space-y-6">
          {/* Current Animal to Sort */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-6 text-center shadow-md max-w-md mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-700 bg-amber-200/80 px-3 py-1 rounded-full">
              Hewan yang Harus Dipilah
            </span>

            <div className="my-3 flex justify-center">
              <AnimalAvatar
                animalId={currentAnimal.id}
                realPhotoUrl={currentAnimal.realPhotoUrl}
                visualMode="real"
                size="xl"
                state={isSuccess ? 'celebrating' : isSuccess === false ? 'wrong' : 'idle'}
              />
            </div>

            <h4 className="text-2xl font-extrabold text-slate-900">{currentAnimal.name}</h4>
            <p className="text-sm text-slate-600 font-medium mt-1">"{currentAnimal.soundName}"</p>

            <button
              onClick={() => {
                playAnimalSound(currentAnimal.id);
                if (voiceEnabled) speakIndonesian(`Ini suara ${currentAnimal.name}!`);
              }}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Suaranya</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-center text-sm font-semibold max-w-lg mx-auto ${
                isSuccess
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                  : 'bg-rose-100 border border-rose-300 text-rose-900'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Two Big Sorting Bins: Rumah vs Peternakan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bin 1: Rumah (Hewan Peliharaan) */}
            <button
              onClick={() => handleSort('peliharaan')}
              className="group p-6 rounded-3xl border-3 border-orange-300 bg-gradient-to-b from-orange-50 to-amber-100/60 hover:border-orange-500 hover:shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer active:scale-98"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Home className="w-8 h-8" />
              </div>

              <div className="my-3">
                <h4 className="text-xl font-extrabold text-orange-950">🏡 Rumah Ceria</h4>
                <span className="block text-sm font-bold text-orange-700">Hewan Peliharaan</span>
                <p className="text-xs text-slate-600 mt-1 max-w-xs">
                  Tinggal bersama manusia di rumah, disayang dan diajak bermain setiap hari.
                </p>
              </div>

              {/* Sorted animals badges */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-2 min-h-8">
                {sortedPets.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 bg-white border border-orange-200 px-2 py-0.5 rounded-lg text-xs font-bold text-orange-900 shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-orange-500" />
                    {p.name}
                  </span>
                ))}
              </div>

              <span className="mt-3 px-5 py-2.5 bg-orange-500 group-hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-xs">
                Masukkan ke Rumah
              </span>
            </button>

            {/* Bin 2: Peternakan (Hewan Ternak) */}
            <button
              onClick={() => handleSort('ternak')}
              className="group p-6 rounded-3xl border-3 border-emerald-300 bg-gradient-to-b from-emerald-50 to-teal-100/60 hover:border-emerald-500 hover:shadow-lg transition-all text-center flex flex-col items-center justify-between cursor-pointer active:scale-98"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Tractor className="w-8 h-8" />
              </div>

              <div className="my-3">
                <h4 className="text-xl font-extrabold text-emerald-950">🚜 Peternakan Subur</h4>
                <span className="block text-sm font-bold text-emerald-700">Hewan Ternak</span>
                <p className="text-xs text-slate-600 mt-1 max-w-xs">
                  Dirawat peternak di kandang luas untuk menghasilkan telur, susu, wol, atau membantu bekerja.
                </p>
              </div>

              {/* Sorted animals badges */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-2 min-h-8">
                {sortedFarms.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1 bg-white border border-emerald-200 px-2 py-0.5 rounded-lg text-xs font-bold text-emerald-900 shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {f.name}
                  </span>
                ))}
              </div>

              <span className="mt-3 px-5 py-2.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs">
                Masukkan ke Peternakan
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-white border-3 border-emerald-400 rounded-3xl p-8 text-center max-w-md mx-auto shadow-xl space-y-5">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900">
            Hebat! Semua Hewan Sudah Terpilah! 🎉
          </h3>
          <p className="text-sm text-slate-600">
            Kamu berhasil mengenal hewan peliharaan dan hewan ternak dengan sangat baik!
          </p>

          <button
            onClick={handleReset}
            className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Pilah Lagi dari Awal</span>
          </button>
        </div>
      )}
    </div>
  );
};
