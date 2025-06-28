/*  src/pages/SignupPage.tsx  */
import {
  useState,
  lazy,
  Suspense,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../api';

/* ───── palette ───── */
const ACCENT = '#0071e3';
const ERR = '#d93025';

/* ───── layout shells ───── */
const Split = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  background: url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80')
    center/cover no-repeat;
  position: relative;
  @media (max-width: 768px) {
    height: 38vh;
  }
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
`;

const Caption = styled.div`
  position: absolute;
  bottom: 2.8rem;
  left: 2.8rem;
  z-index: 1;
  color: #fff;
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.55rem;
  }
  p {
    line-height: 1.55;
    max-width: 320px;
  }
  @media (max-width: 768px) {
    bottom: 1.6rem;
    left: 1.6rem;
    h2 {
      font-size: 1.6rem;
    }
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  padding: 4rem 1rem;
`;

/* ───── card ───── */
const Card = styled(motion.div)`
  width: 100%;
  max-width: 340px;
  background: #fff;
  border-radius: 22px;
  padding: 2.6rem 2rem 2.8rem;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.08);
  @media (max-width: 375px) {
    padding: 2.2rem 1.6rem 2.4rem;
  }
`;
const H1 = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.6rem;
  color: #111;
`;

const Field = styled.div`
  margin-bottom: 1.1rem;
`;
const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
  border-radius: 14px;
  background: #fafafa;
  border: 1px solid ${({ error }) => (error ? ERR : '#d0d0d0')};
  &:focus {
    outline: none;
    border-color: ${ACCENT};
    background: #fff;
  }
`;
const Btn = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1.05rem;
  border: none;
  border-radius: 18px;
  margin-top: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: ${({ disabled }) => (disabled ? '#a6a6a6' : ACCENT)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
`;
const spin = keyframes`to { transform: rotate(360deg) }`;
const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;
const ErrorMsg = styled.p`
  color: ${ERR};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

/* ───── overlay spinner (shared) ───── */
const oSpin = keyframes`to { transform: rotate(360deg) }`;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 5000;
`;
const Loader = styled.div`
  width: 72px;
  height: 72px;
  border: 6px solid ${ACCENT};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${oSpin} 1s linear infinite;
`;
const LazyOverlay = lazy(() =>
  Promise.resolve({ default: () => <Overlay><Loader /></Overlay> })
);

/* ───── component ───── */
export default function SignupPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, set] = useState({ name: '', email: '', pass: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwdOK = form.pass.length >= 8;
  const ready = form.name && emailOK && pwdOK && !busy;

  const h = (e: ChangeEvent<HTMLInputElement>) => {
    set({ ...form, [e.target.name]: e.target.value });
    setErr(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.pass,
        }),
      });
      if (!res.ok) {
        const msg = (await res.json())?.message ?? 'Signup failed';
        throw new Error(msg);
      }
      const who = await login(form.email, form.pass);
      toast.success('Welcome!');
      nav(who.role === 'admin' ? '/admin' : '/account');
    } catch (e: any) {
      setErr(e.message);
      toast.error(e.message);
      setBusy(false);
    }
  };

  /* ─── JSX ─── */
  return (
    <>
      <Split>
        {/* hero */}
        <Left>
          <Caption>
            <h2>Casa Nuevo</h2>
            <p>
              Hand‑finished furniture crafted in Italy.
              <br />
              Join us & enjoy member‑only previews.
            </p>
          </Caption>
        </Left>

        {/* form */}
        <Right>
          <Card
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <H1>Create Account</H1>

            {err && <ErrorMsg aria-live="polite">{err}</ErrorMsg>}

            <form onSubmit={submit} noValidate>
              <Field>
                <Input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={h}
                  disabled={busy}
                />
              </Field>

              <Field>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={h}
                  disabled={busy}
                  error={!!form.email && !emailOK}
                />
              </Field>

              <Field>
                <Input
                  name="pass"
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={form.pass}
                  onChange={h}
                  disabled={busy}
                  error={!!form.pass && !pwdOK}
                />
              </Field>

              <Btn type="submit" disabled={!ready}>
                {busy && <Spinner />}
                {busy ? 'Creating…' : 'Sign Up'}
              </Btn>
            </form>

            <p
              style={{
                marginTop: '1.45rem',
                fontSize: '.9rem',
                textAlign: 'center',
              }}
            >
              Already have an account?{' '}
              <Link to="/login" style={{ color: ACCENT, fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </Card>
        </Right>
      </Split>

      <Suspense fallback={<></>}>{busy && <LazyOverlay />}</Suspense>
    </>
  );
}
