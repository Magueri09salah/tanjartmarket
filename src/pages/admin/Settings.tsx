import { useState } from 'react';
import { KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const PasswordInput = ({
  label,
  field,
  showKey,
  form,
  show,
  setForm,
  setShow,
}: {
  label: string;
  field: string;
  showKey: string;
  form: Record<string, string>;
  show: Record<string, boolean>;
  setForm: (f: Record<string, string>) => void;
  setShow: (s: Record<string, boolean>) => void;
}) => (
  <div>
    <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Input
        id={field}
        name={field}
        type={show[showKey] ? 'text' : 'password'}
        value={form[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        required
        className="h-11 pr-10"
        placeholder="••••••••"
        autoComplete={field === 'current_password' ? 'current-password' : 'new-password'}
      />
      <button
        type="button"
        onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default function Settings() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (form.new_password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.settings.changePassword(
        form.current_password,
        form.new_password,
        form.confirm_password
      );
      toast.success('Password updated successfully!');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <KeyRound size={18} className="text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-500">Update your admin password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput label="Current Password"      field="current_password" showKey="current" form={form} show={show} setForm={setForm} setShow={setShow} />
          <PasswordInput label="New Password"          field="new_password"     showKey="new"     form={form} show={show} setForm={setForm} setShow={setShow} />
          <PasswordInput label="Confirm New Password"  field="confirm_password" showKey="confirm" form={form} show={show} setForm={setForm} setShow={setShow} />

          {/* Password strength */}
          {form.new_password && (
            <div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.new_password.length >= level * 3
                        ? level <= 1 ? 'bg-red-400'
                          : level <= 2 ? 'bg-yellow-400'
                          : level <= 3 ? 'bg-blue-400'
                          : 'bg-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {form.new_password.length < 6 ? 'Too short' :
                 form.new_password.length < 9 ? 'Fair' :
                 form.new_password.length < 12 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}

          {/* Match indicator */}
          {form.confirm_password && (
            <p className={`text-xs flex items-center gap-1 ${
              form.new_password === form.confirm_password ? 'text-emerald-600' : 'text-red-500'
            }`}>
              <ShieldCheck size={12} />
              {form.new_password === form.confirm_password ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}