import { useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Panel = styled.div`
  max-width: 420px;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const H2   = styled.h2`font-size:1.4rem;color:var(--gold);margin-bottom:1rem;`;
const Input= styled.input`
  width:100%;padding:.8rem 1rem;margin-bottom:1rem;border:none;border-radius:8px;
  background:#2a2a2a;color:#f5f5f5;
`;
const Btn  = styled.button`
  width:100%;padding:.9rem;border:none;border-radius:8px;background:var(--gold);
  color:#000;font-weight:600;cursor:pointer;transition:opacity .25s;
  &:hover{opacity:.85;}
`;

export default function ChangePasswordPanel() {
  const { token } = useAuth();
  const [form,set] = useState({ old:'', neo:'', neo2:'' });
  const [loading,setLoading] = useState(false);

  const h = (e:any)=>set({ ...form, [e.target.name]: e.target.value });

  const submit = async(e:any)=>{
    e.preventDefault();
    if(form.neo !== form.neo2){ toast.error('Passwords mismatch'); return; }
    setLoading(true);
    try{
      const res = await fetch('http://localhost:3000/auth/change-password',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: form.old, newPassword: form.neo })
      });
      if(!res.ok) throw new Error('Wrong old password');
      toast.success('Password updated');
      set({ old:'', neo:'', neo2:'' });
    }catch(e:any){ toast.error(e.message || 'Failed'); }
    finally{ setLoading(false); }
  };

  return (
    <Panel>
      <H2>Change Password</H2>
      <form onSubmit={submit}>
        <Input
          name="old" type="password" placeholder="Current password"
          value={form.old} onChange={h} required disabled={loading}
        />
        <Input
          name="neo" type="password" placeholder="New password"
          value={form.neo} onChange={h} required disabled={loading}
        />
        <Input
          name="neo2" type="password" placeholder="Confirm new password"
          value={form.neo2} onChange={h} required disabled={loading}
        />
        <Btn type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Update'}
        </Btn>
      </form>
    </Panel>
  );
}
