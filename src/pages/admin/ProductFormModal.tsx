import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

/* ───── styled ───── */
const Overlay = styled(motion.div)`
  position:fixed;inset:0;background:rgba(0,0,0,.45);
  backdrop-filter:blur(4px);z-index:4500;
  display:flex;align-items:center;justify-content:center;
`;
const Box = styled(motion.div)`
  width:420px;max-width:95%;padding:2rem;border-radius:12px;
  background:var(--surface,#222);box-shadow:0 8px 24px rgba(0,0,0,.4);
`;
const Label = styled.label`display:block;margin-bottom:.35rem;font-weight:600;font-size:.9rem;`;
const Input = styled.input`
  width:100%;padding:.75rem;border:1px solid #444;border-radius:6px;
  background:#111;color:#eee;margin-bottom:1rem;font-size:.95rem;
  &:focus{outline:none;border-color:var(--accent);}
`;
const Select = styled.select`
  width:100%;padding:.75rem;border:1px solid #444;border-radius:6px;
  background:#111;color:#eee;margin-bottom:1rem;font-size:.95rem;
  &:focus{outline:none;border-color:var(--accent);}
`;
const TextA = styled.textarea`
  width:100%;height:80px;padding:.75rem;border:1px solid #444;border-radius:6px;
  background:#111;color:#eee;resize:vertical;margin-bottom:1rem;
  &:focus{outline:none;border-color:var(--accent);}
`;
const Btn = styled.button<{disabled?:boolean}>`
  width:100%;padding:.9rem;border:none;border-radius:6px;font-weight:700;
  background:var(--accent);color:#000;cursor:pointer;transition:filter .2s;
  opacity:${p=>p.disabled?0.6:1};
  &:hover{filter:brightness(1.08);}
`;

/* ───── categories ───── */
const categories = [
  'Coffee Table','Side Table','Console Table','Chair',
  'Hanging Lamps','Floor Lamps','Candle Holders',
  'Sculpture Decor','Serving Bowls','Platters','T - Lights',
  'Mirrors','Photo Frames','Wall Arts','Wall Clocks',
  'Furniture','Planters','Indoor Vases'
];

/* ───── component ───── */
export default function ProductFormModal({
  open,
  onClose,
  existing
}:{
  open: boolean;
  onClose: ()=>void;
  existing?: any;
}) {
  const { token } = useAuth();
  const [form,setForm] = useState({
    title:'',category:'Coffee Table',
    price:'',stock:'',description:'',imageUrl:''
  });
  const [loading,setLoading] = useState(false);

  // Prefill when editing
  useEffect(()=>{
    if(existing){
      setForm({
        title: existing.title   || '',
        category: existing.category || 'Coffee Table',
        price: String(existing.price  || ''),
        stock: String(existing.stock  || ''),
        description: existing.description || '',
        imageUrl: existing.imageUrl || ''
      });
    } else {
      setForm({title:'',category:'Coffee Table',price:'',stock:'',description:'',imageUrl:''});
    }
  },[existing,open]);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(loading) return;

    // Basic required field check
    if(!form.title.trim() || !form.category || !form.price || !form.stock){
      toast.error('Please fill Title, Category, Price, and Stock');
      return;
    }

    setLoading(true);
    const method = existing ? 'PUT' : 'POST';
    const url = existing
      ? `http://localhost:3000/products/${existing.id}`
      : 'http://localhost:3000/products';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          description: form.description,
          imageUrl: form.imageUrl
        })
      });

      if(!res.ok){
        const text = await res.text().catch(()=>null);
        throw new Error(text || 'Failed to save');
      }

      toast.success(existing ? 'Product updated' : 'Product created');
      onClose();  // parent will reload list
    } catch(err: any) {
      console.error(err);
      toast.error(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={onClose}
        >
          <Box
            initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}}
            exit={{scale:.92,opacity:0}} transition={{type:'spring',stiffness:260,damping:22}}
            onClick={e=>e.stopPropagation()}
          >
            <h3 style={{marginBottom:'1rem',fontSize:'1.3rem',fontWeight:600}}>
              {existing ? 'Edit Product' : 'Add Product'}
            </h3>

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                style={{width:'100%',borderRadius:8,marginBottom:'1rem'}}
              />
            )}

            <form onSubmit={handleSubmit}>
              <Label>Title*</Label>
              <Input name="title" value={form.title} onChange={handleChange} />

              <Label>Category*</Label>
              <Select name="category" value={form.category} onChange={handleChange}>
                {categories.map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>

              <Label>Price (€)*</Label>
              <Input
                name="price"
                type="number"
                step=".01"
                value={form.price}
                onChange={handleChange}
              />

              <Label>Stock*</Label>
              <Input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
              />

              <Label>Description</Label>
              <TextA name="description" value={form.description} onChange={handleChange} />

              <Label>Image URL</Label>
              <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} />

              <Btn type="submit" disabled={loading}>
                {loading
                  ? (existing ? 'Updating…' : 'Creating…')
                  : (existing ? 'Update Product' : 'Create Product')}
              </Btn>
            </form>
          </Box>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
