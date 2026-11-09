import React from 'react';
import { BookOpen, X, Sparkles, Check, Heart, Volume2 } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border-3 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-950">
              Panduan Guru & Orang Tua (TK B) 📖
            </h3>
            <p className="text-xs text-amber-800">
              Tema Kurikulum: Binatang Ciptaan Tuhan (Subtema: Peliharaan & Hewan Ternak)
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Capaian Perkembangan Anak (Usia 5-6 Tahun):</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>
                <strong>Kognitif</strong>: Mengklasifikasikan benda/makhluk hidup ke dalam kelompok (hewan peliharaan rumah vs hewan ternak peternakan) serta memahami manfaat hewan (susu, telur, wol).
              </li>
              <li>
                <strong>Auditori & Persepsi Sensori</strong>: Melatih ketajaman mendengar dan membedakan variasi frekuensi suara hewan tanpa visual petunjuk awal.
              </li>
              <li>
                <strong>Bahasa & Komunikasi</strong>: Mengungkapkan onomatopoeia (tiruan bunyi: "meoong", "guk-guk", "kukuruyuk") dan bercerita kembali.
              </li>
              <li>
                <strong>Sosial Emosional</strong>: Mengembangkan rasa bangga melalui penguatan positif (positive reinforcement) stiker bintang dan empati menyayangi hewan ciptaan Tuhan.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">💡 Ide Kegiatan Interaktif di Kelas TK B:</h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>
                <strong>Tebak Suara Bersama</strong>: Tampilkan game ini di layar proyektor/Smart TV kelas. Putar suara misteri, lalu ajak seluruh murid mengangkat tangan atau menirukan gerakannya sebelum menyentuh layar.
              </li>
              <li>
                <strong>Ice Breaking Gerak & Lagu</strong>: Nyanyikan lagu "Pak Tani Punya Kandang (Iya Iya Oh)" sambil mengajak anak melompat seperti kelinci atau mengepakkan sayap seperti bebek.
              </li>
              <li>
                <strong>Diskusi Manfaat Hewan</strong>: Setelah berhasil menebak Sapi atau Ayam, tanyakan kepada murid: "Siapa tadi pagi yang sudah minum susu atau sarapan telur dadar?"
              </li>
            </ol>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-emerald-900 text-xs">
            <strong>Catatan Desain Khusus TK B:</strong> Game ini dirancang secara sengaja untuk menyembunyikan gambar dan nama hewan saat suara pertama kali diputar. Murid diajak mengandalkan pendengarannya sebelum memilih kartun. Bila salah tebak, sistem memberikan respon yang lembut dan ramah agar anak tetap ceria dan percaya diri!
          </div>
        </div>

        {/* Footer */}
        <div className="text-right pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-bold shadow-xs transition-all"
          >
            Siap Mengajar & Bermain!
          </button>
        </div>
      </div>
    </div>
  );
};
