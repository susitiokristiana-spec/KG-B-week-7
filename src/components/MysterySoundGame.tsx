import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  Star,
  ChevronRight,
  Check,
  Trophy,
  Zap,
  Image as ImageIcon,
  Flame,
  AlertCircle,
} from 'lucide-react';
import { Animal, Difficulty, FilterCategory, VisualMode } from '../types';
import { ANIMALS } from '../data/animals';
import { AnimalAvatar } from './AnimalAvatar';
import {
  playAnimalSound,
  playSuccessFanfare,
  playEncouragingSound,
  playStarTwinkle,
  playClickBubble,
  speakIndonesian,
  stopSpeech,
} from '../utils/audioSynthesizer';

interface MysterySoundGameProps {
  onSuccessGuess: (animal: Animal, isHardMode: boolean, firstTry: boolean) => void;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  visualMode: VisualMode;
  onToggleVisualMode: () => void;
}

export const MysterySoundGame: React.FC<MysterySoundGameProps> = ({
  onSuccessGuess,
  soundEnabled,
  voiceEnabled,
  visualMode,
  onToggleVisualMode,
}) => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('semua');
  const [difficulty, setDifficulty] = useState<Difficulty>('sulit'); // Default to sulit as requested!
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);

  // Current mystery target
  const [targetAnimal, setTargetAnimal] = useState<Animal>(ANIMALS[0]);
  const [candidateOptions, setCandidateOptions] = useState<Animal[]>([]);
  const [hasGuessedCorrect, setHasGuessedCorrect] = useState<boolean>(false);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [lastGuessedAnimal, setLastGuessedAnimal] = useState<Animal | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);

  // Hard Mode Specific State: Limited Replays & First-Try streak
  const [replaysUsed, setReplaysUsed] = useState<number>(0);
  const MAX_REPLAYS_HARD = 2;
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const ROUND_TOTAL = 5;
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter pool based on active category
  const filteredPool = React.useMemo(() => {
    if (filterCategory === 'peliharaan') {
      return ANIMALS.filter((a) => a.category === 'peliharaan');
    }
    if (filterCategory === 'ternak') {
      return ANIMALS.filter((a) => a.category === 'ternak');
    }
    return ANIMALS;
  }, [filterCategory]);

  // Setup a new question
  const startNewQuestion = (isFirstInRound = false) => {
    stopSpeech();
    if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);

    const randomTarget = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    setTargetAnimal(randomTarget);
    setHasGuessedCorrect(false);
    setWrongGuesses([]);
    setLastGuessedAnimal(null);
    setReplaysUsed(0);
    setAttemptsCount(0);

    // Hard level tricky candidate selection
    let countNeeded = 3;
    if (difficulty === 'sedang') countNeeded = 4;
    if (difficulty === 'sulit') countNeeded = 6;

    let choices: Animal[] = [randomTarget];

    if (difficulty === 'sulit' && randomTarget.similarAnimals?.length) {
      // Pick tricky similar sounding animals first!
      const trickyPool = ANIMALS.filter((a) => randomTarget.similarAnimals.includes(a.id));
      choices.push(...trickyPool.slice(0, 2));
    }

    // Fill remaining candidates randomly from all animals
    const remainingNeeded = countNeeded - choices.length;
    const others = ANIMALS.filter((a) => !choices.some((c) => c.id === a.id)).sort(() => 0.5 - Math.random());
    choices = [...choices, ...others.slice(0, remainingNeeded)].sort(() => 0.5 - Math.random());

    setCandidateOptions(choices);

    if (difficulty === 'sulit') {
      setFeedbackMessage('Level Sulit (6 Foto): Dengarkan teliti! Kuota dengar maksimal 2x!');
    } else {
      setFeedbackMessage('Dengarkan suaranya, lalu tebak foto hewan yang cocok!');
    }

    if (isFirstInRound) {
      setRoundNumber(1);
      setScore(0);
      setStars(0);
      setStreak(0);
      setRoundFinished(false);
    }

    setTimeout(() => {
      triggerPlayMysterySound(randomTarget, true);
    }, 450);
  };

  useEffect(() => {
    startNewQuestion(true);
    return () => {
      stopSpeech();
      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    };
  }, [filterCategory, difficulty]);

  // Mystery Audio playback
  const triggerPlayMysterySound = (animal = targetAnimal, isAutoFirst = false) => {
    if (difficulty === 'sulit' && !isAutoFirst && replaysUsed >= MAX_REPLAYS_HARD) {
      setFeedbackMessage('Kuota putar suara sudah habis (2/2)! Ayo pilih foto yang paling kamu yakini!');
      if (voiceEnabled) speakIndonesian('Kuota dengar habis! Ayo pilih tebakanmu!');
      return;
    }

    if (!isAutoFirst && difficulty === 'sulit') {
      setReplaysUsed((prev) => prev + 1);
    }

    setIsPlayingAudio(true);
    playAnimalSound(animal.id);

    if (voiceEnabled) {
      const prompts =
        difficulty === 'sulit'
          ? [
              'Perhatikan dengan teliti... Suara siapakah ini?',
              'Tantangan detektif! Bedakan suaranya dari 6 foto hewan!',
            ]
          : [
              'Dengarkan baik-baik... Suara hewan apakah ini?',
              'Yuk pasang telingamu! Hewan apa yang bersuara seperti ini?',
            ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setTimeout(() => {
        speakIndonesian(randomPrompt);
      }, 1200);
    }

    if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    audioTimeoutRef.current = setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1800);
  };

  // Handle Child Guess
  const handleGuess = (animal: Animal) => {
    if (hasGuessedCorrect) return;

    playClickBubble();
    setLastGuessedAnimal(animal);
    const newAttempt = attemptsCount + 1;
    setAttemptsCount(newAttempt);

    if (animal.id === targetAnimal.id) {
      // CORRECT GUESS!
      setHasGuessedCorrect(true);
      const isFirstTry = newAttempt === 1;
      const bonusPoints = isFirstTry && difficulty === 'sulit' ? 25 : difficulty === 'sulit' ? 15 : 10;
      setScore((prev) => prev + bonusPoints);

      const starPoints = difficulty === 'sulit' && isFirstTry ? 2 : 1;
      setStars((prev) => prev + starPoints);
      setStreak((prev) => prev + 1);

      // Confetti burst
      try {
        confetti({
          particleCount: difficulty === 'sulit' ? 120 : 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      playSuccessFanfare();
      setTimeout(() => {
        playAnimalSound(targetAnimal.id);
      }, 700);

      onSuccessGuess(targetAnimal, difficulty === 'sulit', isFirstTry);

      let praise = `Hebat sekali! Kamu benar, ini adalah ${targetAnimal.name}!`;
      if (difficulty === 'sulit' && isFirstTry) {
        praise = `LUAR BIASA! 🌟 Telinga Emas! Kamu menebak tepat pada percobaan pertama di Level Sulit!`;
      }
      setFeedbackMessage(praise);

      if (voiceEnabled) {
        speakIndonesian(`${praise} ${targetAnimal.name} adalah ${targetAnimal.categoryLabel}.`);
      }
    } else {
      // INCORRECT GUESS
      setWrongGuesses((prev) => [...prev, animal.id]);
      setStreak(0);
      playEncouragingSound();

      setTimeout(() => {
        playAnimalSound(animal.id);
      }, 400);

      const encouragingMsg = `Ups, hampir tepat! Itu foto ${animal.name} (${animal.soundName}). Hewan misteri suaranya berbeda lho. Coba dengarkan lagi ya!`;
      setFeedbackMessage(encouragingMsg);

      if (voiceEnabled) {
        speakIndonesian(`Bukan ${animal.name}. Ayo coba dengarkan lagi!`);
      }
    }
  };

  const handleNextQuestion = () => {
    playStarTwinkle();
    if (roundNumber >= ROUND_TOTAL) {
      setRoundFinished(true);
      playSuccessFanfare();
      if (voiceEnabled) {
        speakIndonesian('Horeee! Kamu berhasil menyelesaikan putaran permainan!');
      }
    } else {
      setRoundNumber((prev) => prev + 1);
      startNewQuestion();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-amber-50 rounded-xl border border-amber-200">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterCategory === 'semua' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterCategory('peliharaan')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterCategory === 'peliharaan' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🏡 Peliharaan
          </button>
          <button
            onClick={() => setFilterCategory('ternak')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterCategory === 'ternak' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🚜 Ternak
          </button>
        </div>

        {/* Difficulty Level Selector: 🟢 Mudah (3), 🟡 Sedang (4), 🔴 Sulit (6) */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold">
          <span className="text-amber-900 pl-1">Level:</span>
          <button
            onClick={() => setDifficulty('mudah')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              difficulty === 'mudah' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-amber-100'
            }`}
          >
            🟢 Mudah (3)
          </button>
          <button
            onClick={() => setDifficulty('sedang')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              difficulty === 'sedang' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-amber-100'
            }`}
          >
            🟡 Sedang (4)
          </button>
          <button
            onClick={() => setDifficulty('sulit')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              difficulty === 'sulit'
                ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🔴 Sulit (6 Foto)</span>
          </button>
        </div>

        {/* Visual Mode Toggle: Real Photo vs Cartoon */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVisualMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              visualMode === 'real'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-indigo-100 text-indigo-900 border-indigo-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Mode: {visualMode === 'real' ? '📸 Foto Nyata' : '🎨 Kartun'}</span>
          </button>

          {/* Stars indicator */}
          <div className="flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-3 py-1.5 rounded-xl font-extrabold text-yellow-900 text-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{stars} ⭐</span>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      {!roundFinished ? (
        <div className="space-y-6">
          {/* Progress & Difficulty Indicator */}
          <div className="flex flex-wrap items-center justify-between text-xs md:text-sm font-bold text-amber-950 px-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>
                Soal {roundNumber} dari {ROUND_TOTAL}
              </span>
              {difficulty === 'sulit' && (
                <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md text-[11px] font-extrabold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-600" />
                  Mode Detektif Sulit (6 Foto)
                </span>
              )}
            </div>

            {/* Streak & Round bubbles */}
            <div className="flex items-center gap-2">
              {streak > 1 && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                  {streak}x Benar Beruntun!
                </span>
              )}
              <div className="flex items-center gap-1">
                {[...Array(ROUND_TOTAL)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      idx + 1 < roundNumber || (idx + 1 === roundNumber && hasGuessedCorrect)
                        ? 'bg-emerald-600 text-white'
                        : idx + 1 === roundNumber
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {idx + 1 < roundNumber || (idx + 1 === roundNumber && hasGuessedCorrect) ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mystery Stage Card */}
          <div className="relative overflow-hidden bg-gradient-to-b from-amber-100/90 via-orange-50/80 to-amber-100/80 border-3 border-amber-300 rounded-3xl p-6 md:p-8 text-center shadow-lg">
            <div className="max-w-md mx-auto flex flex-col items-center">
              {!hasGuessedCorrect ? (
                /* Hidden Mystery State */
                <div className="flex flex-col items-center">
                  <div className="relative my-2">
                    {isPlayingAudio && (
                      <div className="absolute -inset-4 rounded-full border-4 border-amber-400 animate-pulse-ring pointer-events-none" />
                    )}
                    <AnimalAvatar animalId="misteri" size="xl" className="transform hover:scale-105 transition-transform" />
                  </div>

                  <h3 className="mt-3 text-xl md:text-2xl font-extrabold text-amber-950 tracking-tight">
                    Suara Hewan Apakah Ini?
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-amber-800 font-medium">
                    {difficulty === 'sulit'
                      ? 'Dengarkan baik-baik dan pilih dari 6 foto hewan nyata di bawah ini!'
                      : 'Dengarkan suaranya, lalu sentuh foto hewan yang cocok!'}
                  </p>

                  {/* Replay Sound Button with Hard-Mode Limit */}
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <button
                      onClick={() => triggerPlayMysterySound()}
                      disabled={difficulty === 'sulit' && replaysUsed >= MAX_REPLAYS_HARD}
                      className={`px-6 py-3.5 rounded-2xl font-extrabold text-base md:text-lg flex items-center gap-3 transition-all transform active:scale-95 shadow-md cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-amber-600 text-white ring-4 ring-amber-300 scale-105'
                          : difficulty === 'sulit' && replaysUsed >= MAX_REPLAYS_HARD
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      <span>{isPlayingAudio ? 'Mendengarkan Suara... 🎶' : '🔊 Putar Suara Lagi'}</span>
                    </button>

                    {/* Hard mode replay counter */}
                    {difficulty === 'sulit' && (
                      <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                        Sisa Dengar: {Math.max(0, MAX_REPLAYS_HARD - replaysUsed)} / {MAX_REPLAYS_HARD} kali
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* REVEALED CELEBRATION STAGE WITH REAL PHOTO! */
                <div className="flex flex-col items-center animate-fade-in w-full">
                  <div className="relative my-2 w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-xl bg-white">
                    <img
                      src={targetAnimal.realPhotoUrl}
                      alt={targetAnimal.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-400 text-amber-950 p-2 rounded-full shadow-md animate-bounce">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        targetAnimal.category === 'peliharaan' ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {targetAnimal.categoryLabel}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-amber-950 mt-1">
                      {targetAnimal.name} ({targetAnimal.soundName})
                    </h3>
                  </div>

                  {/* Real educational facts */}
                  <div className="mt-4 bg-white/95 border border-amber-200 rounded-2xl p-4 text-left w-full space-y-2 shadow-xs text-xs md:text-sm">
                    <p className="flex items-center gap-2 text-slate-800">
                      <span className="font-bold text-amber-800">🍽️ Makanan:</span> {targetAnimal.food}
                    </p>
                    <p className="flex items-center gap-2 text-slate-800">
                      <span className="font-bold text-amber-800">🏡 Tempat Tinggal:</span> {targetAnimal.habitat}
                    </p>
                    <p className="flex items-center gap-2 text-slate-800">
                      <span className="font-bold text-amber-800">✨ Manfaat Nyata:</span> {targetAnimal.benefit}
                    </p>
                  </div>

                  {/* Next Question Button */}
                  <button
                    onClick={handleNextQuestion}
                    className="mt-5 w-full max-w-xs px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-95 cursor-pointer"
                  >
                    <span>Lanjut ke Soal Berikutnya</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Feedback message banner */}
            {feedbackMessage && (
              <div
                className={`mt-4 p-3 rounded-2xl text-xs md:text-sm font-bold transition-all max-w-xl mx-auto ${
                  hasGuessedCorrect
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-950 animate-bounce-short'
                    : 'bg-amber-100/90 border border-amber-300 text-amber-950'
                }`}
              >
                {feedbackMessage}
              </div>
            )}
          </div>

          {/* Candidate Options: 3, 4, or 6 Real Photo Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm md:text-base font-extrabold text-amber-950 flex items-center gap-2">
                <span>Pilih Foto Hewan yang Cocok:</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  {candidateOptions.length} Pilihan
                </span>
              </h4>
              <span className="text-xs text-amber-800 font-semibold">Sentuh foto untuk menebak</span>
            </div>

            {/* Grid layout adjusts dynamically: 3 cols for mudah, 2x2 for sedang, 2x3 or 3x2 for sulit */}
            <div
              className={`grid gap-3.5 ${
                difficulty === 'mudah'
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : difficulty === 'sedang'
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
              }`}
            >
              {candidateOptions.map((animal) => {
                const isWrong = wrongGuesses.includes(animal.id);
                const isSelectedAndCorrect = hasGuessedCorrect && animal.id === targetAnimal.id;

                return (
                  <button
                    key={animal.id}
                    onClick={() => handleGuess(animal)}
                    disabled={hasGuessedCorrect}
                    className={`relative group p-3 rounded-2xl border-3 transition-all flex flex-col items-center justify-between text-center select-none transform cursor-pointer active:scale-95 ${
                      isSelectedAndCorrect
                        ? 'bg-emerald-100 border-emerald-500 shadow-lg ring-4 ring-emerald-200 scale-102'
                        : isWrong
                        ? 'bg-slate-50 border-slate-300 opacity-55'
                        : 'bg-white hover:bg-amber-50/70 border-amber-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    {/* Real Animal Photo or Cartoon based on visualMode */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-amber-50 flex items-center justify-center border border-amber-200/80">
                      {visualMode === 'real' ? (
                        <img
                          src={animal.realPhotoUrl}
                          alt={animal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <AnimalAvatar
                          animalId={animal.id}
                          size="md"
                          state={isSelectedAndCorrect ? 'celebrating' : isWrong ? 'wrong' : 'idle'}
                        />
                      )}
                    </div>

                    {/* Animal Name */}
                    <div className="w-full">
                      <span className="block text-base font-extrabold text-slate-800 group-hover:text-amber-800 leading-tight">
                        {animal.name}
                      </span>
                      <span className="inline-block mt-0.5 text-[11px] font-bold text-slate-500">
                        {animal.categoryLabel}
                      </span>
                    </div>

                    {/* Badge if correct or wrong */}
                    {isSelectedAndCorrect && (
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 shadow-md">
                        <Check className="w-4 h-4" />
                      </span>
                    )}

                    {isWrong && (
                      <span className="absolute top-2 right-2 text-[10px] bg-rose-100 text-rose-700 border border-rose-300 font-extrabold px-1.5 py-0.5 rounded-md">
                        Coba lagi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Round Complete Summary Screen */
        <div className="bg-white border-3 border-amber-300 rounded-3xl p-8 text-center shadow-xl space-y-6 max-w-lg mx-auto">
          <div className="w-28 h-28 mx-auto relative">
            <img
              src="/src/assets/images/badge_super_explorer_1794212616425.jpg"
              alt="Medali Juara"
              className="w-full h-full object-contain rounded-2xl drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-950">
              {difficulty === 'sulit' ? 'Detektif Suara Master! 🏆' : 'Hebat, Kamu Juara! 🌟'}
            </h3>
            <p className="text-xs md:text-sm text-amber-800">
              {difficulty === 'sulit'
                ? 'Luar biasa! Kamu berhasil menaklukkan Level Sulit dengan 6 foto hewan nyata!'
                : 'Kamu berhasil menyelesaikan putaran tebak suara hewan dengan sangat baik!'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-xs text-amber-700 font-bold block">Skor Kamu</span>
              <span className="text-2xl font-extrabold text-amber-900">{score} Poin</span>
            </div>
            <div>
              <span className="text-xs text-amber-700 font-bold block">Bintang Didapat</span>
              <span className="text-2xl font-extrabold text-amber-900">⭐ {stars}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => startNewQuestion(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Main Putaran Baru</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
