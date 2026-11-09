/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Star, Home, HelpCircle } from 'lucide-react';
import { GameMode, Animal, Sticker, VisualMode } from './types';
import { INITIAL_STICKERS } from './data/animals';
import { MysterySoundGame } from './components/MysterySoundGame';
import { AnimalSortingGame } from './components/AnimalSortingGame';
import { SoundboardExploration } from './components/SoundboardExploration';
import { StickerAlbum } from './components/StickerAlbum';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { playClickBubble } from './utils/audioSynthesizer';

export default function App() {
  const [activeMode, setActiveMode] = useState<GameMode>('tebak-suara');
  const [visualMode, setVisualMode] = useState<VisualMode>('real'); // Default to real photo!
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // Gamification & Rewards State
  const [stickers, setStickers] = useState<Sticker[]>(INITIAL_STICKERS);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalCorrectGuesses, setTotalCorrectGuesses] = useState<number>(0);
  const [hardModeSolved, setHardModeSolved] = useState<number>(0);
  const [petGuesses, setPetGuesses] = useState<number>(0);
  const [farmGuesses, setFarmGuesses] = useState<number>(0);
  const [totalSorted, setTotalSorted] = useState<number>(0);
  const [exploredAnimalIds, setExploredAnimalIds] = useState<Set<string>>(new Set());

  const toggleVisualMode = () => {
    setVisualMode((prev: VisualMode) => (prev === 'real' ? 'cartoon' : 'real'));
  };

  // Handle successful guess in Mystery Sound Game
  const handleSuccessGuess = (animal: Animal, isHardMode: boolean, firstTry: boolean) => {
    const points = isHardMode ? (firstTry ? 25 : 15) : 10;
    setTotalScore((prev) => prev + points);
    const newCorrect = totalCorrectGuesses + 1;
    setTotalCorrectGuesses(newCorrect);

    let newHardCount = hardModeSolved;
    if (isHardMode) {
      newHardCount += 1;
      setHardModeSolved(newHardCount);
    }

    let newPet = petGuesses;
    let newFarm = farmGuesses;
    if (animal.category === 'peliharaan') {
      newPet += 1;
      setPetGuesses(newPet);
    } else {
      newFarm += 1;
      setFarmGuesses(newFarm);
    }

    // Check sticker unlock
    setStickers((prev) =>
      prev.map((s) => {
        if (s.id === 'bintang-pertama' && newCorrect >= 1) return { ...s, unlocked: true };
        if (s.id === 'sahabat-peliharaan' && newPet >= 3) return { ...s, unlocked: true };
        if (s.id === 'peternak-cilik' && newFarm >= 5) return { ...s, unlocked: true };
        if (s.id === 'ahli-level-sulit' && newHardCount >= 2) return { ...s, unlocked: true };
        if (s.id === 'telinga-emas' && isHardMode && firstTry) return { ...s, unlocked: true };
        if (s.id === 'detektif-hewan' && newCorrect >= 8) return { ...s, unlocked: true };
        return s;
      })
    );
  };

  // Handle sorting progress
  const handleSuccessSort = () => {
    const nextSorted = totalSorted + 1;
    setTotalSorted(nextSorted);
    setTotalScore((prev) => prev + 5);

    if (nextSorted >= 4) {
      setStickers((prev) =>
        prev.map((s) => (s.id === 'juara-kelompok' ? { ...s, unlocked: true } : s))
      );
    }
  };

  // Handle soundboard exploration
  const handleExploreAnimal = (animal: Animal) => {
    const nextExplored = new Set(exploredAnimalIds).add(animal.id);
    setExploredAnimalIds(nextExplored);

    if (nextExplored.size >= 8) {
      setStickers((prev) =>
        prev.map((s) => (s.id === 'penjelajah-bintang-5' ? { ...s, unlocked: true } : s))
      );
    }
  };

  const switchMode = (mode: GameMode) => {
    playClickBubble();
    setActiveMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-emerald-50/50 flex flex-col justify-between text-slate-800">
      {/* Top Bar following Top Bar Contract: [Brand title] — [4 nav links] — [1 primary action] */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 px-4 md:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              switchMode('tebak-suara');
            }}
            className="flex items-center gap-2 text-lg md:text-xl font-extrabold tracking-tight text-amber-900 whitespace-nowrap shrink-0 hover:text-amber-700 transition-colors"
          >
            <span className="text-2xl">🐮</span>
            <span>Peternakan Cilik TK B</span>
          </a>

          {/* Zone 2: 4 Clean Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <button
              onClick={() => switchMode('tebak-suara')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeMode === 'tebak-suara'
                  ? 'text-amber-800 border-b-2 border-amber-500'
                  : 'hover:text-amber-700'
              }`}
            >
              🎮 Tebak Suara Misteri
            </button>
            <button
              onClick={() => switchMode('kelompokkan')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeMode === 'kelompokkan'
                  ? 'text-amber-800 border-b-2 border-amber-500'
                  : 'hover:text-amber-700'
              }`}
            >
              🚜 Kelompokkan Hewan
            </button>
            <button
              onClick={() => switchMode('panggung-suara')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeMode === 'panggung-suara'
                  ? 'text-amber-800 border-b-2 border-amber-500'
                  : 'hover:text-amber-700'
              }`}
            >
              🎵 Panggung Hewan
            </button>
            <button
              onClick={() => switchMode('stiker-juara')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeMode === 'stiker-juara'
                  ? 'text-amber-800 border-b-2 border-amber-500'
                  : 'hover:text-amber-700'
              }`}
            >
              🏆 Lemari Stiker
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Panduan Guru & Audio Quick Controls) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Voice Narration Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                voiceEnabled
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={voiceEnabled ? 'Suara Narator: Aktif' : 'Suara Narator: Nonaktif'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Teacher Guidance Modal Trigger */}
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="px-3.5 py-2 text-xs md:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Guru</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-amber-100 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => switchMode('tebak-suara')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeMode === 'tebak-suara' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            🎮 Tebak Suara
          </button>
          <button
            onClick={() => switchMode('kelompokkan')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeMode === 'kelompokkan' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            🚜 Kelompokkan
          </button>
          <button
            onClick={() => switchMode('panggung-suara')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeMode === 'panggung-suara' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            🎵 Panggung
          </button>
          <button
            onClick={() => switchMode('stiker-juara')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeMode === 'stiker-juara' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            🏆 Stiker
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Whimsical Hero Banner for Kindergarten Stage */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-200/90 shadow-sm bg-gradient-to-r from-amber-200/40 via-orange-100/40 to-emerald-100/40 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-800">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                PAUD / TK B (Usia 5-6 Tahun)
              </span>
              <span>·</span>
              <span>Mengenal Ciptaan Tuhan</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-amber-950 tracking-tight leading-tight">
              Tebak Suara Hewan Cilik &middot; Foto Nyata 🐾
            </h1>
            <p className="text-xs md:text-sm text-slate-700 max-w-xl font-medium">
              Pasang telingamu baik-baik! Dengarkan suara hewan misteri, lalu tebak foto hewan peliharaan atau ternak
              yang cocok! Tersedia Level Sulit dengan 6 pilihan foto hewan nyata!
            </p>
          </div>

          {/* Quick Score & Star Pill */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-300 shadow-xs z-10 shrink-0">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold px-2 text-sm">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>{totalScore} Poin</span>
            </div>
            <div className="h-5 w-px bg-amber-200" />
            <button
              onClick={() => switchMode('stiker-juara')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {stickers.filter((s) => s.unlocked).length} / {stickers.length} Stiker Juara
            </button>
          </div>

          {/* Decorative Background Farm Stamp */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none hidden lg:block overflow-hidden rounded-r-3xl">
            <img
              src="/src/assets/images/hero_animal_farm_1794212616516.jpg"
              alt="Farm Banner"
              className="w-full h-full object-cover object-right"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Dynamic Mode Content */}
        {activeMode === 'tebak-suara' && (
          <MysterySoundGame
            onSuccessGuess={handleSuccessGuess}
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            visualMode={visualMode}
            onToggleVisualMode={toggleVisualMode}
          />
        )}

        {activeMode === 'kelompokkan' && (
          <AnimalSortingGame onSuccessSort={handleSuccessSort} voiceEnabled={voiceEnabled} />
        )}

        {activeMode === 'panggung-suara' && (
          <SoundboardExploration
            onExploreAnimal={handleExploreAnimal}
            voiceEnabled={voiceEnabled}
            visualMode={visualMode}
            onToggleVisualMode={toggleVisualMode}
          />
        )}

        {activeMode === 'stiker-juara' && (
          <StickerAlbum
            stickers={stickers}
            totalScore={totalScore}
            totalCorrectGuesses={totalCorrectGuesses}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white/80 py-4 px-6 text-center text-xs text-amber-900/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Sahabat Hewan Cilik &copy; 2026 &middot; Didesain Khusus untuk Pembelajaran Interaktif Siswa TK B
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="hover:text-amber-700 underline underline-offset-2 cursor-pointer"
            >
              Panduan Bu Guru Susi &middot; Global Mandiri
            </button>
          </div>
        </div>
      </footer>

      {/* Teacher Guide Modal */}
      <TeacherGuideModal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} />
    </div>
  );
}
