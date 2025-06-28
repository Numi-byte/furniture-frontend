/*  src/pages/ResetPasswordPage.tsx  */
import {
  useSearchParams,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useState, lazy, Suspense, type FormEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { API_BASE } from '../api';
import { motion } from 'framer-motion';

/* ——— palette ——— */
const ACCENT = '#0071e3';
const ERR = '#d93025';

/* ——— layout ——— */
const Wrapper = styled.div`
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
`;

const Card = styled.div`
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
  margin-bottom: 1.5rem;
  color: #111;
`;

/* ——— form bits ——— */
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
  margin-top: 0.85rem;
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

/* ——— tiny spinner ——— */
const spin = keyframes`to { transform: rotate(360deg) }`;
const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

const Info = styled.p`
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`;

const ErrorMsg = styled.p`
  color: ${ERR};
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

/* ——— overlay spinner (shared) ——— */
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

/* ——— component ——— */
export default function ResetPasswordPage() {
  const [search] = useSearchParams();
  const token = search.get('token');
  const nav = useNavigate();

  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const strong = pass.length >= 8;
  const ready = strong && !busy;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pass }),
      });
      if (!res.ok) throw new Error('Invalid or expired reset link');
      setToast('Password updated! Redirecting…');
      setTimeout(() => nav('/login'), 2200);
    } catch (e: any) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <>
      <Wrapper>
        <Card
          as={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <H1>Set new password</H1>

          {toast && <Info style={{ color: ACCENT }}>{toast}</Info>}
          {err && <ErrorMsg aria-live="polite">{err}</ErrorMsg>}

          {!toast && (
            <form onSubmit={submit} noValidate>
              <Input
                type="password"
                placeholder="New password (min 8 chars)"
                value={pass}
                onChange={e => setPass(e.target.value)}
                error={!!pass && !strong}
                disabled={busy}
              />
              <Btn type="submit" disabled={!ready}>
                {busy && <Spinner />}
                {busy ? 'Saving…' : 'Reset password'}
              </Btn>
            </form>
          )}

          <Info>
            <Link to="/login" style={{ color: ACCENT }}>
              Back to Login
            </Link>
          </Info>
        </Card>
      </Wrapper>

      <Suspense fallback={<></>}>{busy && <LazyOverlay />}</Suspense>
    </>
  );
}
