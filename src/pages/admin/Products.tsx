import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { api, type Product, type Category, type ProductPayload } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FormState {
  name: string;
  name_en: string;
  price: string;
  old_price: string;
  image: string;
  category_id: string;
  badge: string;
  in_stock: boolean;
}

const emptyForm: FormState = {
  name: '', name_en: '', price: '', old_price: '',
  image: '', category_id: 'none', badge: 'none', in_stock: true,
};

const BADGE_COLORS: Record<string, string> = {
  new:  'bg-blue-100 text-blue-700',
  sale: 'bg-red-100 text-red-700',
  hot:  'bg-orange-100 text-orange-700',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([api.products.list(), api.categories.list()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      name_en: p.name_en,
      price: String(p.price),
      old_price: p.old_price != null ? String(p.old_price) : '',
      image: p.image ?? '',
      category_id: p.category_id != null ? String(p.category_id) : 'none',
      badge: p.badge ?? 'none',
      in_stock: p.in_stock,
    });
    setError('');
    setDialogOpen(true);
  };

  const buildPayload = (): ProductPayload => ({
    name: form.name.trim(),
    name_en: form.name_en.trim(),
    price: parseFloat(form.price),
    old_price: form.old_price ? parseFloat(form.old_price) : null,
    image: form.image.trim() || null,
    category_id: form.category_id !== 'none' ? parseInt(form.category_id) : null,
    badge: form.badge !== 'none' ? form.badge : null,
    in_stock: form.in_stock,
  });

  const handleSave = async () => {
    if (!form.name.trim() || !form.name_en.trim() || !form.price) {
      setError('Arabic name, English name and price are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload();
      if (editingId) await api.products.update(editingId, payload);
      else await api.products.create(payload);
      setDialogOpen(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await api.products.delete(deleteId).catch(() => {});
    setDeleteId(null);
    load();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.upload(file);
      setForm(f => ({ ...f, image: result.url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const set = (key: keyof FormState, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} produits</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus size={15} className="mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60">
              <TableHead className="w-14">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400">Chargement…</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400">Pas de produits disponibles</TableCell>
              </TableRow>
            ) : products.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.image
                    ? <img src={p.image} alt={p.name_en} className="w-10 h-10 object-cover rounded-lg" />
                    : <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                  }
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900 text-sm" dir="rtl">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.name_en}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{p.price} <span className="text-gray-400">د.م</span></div>
                  {p.old_price != null && (
                    <div className="text-xs text-gray-400 line-through">{p.old_price} د.م</div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">{p.category_name ?? '—'}</TableCell>
                <TableCell>
                  {p.badge
                    ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_COLORS[p.badge]}`}>{p.badge}</span>
                    : <span className="text-gray-300 text-xs">—</span>
                  }
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.in_stock ? 'En Stock' : 'Rupture de stock'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(p)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(p.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom Arabe</Label>
                <Input dir="rtl" placeholder="ساشي ديال الويزة" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Nom Français</Label>
                <Input placeholder="Dates Pack" value={form.name_en} onChange={e => set('name_en', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Prix (د.م)</Label>
                <Input type="number" min="0" step="0.1" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Prix Ancien <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input type="number" min="0" step="0.1" placeholder="0.00" value={form.old_price} onChange={e => set('old_price', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Select value={form.category_id} onValueChange={v => set('category_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune catégorie</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Badge</Label>
                <Select value={form.badge} onValueChange={v => set('badge', v)}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="new">Nouveau</SelectItem>
                    <SelectItem value="sale">Solde</SelectItem>
                    <SelectItem value="hot">Populaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Image</Label>
              <div className="flex items-start gap-3">
                {form.image && (
                  <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded-lg border shrink-0" />
                )}
                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer w-fit">
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <Upload size={14} />
                    {uploading ? 'Uploading…' : 'Upload image'}
                  </label>
                  <Input
                    placeholder="or paste image URL"
                    value={form.image}
                    onChange={e => set('image', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={form.in_stock}
                onCheckedChange={v => set('in_stock', v)}
              />
              <Label>En Stock</Label>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? 'Enregistrement en cours…' : editingId ? 'Enregistrer les modifications' : 'Ajouter un produit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
            <AlertDialogDescription>Cette action ne peut pas être annulée.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
