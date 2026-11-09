import React, { useState } from 'react';
import { Volume2, Sparkles, Mic, Image as ImageIcon } from 'lucide-react';
import { Animal, VisualMode } from '../types';
import { ANIMALS } from '../data/animals';
import { AnimalAvatar } from './AnimalAvatar';
import { playAnimalSound, playClickBubble, speakIndonesian } from '../utils/audioSynthesizer';

interface SoundboardExplorationProps {
  onExploreAnimal: (animal: Animal) => void;
  voiceEnabled: boolean;
  visualMode: VisualMode;
  onToggleVisualMode: () => void;
}

export const SoundboardExploration: React.FC<SoundboardExplorationProps> = ({
  onExploreAnimal,
  voiceEnabled,
  visualMode,
  onToggleVisualMode,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(ANIMALS[0]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const handleSelectAnimal = (animal: Animal) => {
    playClickBubble();
    setSelectedAnimal(animal);
    setActivePlayingId(animal.id);
    playAnimalSound(animal.id);

    if (voiceEnabled) {
      speakIndonesian(animal.speechText);
    }

    onExploreAnimal(animal);

    setTimeout(() => {
      setActivePlayingId(null);
    }, 1800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Introduction banner */}
      <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <span>Panggung Suara & Ensiklopedia Foto Nyata 📸</span>
          </h3>
          <p className="text-xs md:text-sm text-amber-800">
            Sentuh foto hewan di bawah untuk mendengarkan suaranya dan melihat foto aslinya secara dekat!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVisualMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              visualMode === 'real'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-indigo-100 text-indigo-900 border-indigo-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Mode: {visualMode === 'real' ? '📸 Foto Nyata' : '🎨 Kartun'}</span>
          </button>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
            11 Sahabat Hewan
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Spotlight Detail Card with BIG Real Photo */}
        <div className="lg:col-span-5 bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-6 text-center shadow-md">
          <div className="flex items-center justify-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                selectedAnimal.category === 'peliharaan' ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {selectedAnimal.categoryLabel}
            </span>
          </div>

          {/* Real Photo spotlight */}
          <div className="my-4 flex justify-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-xl bg-white relative group">
              {visualMode === 'real' ? (
                <img
                  src={selectedAnimal.realPhotoUrl}
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AnimalAvatar
                  animalId={selectedAnimal.id}
                  size="xl"
                  state={activePlayingId === selectedAnimal.id ? 'celebrating' : 'idle'}
                />
              )}
            </div>
          </div>

          <h4 className="text-3xl font-extrabold text-slate-900">{selectedAnimal.name}</h4>
          <p className="text-lg font-extrabold text-amber-700 mt-0.5">"{selectedAnimal.soundName}"</p>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleSelectAnimal(selectedAnimal)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-extrabold shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bunyikan Suara</span>
            </button>
            <button
              onClick={() => {
                if (voiceEnabled) speakIndonesian(`Ayo tirukan suaraku bersama Bu Guru: ${selectedAnimal.soundName}!`);
              }}
              className="px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl text-xs md:text-sm font-extrabold shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-rose-500" />
              <span>Ayo Tiru Suaranya!</span>
            </button>
          </div>

          {/* Fun Kindergarten Facts */}
          <div className="mt-5 bg-white/95 rounded-2xl p-4 text-left border border-amber-200 space-y-2.5 text-xs md:text-sm shadow-xs">
            <div>
              <span className="font-extrabold text-amber-900 block">🌿 Makanan Favorit:</span>
              <span className="text-slate-700">{selectedAnimal.food}</span>
            </div>
            <div>
              <span className="font-extrabold text-amber-900 block">🏡 Tempat Tinggal:</span>
              <span className="text-slate-700">{selectedAnimal.habitat}</span>
            </div>
            <div>
              <span className="font-extrabold text-amber-900 block">💡 Tahukah Kamu?</span>
              <span className="text-slate-700">{selectedAnimal.funFact}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Grid of all Animals */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ANIMALS.map((animal) => {
            const isSelected = selectedAnimal.id === animal.id;
            const isPlaying = activePlayingId === animal.id;

            return (
              <button
                key={animal.id}
                onClick={() => handleSelectAnimal(animal)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-3 ring-amber-300'
                    : 'bg-white hover:bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 bg-amber-50 flex items-center justify-center border border-amber-200">
                  {visualMode === 'real' ? (
                    <img
                      src={animal.realPhotoUrl}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <AnimalAvatar animalId={animal.id} size="sm" state={isPlaying ? 'speaking' : 'idle'} />
                  )}
                </div>
                <span className="text-sm font-extrabold text-slate-800 leading-tight block">{animal.name}</span>
                <span className="text-[11px] font-bold text-slate-500 block">{animal.soundName}</span>
                <span
                  className={`mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    animal.category === 'peliharaan' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {animal.category === 'peliharaan' ? '🏡 Peliharaan' : '🚜 Ternak'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
