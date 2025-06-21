import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  width: 380px;
  background: var(--card-bg);
  padding: 2.1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;
const H1 = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  color: var(--gold);
  margin-bottom: 1.3rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 8px;
  background: #2a2a2a;
  color: #f5f5f5;
`;
const Btn = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  background: var(--gold);
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.25s;
  &:hover { opacity: 0.85; }
`;

export default function ResetPasswordPage() {
  const [search] = useSearchParams();
  const token = search.get('token');
  const nav = useNavigate();
  const [pass, setPass] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [err  , setErr  ] = useState<string | null>(null);

  const submit = async (e:any)=>{
    e.preventDefault();
    setErr(null);
    try{
      const res = await fetch('http://localhost:3000/auth/reset-password',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ token, newPassword: pass })
      });
      if(!res.ok) throw new Error('Invalid or expired token');
      setToast('Password reset! Redirecting to login...');
      setTimeout(()=> nav('/login'), 2000);
    }catch(e:any){ setErr(e.message); }
  };

  return (
    <Wrapper>
      <Card>
        <H1>Set new password</H1>

        {toast && <p style={{ color: 'var(--gold)', textAlign: 'center' }}>{toast}</p>}
        {err && <p style={{ color: 'tomato', textAlign: 'center' }}>{err}</p>}

        {!toast && (
          <form onSubmit={submit}>
            <Input
              type="password"
              placeholder="New secure password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
            <Btn type="submit">Reset password</Btn>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <Link to="/login">Back to login</Link>
        </p>
      </Card>
    </Wrapper>
  );
}
