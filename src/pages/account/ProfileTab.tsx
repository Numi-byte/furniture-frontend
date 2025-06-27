import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../../api'; 

const Holder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.8rem;
  max-width: 600px;
`;

const Avatar = styled.div<{ src?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ccc center/cover no-repeat url(${p => p.src || '/avatar-placeholder.png'});
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  ${p => p.primary
    ? 'background: #0071e3; color: #fff;'
    : 'background: #eee; color: #333;'}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 0.6rem;
    border-bottom: 1px solid #ddd;
  }
`;

export default function ProfileTab() {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.email || '');
  const [orders, setOrders] = useState<any[]>([]);

useEffect(() => {
  if (!token) return;

  fetch(`${API_BASE}/customer/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load orders');
      return res.json();
    })
    .then(setOrders)
    .catch(err => {
      console.error(err);
      toast.error('Could not fetch your orders');
    });
}, [token]);

  const save = async () => {
    try {
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Could not update profile');
    }
  };

  return (
    <Holder>
      <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Profile</h1>

      <Card>
        <Avatar src={undefined} />
        {editing ? (
          <>
            <Input value={name} onChange={e => setName(e.target.value)} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
              <Button primary onClick={save}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user?.email}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <Button primary onClick={() => setEditing(true)}>Edit Profile</Button>
          </>
        )}
      </Card>

      <Card>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>My Invoices</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <Table>
            <thead>
              <tr><th>ID</th><th>Date</th><th>Total</th><th>Invoice</th></tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>${o.total.toFixed(2)}</td>
                  <td>
                    {o.invoiceUrl
                      ? <a href={o.invoiceUrl} target="_blank" rel="noreferrer">Download</a>
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Holder>
  );
}
