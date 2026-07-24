import Link from "next/link";
import { Stand } from "@/types";

/** Ambil singkatan dari nama stand untuk avatar (RPL, BR, AK, MP, dst) */
function initials(nama: string): string {
  const words = nama.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

const COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
];

export function GeraiCard({ gerai, index = 0 }: { gerai: Stand; index?: number }) {
  const color = COLORS[index % COLORS.length];

  return (
    <Link
      href={`/gerai/${gerai.id}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-3 text-center shadow-soft transition-transform hover:-translate-y-0.5"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${color}`}
      >
        {initials(gerai.nama_stand)}
      </div>
      <div>
        <p className="line-clamp-1 text-sm font-semibold text-slate-900">
          {gerai.nama_stand}
        </p>
        {gerai.pemilik && (
          <p className="line-clamp-1 text-[11px] text-slate-400">{gerai.pemilik}</p>
        )}
      </div>
    </Link>
  );
}
