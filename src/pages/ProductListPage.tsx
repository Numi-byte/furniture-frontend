import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';

/* TYPES */
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  archived?: boolean;
}

/* CATEGORY TREE */
const CATALOG: Record<string, any> = {
  Furniture: {
    Table: {
      'Coffee Table': null,
      'Side Table': null,
      'Console Table': null,
    },
    Chair: null,
  },
  Lighting: {
    'Hanging Lamps': null,
    'Floor Lamps': null,
    'Candle Holders': null,
  },
  Christmas: {
    'Sculpture Decor': null,
    'Serving Bowls': null,
    Platters: null,
    'T - Lights': null,
  },
  'Wall Decor': {
    Frame: {
      Mirrors: null,
      'Photo Frames': null,
    },
    'Wall Arts': null,
    'Wall Clocks': null,
  },
  'Home & Garden': {
    Furniture: null,
    Planters: null,
    'Indoor Vases': null,
  },
};

/* STYLES */
const Page = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const NavWrap = styled.nav`
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  background: var(--surface, #fafafa);
  padding: 1.25rem;
  height: fit-content;

  @media (max-width: 900px) {
    order: 2;
  }
`;

const Row = styled.button<{ level: number; active: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 0.45rem 0.4rem 0.45rem ${({ level }) => `${level * 1.25}rem`};
  font-size: 0.95rem;
  color: ${({ active }) => (active ? 'var(--accent, #111)' : 'var(--gray-700, #555)')};
  font-weight: ${({ active }) => (active ? 600 : 500)};
  &:hover {
    background: var(--gray-100, #f5f5f5);
  }
  svg {
    margin-right: 0.4rem;
    flex-shrink: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2.2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const shine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Skeleton = styled.div`
  height: 420px;
  border-radius: 18px;
  background: #eee;
  overflow: hidden;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #eee 0, #f5f5f5 50%, #eee 100%);
    background-size: 200px 100%;
    animation: ${shine} 1.2s infinite;
  }
`;

/* Helper: collect all leaf categories under a node */
const getLeafCategories = (node: any, path = ''): string[] => {
  let result: string[] = [];
  Object.entries(node).forEach(([label, child]) => {
    const key = path ? `${path} › ${label}` : label;
    if (child === null) {
      result.push(key);
    } else {
      result = result.concat(getLeafCategories(child, key));
    }
  });
  return result;
};

/* COMPONENT */
export default function ProductListPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setCat] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const clean = data.filter((p: Product) => !p.archived);
        setAllProducts(clean);
        setProducts(clean);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

useEffect(() => {
  if (!activeCat) {
    setProducts(allProducts);
    return;
  }

  const parts = activeCat.split(' › ');
  let node: any = CATALOG;
  for (const part of parts) {
    node = node[part];
  }

  if (node === null) {
    // It's a leaf (subsection) -> match category exactly
    setProducts(allProducts.filter(p => p.category === parts[parts.length - 1]));
  } else {
    // It's a section -> if it has subsections, match all their names
    const leafNames = Object.keys(node).filter(k => node[k] === null);
    if (leafNames.length > 0) {
      setProducts(allProducts.filter(p => leafNames.includes(p.category)));
    } else {
      // section with no subsections -> match the section name
      setProducts(allProducts.filter(p => p.category === parts[parts.length - 1]));
    }
  }
}, [activeCat, allProducts]);

  const renderTree = (node: any, level = 0, path = '') =>
    Object.entries(node).map(([label, child]) => {
      const key = path ? `${path} › ${label}` : label;
      const isLeaf = child === null;
      const expanded = open[key];

      return (
        <div key={key}>
          <Row
            level={level}
            active={activeCat === key}
            onClick={() => {
              setCat(key);
              if (!isLeaf) {
                setOpen((o) => ({ ...o, [key]: !expanded }));
              }
            }}
          >
            {isLeaf ? (
              <span style={{ width: 16 }} />
            ) : expanded ? (
              <FiChevronDown />
            ) : (
              <FiChevronRight />
            )}
            {label}
          </Row>
          {!isLeaf && expanded && renderTree(child, level + 1, key)}
        </div>
      );
    });

  return (
    <Page>
      <NavWrap>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.05rem' }}>
          Browse categories
        </h3>
        <Row level={0} active={activeCat === ''} onClick={() => { setCat(''); setOpen({}); }}>
          <span style={{ width: 16 }} /> All products
        </Row>
        {renderTree(CATALOG)}
      </NavWrap>

      <div>
        {activeCat && (
          <p style={{ marginBottom: '1.3rem', color: 'var(--gray-700)' }}>
            Showing <strong>{activeCat}</strong>
          </p>
        )}

        <Grid>
          {loading
            ? [...Array(6)].map((_, i) => <Skeleton key={i} />)
            : products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * i }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
        </Grid>

        {!loading && products.length === 0 && (
          <p style={{ marginTop: '2rem', color: 'var(--gray-600)' }}>
            No products found.
          </p>
        )}
      </div>
    </Page>
  );
}
