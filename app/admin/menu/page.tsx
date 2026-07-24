"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { AdminTopHeader } from "@/components/shared/AdminTopHeader";
import { standApi, menuApi, storageUrl } from "@/lib/api";
import { formatRupiah, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuItem, Stand } from "@/types";

export default function AdminMenuPage() {
  const [stands, setStands] = useState<Stand[]>([]);
  const [activeStand, setActiveStand] = useState<number | null>(null);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nama_menu: "", harga: "", jenis: "makanan", deskripsi: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    standApi
      .list()
      .then((res) => {
        const list: Stand[] = res.data.data ?? [];
        setStands(list);
        if (list.length > 0) setActiveStand(list[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeStand) {
      menuApi.list({ stand_id: activeStand }).then((res) => setMenuList(res.data.data ?? []));
    }
  }, [activeStand]);

  async function toggleTersedia(menu: MenuItem) {
    const newStatus = menu.status === "tersedia" ? "habis" : "tersedia";
    setMenuList((prev) => prev.map((m) => (m.id === menu.id ? { ...m, status: newStatus } : m)));
    try {
      await menuApi.updateStatus(menu.id, newStatus);
    } catch {
      setMenuList((prev) => prev.map((m) => (m.id === menu.id ? { ...m, status: menu.status } : m)));
    }
  }

  async function handleAddMenu() {
    if (!activeStand) return;
    setSaving(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("stand_id", String(activeStand));
      fd.append("nama_menu", form.nama_menu);
      fd.append("harga", form.harga);
      fd.append("jenis", form.jenis);
      if (form.deskripsi) fd.append("deskripsi", form.deskripsi);

      const res = await menuApi.create(fd);
      setMenuList((prev) => [...prev, res.data.data]);
      setForm({ nama_menu: "", harga: "", jenis: "makanan", deskripsi: "" });
      setDialogOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Gagal menambah menu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminTopHeader title="Gerai & Menu" subtitle="Kelola gerai dan menu di setiap gerai" />
      <div className="space-y-4 p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat gerai...
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {stands.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStand(s.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    activeStand === s.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {s.nama_stand}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {menuList.length} menu terdaftar di gerai ini
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="primary" size="sm">
                    <Plus className="h-4 w-4" /> Tambah Menu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Menu Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Nama Menu</Label>
                      <Input
                        value={form.nama_menu}
                        onChange={(e) => setForm({ ...form, nama_menu: e.target.value })}
                        placeholder="cth: Nasi Ayam Geprek"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Harga (Rp)</Label>
                        <Input
                          type="number"
                          value={form.harga}
                          onChange={(e) => setForm({ ...form, harga: e.target.value })}
                          placeholder="15000"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Jenis</Label>
                        <Select
                          value={form.jenis}
                          onValueChange={(v) => setForm({ ...form, jenis: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="makanan">Makanan</SelectItem>
                            <SelectItem value="minuman">Minuman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Deskripsi (opsional)</Label>
                      <Textarea
                        value={form.deskripsi}
                        onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                        placeholder="Deskripsi singkat menu"
                      />
                    </div>
                    {formError && <p className="text-sm text-rose-500">{formError}</p>}
                  </div>
                  <DialogFooter>
                    <Button variant="primary" onClick={handleAddMenu} disabled={saving}>
                      {saving ? "Menyimpan..." : "Simpan Menu"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {menuList.map((menu) => {
                const fotoUrl = storageUrl(menu.foto);
                return (
                  <div key={menu.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-card">
                    <div className="relative mb-2 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {fotoUrl ? (
                        <Image src={fotoUrl} alt={menu.nama_menu} fill className="object-cover" sizes="300px" />
                      ) : (
                        <UtensilsCrossed className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{menu.nama_menu}</p>
                    <p className="text-xs capitalize text-slate-400">{menu.jenis}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{formatRupiah(menu.harga)}</p>
                      <button
                        onClick={() => toggleTersedia(menu)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          menu.status === "tersedia"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {menu.status === "tersedia" ? "Tersedia" : "Habis"}
                      </button>
                    </div>
                  </div>
                );
              })}
              {menuList.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-slate-400">
                  Belum ada menu di gerai ini.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
