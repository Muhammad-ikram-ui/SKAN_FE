"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/shared/MobileShell";
import { GeraiCard } from "@/components/shared/GeraiCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { standApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Stand } from "@/types";

const FILTERS = ["Semua", "Favorit", "Populer"];

export default function BerandaPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const { user } = useAuthStore();
  const [stands, setStands] = useState<Stand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    standApi
      .list()
      .then((res) => setStands(res.data.data ?? []))
      .catch(() =>
        setError(
          "Gagal memuat data gerai. Pastikan backend Laravel aktif di http://127.0.0.1:8000."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredGerai = useMemo(() => {
    const search = query.toLowerCase().trim();
    return stands
      .filter((stand) =>
        stand.nama_stand.toLowerCase().includes(search) ||
        stand.pemilik?.toLowerCase().includes(search)
      )
      .filter((stand, index) => {
        if (activeFilter === "Favorit") return index % 2 === 0;
        if (activeFilter === "Populer") return index % 3 !== 0;
        return true;
      });
  }, [stands, query, activeFilter]);

  return (
    <MobileShell>
      <div className="min-h-screen bg-slate-100 px-4 pb-24 pt-4">
        <section className="space-y-5 rounded-[32px] bg-gradient-to-br from-sky-600 via-cyan-600 to-indigo-600 p-6 text-white shadow-soft ring-1 ring-white/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/80">
                Pesan cepat tanpa antre
              </p>
              <h1 className="text-3xl font-semibold leading-tight">
                Temukan gerai kantin terbaikmu hari ini
              </h1>
              <p className="max-w-xl text-sm leading-6 text-sky-100/85">
                Pilih gerai, temukan menu favorit, dan ambil makananmu dengan lebih cepat. Nikmati pengalaman pemesanan kantin yang lebih rapi, nyaman, dan modern.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 text-white shadow-xl shadow-slate-950/20">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/15">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-100/70">Akses</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user?.role === "siswa" ? "Siswa" : user?.role === "guru" ? "Guru" : "Pengguna"}
              </p>
              <p className="mt-1 text-sm text-sky-100/80">Nikmati pengalaman pesan makanan cepat dari kantin sekolah.</p>
            </div>
            <div className="rounded-[28px] bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/15">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-100/70">Gerai aktif</p>
              <p className="mt-2 text-lg font-semibold text-white">{stands.length}</p>
              <p className="mt-1 text-sm text-sky-100/80">Gerai siap antar dan ambil di lingkungan sekolah.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-5">
          <div className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Cari gerai favoritmu</h2>
              <p className="text-sm text-slate-500">Tersedia pilihan gerai terbaik dengan menu lengkap setiap hari.</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setActiveFilter("Semua")}>Reset filter</Button>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari gerai atau nama pemilik..."
                  className="pl-11"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold text-slate-900">Ringkasan pencarian</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mode Filter</p>
                  <p className="mt-2 font-semibold text-slate-900">{activeFilter}</p>
                  <p className="mt-1">Tampilkan gerai berdasarkan pilihanmu.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hasil sekarang</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{filteredGerai.length}</p>
                  <p className="mt-1">Gerai cocok dengan kata kunci dan filter.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Gerai Kantin</p>
                <p className="text-xs text-slate-400">Pilihan terbaik untuk pesan makanan sekarang</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {filteredGerai.length} hasil
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 py-10 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat gerai...
              </div>
            ) : error ? (
              <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : filteredGerai.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Tidak ada gerai yang cocok. Coba kata kunci lain atau reset filter.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGerai.map((gerai, idx) => (
                  <GeraiCard key={gerai.id} gerai={gerai} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
