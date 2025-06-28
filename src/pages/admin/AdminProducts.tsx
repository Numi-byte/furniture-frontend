import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiPlus, FiEdit2, FiArchive, FiRotateCcw,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ProductFormModal from './ProductFormModal';
import toast from 'react-hot-toast';
import { API_BASE } from '../../api';

/* ──────────────────────────────────────────────────────────────────
   Responsive admin product list
   – Desktop: classic table
   – ≤ 768 px: stacked card layout
   – Color + radius variables picked from design‑system tokens
   ────────────────────────────────────────────────────────────────── */

/* ---------- layout ---------- */
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.6rem;
`;
const H1 = styled.h1`
  font-size: 2rem;
  margin: 0;
`;
const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover { filter: brightness(0.92); }
`;

/* ---------- table (≥ 769 px) ---------- */
const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  /* hide scrollbar on iOS */
  -webkit-overflow-scrolling: touch;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px; /* keep columns visible on narrow viewports */
  th, td { padding: 0.75rem 0.9rem; border-bottom: 1px solid var(--gray-200); }
  th { text-align: left; background: var(--gray-100); font-weight: 600; }
`;
const IconBtn = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0.35rem;
  &:last-child { margin-right: 0; }
  &:hover { color: var(--accent); }
`;

/* ---------- card (≤ 768 px) ---------- */
const CardGrid = styled.div`
  display: grid;
  gap: 1rem;
`;
const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 1.2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  box-shadow: var(--shadow-sm);
`;
const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { margin: 0; font-size: 1rem; line-height: 1.3; }
`;
const Pill = styled.span<{ archived?: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: ${p => (p.archived ? '#6d6d6d' : 'var(--accent)')};
`;
const Meta = styled.p`
  margin: 0; font-size: 0.85rem; color: var(--gray-600);
`;

/* ---------- confirm overlay ---------- */
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 5000;
`;
const Dialog = styled(motion.div)`
  width: 350px; max-width: 90%;
  background: var(--surface);
  padding: 2rem 1.8rem;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
  h4 { margin: 0 0 0.8rem; }
  p { margin: 0 0 1.4rem; color: var(--gray-500); }
`;
const Danger = styled.button`
  padding: 0.7rem 1.4rem;
  background: #e33131;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.6rem;
  &:hover { filter: brightness(1.05); }
`;
const Ghost = styled.button`
  padding: 0.7rem 1.4rem;
  background: transparent;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  color: var(--gray-700);
  font-weight: 600;
  cursor: pointer;
  &:hover { background: var(--gray-100); }
`;

/* ---------- types ---------- */
interface Prod {
  id: number;
  title: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  archived?: boolean;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [list, setList] = useState<Prod[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Prod | undefined>();
  const [confirm, setConfirm] = useState<{ mode: 'archive' | 'restore'; prod: Prod } | null>(null);

  const hdr = { Authorization: `Bearer ${token}` } as const;

  /* load products */
  const load = () => {
    fetch(`${API_BASE}/products`, { headers: hdr })
      .then(r => {
        if (!r.ok) throw new Error('Load failed');
        return r.json();
      })
      .then(setList)
      .catch(() => toast.error('Load failed'));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* archive / restore */
  const toggleArchive = async (p: Prod, toArchive: boolean) => {
    const url = `${API_BASE}/products/${p.id}/${toArchive ? 'archive' : 'unarchive'}`;
    const res = await fetch(url, { method: 'PATCH', headers: hdr });
    if (res.ok) {
      toast.success(toArchive ? 'Product archived' : 'Product restored');
      load();
    } else {
      toast.error('Action failed');
    }
    setConfirm(null);
  };

  /* split lists */
  const active = list.filter(p => !p.archived);
  const archived = list.filter(p => p.archived);

  /* :mobile breakpoint */
  const isMobile = window.matchMedia('(max-width:768px)').matches;

  return (
    <>
      <HeaderRow>
        <H1>Products</H1>
        <AddBtn onClick={() => { setEditing(undefined); setOpen(true); }}>
          <FiPlus/> Add product
        </AddBtn>
      </HeaderRow>

      {/* Active */}
      <h2 style={{ margin: '1.5rem 0 1rem' }}>Active</h2>

      {isMobile ? (
        <CardGrid>
          {active.map(p => (
            <Card key={p.id}>
              <CardTop>
                <h3>{p.title}</h3>
                <Pill>{p.category}</Pill>
              </CardTop>
              <Meta>€{p.price.toFixed(2)} · Stock: {p.stock}</Meta>
              <div>
                <IconBtn onClick={() => { setEditing(p); setOpen(true); }}><FiEdit2/></IconBtn>
                <IconBtn onClick={() => setConfirm({ mode: 'archive', prod: p })}><FiArchive/></IconBtn>
              </div>
            </Card>
          ))}
        </CardGrid>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th/></tr>
            </thead>
            <tbody>
              {active.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.title}</td><td>{p.category}</td>
                  <td>€{p.price.toFixed(2)}</td><td>{p.stock}</td>
                  <td>
                    <IconBtn onClick={() => { setEditing(p); setOpen(true); }}><FiEdit2/></IconBtn>
                    <IconBtn onClick={() => setConfirm({ mode: 'archive', prod: p })}><FiArchive/></IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      {/* Archived */}
      <h2 style={{ margin: '2.5rem 0 1rem' }}>Archived</h2>
      {isMobile ? (
        <CardGrid>
          {archived.map(p => (
            <Card key={p.id}>
              <CardTop>
                <h3>{p.title}</h3>
                <Pill archived>Archived</Pill>
              </CardTop>
              <Meta>€{p.price.toFixed(2)}</Meta>
              <div>
                <IconBtn onClick={() => setConfirm({ mode: 'restore', prod: p })}><FiRotateCcw/></IconBtn>
              </div>
            </Card>
          ))}
        </CardGrid>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th/></tr>
            </thead>
            <tbody>
              {archived.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.title}</td><td>{p.category}</td>
                  <td>€{p.price.toFixed(2)}</td><td>{p.stock}</td>
                  <td>
                    <IconBtn onClick={() => setConfirm({ mode: 'restore', prod: p })}><FiRotateCcw/></IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      {/* create / edit modal */}
      <ProductFormModal
        open={open}
        onClose={() => { setOpen(false); load(); }}
        existing={editing}
      />

      {/* archive / restore confirm */}
      <AnimatePresence>
        {confirm && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirm(null)}
          >
            <Dialog
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h4>{confirm.mode === 'archive' ? 'Archive product?' : 'Restore product?'}</h4>
              <p>“{confirm.prod.title}” {confirm.mode === 'archive' ? 'will be hidden from the shop.' : 'will be visible in the shop again.'}</p>
              {confirm.mode === 'archive' ? (
                <Danger onClick={() => toggleArchive(confirm.prod, true)}>Archive</Danger>
              ) : (
                <Danger style={{ background: 'var(--accent)' }} onClick={() => toggleArchive(confirm.prod, false)}>Restore</Danger>
              )}
              <Ghost onClick={() => setConfirm(null)}>Cancel</Ghost>
            </Dialog>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}
