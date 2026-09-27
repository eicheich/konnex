// src/pages/AboutPage.tsx
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Scale, 
  Coins, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  Database, 
  HeartHandshake,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AboutPageProps {
  onGoToDashboard: () => void;
  onGoToRegister: () => void;
  onOpenCodeInspector: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onGoToDashboard,
  onGoToRegister,
  onOpenCodeInspector,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu Konnex dan bagaimana sistem barter keahlian bekerja?',
      a: 'Konnex adalah platform pertukaran keahlian (micro-skill swap) peer-to-peer berbasis waktu (time-banking). Di sini, uang tunai digantikan dengan "Token Waktu". Setiap kali Anda mengajar seseorang selama 1 jam, Anda mendapatkan 1 token. Token tersebut kemudian dapat Anda gunakan untuk belajar keahlian apa pun dari anggota komunitas lainnya selama 1 jam.'
    },
    {
      q: 'Berapa banyak token yang saya dapatkan saat pertama kali mendaftar?',
      a: 'Setiap pengguna baru langsung mendapatkan hibah awal 2 Token Waktu secara cuma-cuma. Dengan modal 2 token ini, Anda langsung bisa memesan 2 jam sesi bimbingan 1-on-1 dengan mentor mana pun di komunitas tanpa harus membayar apa pun.'
    },
    {
      q: 'Bagaimana jika saya bukan seorang ahli atau profesional di bidang saya?',
      a: 'Di Konnex, semua jenis keahlian memiliki nilai berharga! Anda tidak harus menjadi insinyur senior atau profesor. Bimbingan dasar seperti percakapan bahasa sehari-hari, cara merajut dasar, tips membuat roti sourdough, fotografi smartphone, atau penggunaan Canva memiliki nilai 1 token yang sama dengan materi pemrograman tingkat lanjut.'
    },
    {
      q: 'Bagaimana keamanan transaksi token dijamin?',
      a: 'Konnex dirancang dengan prinsip arsitektur ACID transaction menggunakan database Neon Serverless PostgreSQL dan Prisma ORM. Token disimpan dalam escrow dan hanya akan didebit dari pembelajar serta dikreditkan ke mentor setelah kedua belah pihak menyelesaikan sesi dan menandai selesai.'
    },
    {
      q: 'Bagaimana hubungan Konnex dengan Sustainable Development Goals (SDG)?',
      a: 'Konnex secara aktif mendukung SDG 4 (Quality Education) dengan mendemokratisasi akses pendidikan privat 1-on-1 berkualitas tinggi secara gratis, serta SDG 10 (Reduced Inequalities) dengan menghargai waktu setiap manusia secara setara: 1 jam waktu dari siapapun memiliki nilai tukar yang sama tanpa memandang latar belakang ekonomi.'
    }
  ];

  return (
    <div className="space-y-12 py-2">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Tentang Konnex — Gerakan Ekonomi Berbasis Waktu</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
          Menghilangkan batas finansial dalam belajar dan berbagi keahlian.
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Konnex dibangun dengan keyakinan bahwa setiap individu memiliki sesuatu yang berharga untuk diajarkan, dan selalu ada hal baru yang ingin dipelajari. Menggantikan uang dengan waktu demi kesetaraan ilmu.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoToRegister}
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <span>Daftar & Dapatkan 2 Token Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToDashboard}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-5"
          >
            Jelajahi Mitra Barter
          </button>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-classy p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-900">
            1 Jam = 1 Token Waktu
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Tidak ada inflasi atau tarif berbeda antara satu materi dengan materi lainnya. Satu jam waktu berbagi ilmu Anda bernilai tepat satu jam waktu belajar dari orang lain.
          </p>
        </div>

        <div className="card-classy p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-900">
            Dampak Nyata: SDG 4 & 10
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Membuka jalan bagi pendidikan inklusif berkualitas tanpa kendala biaya (SDG 4) serta memangkas ketimpangan akses informasi dan pelatihan keahlian (SDG 10).
          </p>
        </div>

        <div className="card-classy p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-zinc-700" />
          </div>
          <h3 className="font-heading font-bold text-base text-zinc-900">
            Buku Besar Terverifikasi
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Setiap transaksi dicatat secara immutable dalam database relasional Neon PostgreSQL dengan jaminan atomicity (Prisma Transaction Ledger).
          </p>
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section className="card-classy p-7 md:p-9 space-y-7">
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Alur Penggunaan
          </span>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mt-1">
            Bagaimana cara memulai barter di Konnex?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-semibold text-sm text-zinc-900">
              Buat Profil & Pilih Keahlian
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Tentukan keahlian yang dapat Anda ajarkan (misal: Figma, percakapan bahasa Inggris) dan apa yang ingin Anda pelajari.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-semibold text-sm text-zinc-900">
              Temukan Mitra yang Cocok
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Algoritma smart matchmaker memetakan anggota komunitas yang memiliki kecocokan saling menguntungkan (mutual swap).
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-semibold text-sm text-zinc-900">
              Ajukan Sesi 60 Menit
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Kirim permintaan dengan topik spesifik. Token akan diamankan dalam sistem escrow dan tidak dipotong di awal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-semibold text-sm text-zinc-900">
              Selesaikan & Tukar Token
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Setelah sesi 1 jam selesai, tandai selesai untuk mentransfer 1 token ke mentor secara otomatis dan aman.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack & Architecture Transparency */}
      <section className="card-classy p-7 md:p-8 space-y-5 bg-gradient-to-br from-white to-zinc-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-700" />
              <h3 className="font-heading font-bold text-lg text-zinc-900">
                Arsitektur Teknologi Terbuka & Andal
              </h3>
            </div>
            <p className="text-xs text-zinc-500 max-w-xl">
              Dibangun dengan teknologi modern berskala enterprise untuk memastikan transaksi multi-user yang cepat, aman, dan konsisten.
            </p>
          </div>

          <button
            onClick={onOpenCodeInspector}
            className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>Inspeksi Schema Prisma & Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white border border-zinc-200">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Database</span>
            <span className="font-semibold text-xs text-zinc-900 mt-0.5 block">Neon Serverless PostgreSQL</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-zinc-200">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">ORM</span>
            <span className="font-semibold text-xs text-zinc-900 mt-0.5 block">Prisma Client Interactive Tx</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-zinc-200">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Framework</span>
            <span className="font-semibold text-xs text-zinc-900 mt-0.5 block">Next.js App Router & React</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-zinc-200">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Styling</span>
            <span className="font-semibold text-xs text-zinc-900 mt-0.5 block">Tailwind CSS (Clean Classy)</span>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-2xl font-bold text-zinc-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs text-zinc-500">
            Ketahui lebih lanjut mengenai aturan komunitas dan sistem waktu
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="card-classy p-4 cursor-pointer transition-colors"
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-900">
                    {faq.q}
                  </h4>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-zinc-900' : ''
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="text-xs text-zinc-600 mt-2.5 pt-2 border-t border-zinc-100 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="card-classy p-8 text-center bg-zinc-900 text-white rounded-2xl space-y-3">
        <h3 className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-white">
          Siap memulai barter keahlian pertama Anda?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
          Daftarkan akun dalam 1 menit, klaim 2 token sambutan, dan temukan ratusan maker kreatif yang siap berbagi ilmu.
        </p>
        <div className="pt-2">
          <button
            onClick={onGoToRegister}
            className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Daftar Sekarang Secara Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
