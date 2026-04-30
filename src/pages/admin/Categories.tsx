import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { api, type Category, type CategoryPayload } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const emptyForm: CategoryPayload = { name: '', name_en: '', image: null };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    api.categories.list()
      .then(setCategories)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, name_en: c.name_en, image: c.image });
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.name_en.trim()) {
      setError('Both name fields are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) await api.categories.update(editingId, form);
      else await api.categories.create(form);
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
    await api.categories.delete(deleteId).catch(() => {});
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus size={15} className="mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/60">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Nom Arabe</TableHead>
              <TableHead>Nom Français</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">Chargement...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">Pas de catégories disponibles</TableCell>
              </TableRow>
            ) : categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>
                  {cat.image
                    ? <img src={cat.image} alt={cat.name_en} className="w-10 h-10 object-cover rounded-lg" />
                    : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">—</div>
                  }
                </TableCell>
                <TableCell className="font-medium" dir="rtl">{cat.name}</TableCell>
                <TableCell className="text-gray-700">{cat.name_en}</TableCell>
                <TableCell className="text-gray-400 text-xs font-mono">{cat.slug}</TableCell>
                <TableCell>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cat.count}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(cat)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(cat.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nom Arabe</Label>
              <Input
                dir="rtl"
                placeholder="الحلويات و البسكويت"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Nom Français </Label>
              <Input
                placeholder="Sweets & Biscuits"
                value={form.name_en}
                onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <img src={form.image} alt="preview" className="w-14 h-14 object-cover rounded-lg border" />
                )}
                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer w-fit">
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <Upload size={14} />
                    {uploading ? 'Uploading…' : 'Upload image'}
                  </label>
                  <Input
                    placeholder="or paste image URL"
                    value={form.image ?? ''}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value || null }))}
                  />
                </div>
              </div>
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
              {saving ? 'Enregistrement en cours…' : editingId ? 'Enregistrer les modifications' : 'Ajouter une catégorie'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et supprimera tous les produits associés.
            </AlertDialogDescription>
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
