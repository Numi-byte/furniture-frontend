import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiArchive, FiRotateCcw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ProductFormModal from './ProductFormModal';
import toast from 'react-hot-toast';

/* ───────── styled components ───────── */
const H1 = styled.h1`font-size:2rem;margin-bottom:2rem;`;
const Table = styled.table`
  width:100%;border-collapse:collapse;margin-bottom:3rem;
  th,td{padding:.75rem;border-bottom:1px solid var(--gray-200);}
  th{background:var(--gray-100);text-align:left;}
`;
const IconBtn = styled.button`
  background:none;border:none;color:var(--gray-600);cursor:pointer;font-size:1.1rem;
  display:inline-flex;align-items:center;margin-right:.4rem;
  &:hover{color:var(--accent);}
`;

const Overlay = styled(motion.div)`
  position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);
  display:flex;align-items:center;justify-content:center;z-index:5000;
`;
const Box = styled(motion.div)`
  width:360px;max-width:90%;background:var(--surface);padding:2rem;border-radius:10px;
  box-shadow:0 8px 24px rgba(0,0,0,.4);text-align:center;
`;
const Danger = styled.button`
  padding:.75rem 1.6rem;background:#e33131;color:#fff;border:none;border-radius:6px;
  font-weight:600;cursor:pointer;margin-right:1rem;
  &:hover{filter:brightness(1.05);}
`;
const Ghost = styled.button`
  padding:.75rem 1.6rem;background:transparent;color:var(--gray-600);
  border:1px solid var(--gray-300);border-radius:6px;font-weight:600;
  cursor:pointer;&:hover{background:var(--gray-100);}
`;

/* ───────── types ───────── */
interface Prod {
  id: number; title: string; price: number; stock: number;
  imageUrl: string; category: string; archived?: boolean;
}

/* ───────── component ───────── */
export default function AdminProducts() {
  const { token } = useAuth();
  const [list, setList] = useState<Prod[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Prod | undefined>();
  const [toArchive, setToArchive] = useState<Prod | undefined>();
  const [toUnarchive, setToUnarchive] = useState<Prod | undefined>();

  const hdr = { Authorization: `Bearer ${token}` };

  const load = () => {
    fetch('http://localhost:3000/products', { headers: hdr })
      .then(r => r.json())
      .then(setList)
      .catch(() => toast.error('Load failed'));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleArchive = async () => {
    if (!toArchive) return;
    const r = await fetch(`http://localhost:3000/products/${toArchive.id}/archive`, {
      method: 'PATCH',
      headers: hdr
    });
    if (r.ok) {
      toast.success('Product archived');
      load();
    } else {
      toast.error('Archive failed');
    }
    setToArchive(undefined);
  };

  const handleUnarchive = async () => {
    if (!toUnarchive) return;
    const r = await fetch(`http://localhost:3000/products/${toUnarchive.id}/unarchive`, {
      method: 'PATCH',
      headers: hdr
    });
    if (r.ok) {
      toast.success('Product restored');
      load();
    } else {
      toast.error('Unarchive failed');
    }
    setToUnarchive(undefined);
  };

  const activeProducts = list.filter(p => !p.archived);
  const archivedProducts = list.filter(p => p.archived);

  return (
    <>
      <H1>Products</H1>
      <IconBtn onClick={() => { setEditing(undefined); setOpen(true); }}>
        <FiPlus /> Add
      </IconBtn>

      {/* Active Products */}
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Active Products</h2>
      <Table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th/></tr>
        </thead>
        <tbody>
          {activeProducts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.title}</td><td>{p.category}</td>
              <td>€{p.price.toFixed(2)}</td><td>{p.stock}</td>
              <td>
                <IconBtn onClick={() => { setEditing(p); setOpen(true); }}><FiEdit2 /></IconBtn>
                <IconBtn onClick={() => setToArchive(p)}><FiArchive /></IconBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Archived Products */}
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Archived Products</h2>
      <Table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th/></tr>
        </thead>
        <tbody>
          {archivedProducts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.title}</td><td>{p.category}</td>
              <td>€{p.price.toFixed(2)}</td><td>{p.stock}</td>
              <td>
                <IconBtn onClick={() => setToUnarchive(p)}><FiRotateCcw /></IconBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ProductFormModal
        open={open}
        onClose={() => { setOpen(false); load(); }}
        existing={editing}
      />

      {/* Archive Confirm */}
      <AnimatePresence>
        {toArchive && (
          <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setToArchive(undefined)}>
            <Box initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1rem' }}>Archive product?</h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--gray-500)' }}>
                “{toArchive.title}” will be hidden from the shop.
              </p>
              <Danger onClick={handleArchive}>Yes, archive</Danger>
              <Ghost onClick={() => setToArchive(undefined)}>Cancel</Ghost>
            </Box>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Unarchive Confirm */}
      <AnimatePresence>
        {toUnarchive && (
          <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setToUnarchive(undefined)}>
            <Box initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1rem' }}>Restore product?</h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--gray-500)' }}>
                “{toUnarchive.title}” will be visible again in the shop.
              </p>
              <Danger onClick={handleUnarchive}>Yes, restore</Danger>
              <Ghost onClick={() => setToUnarchive(undefined)}>Cancel</Ghost>
            </Box>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}
