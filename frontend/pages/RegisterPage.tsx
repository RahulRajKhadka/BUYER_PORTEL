import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Home, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';


const passwordRules = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export const RegisterPage = () => {
  const { register, isRegistering } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (!passwordRules.every((r) => r.test(form.password))) e.password = 'Password does not meet requirements';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!validate()) return;
    register(form);
  };

  const fieldClass = (key: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-[10px] text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors ${
      errors[key] ? 'border-red-400 bg-red-50' : 'border-[#e5e2da]'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-[#e5e2da] rounded-[20px] p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#1a1916] rounded-[14px] flex items-center justify-center mx-auto mb-3">
            <Home className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-light tracking-tight text-[#1a1916]">Create account</h1>
          <p className="text-xs text-[#7a7670] mt-1">Start saving properties today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

          {/* Name */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest text-[#1a1916] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              autoFocus
              className={fieldClass('name')}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest text-[#1a1916] mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              className={fieldClass('email')}
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest text-[#1a1916] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setTouched(true); }}
                autoComplete="new-password"
                className={`${fieldClass('password')} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7670] hover:text-[#1a1916] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password rules */}
            {touched && form.password && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {passwordRules.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-[11px] ${ok ? 'text-green-600' : 'text-[#b4b2a9]'}`}
                    >
                      <Check className={`w-3 h-3 flex-shrink-0 ${ok ? 'text-green-500' : 'text-[#d3d1c7]'}`} />
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            )}
            {errors.password && !form.password && (
              <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-2.5 bg-[#1a1916] text-white text-sm font-medium rounded-[10px] hover:bg-[#333] transition-colors disabled:opacity-50 mt-1"
          >
            {isRegistering ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#7a7670] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};