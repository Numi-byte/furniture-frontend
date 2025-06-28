import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiMenu } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { API_BASE } from '../api';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

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
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 1rem 0.5rem;
    gap: 1rem;
  }
`;

const NavWrap = styled.nav<{ $mobileOpen?: boolean }>`
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  background: var(--surface, #fafafa);
  padding: 1.25rem;
  height: fit-content;
  transition: transform 0.3s ease;

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 1000;
    border-radius: 0;
    overflow-y: auto;
    transform: ${({ $mobileOpen }) => 
      $mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  }
`;

const Row = styled.button<{ level: number; active: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 0.5rem 0.4rem 0.5rem ${({ level }) => `${level * 1.25}rem`};
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: ${({ active }) => (active ? 'var(--accent, #111)' : 'var(--gray-700, #555)')};
  font-weight: ${({ active }) => (active ? 600 : 500)};
  &:hover {
    background: var(--gray-100, #f5f5f5);
  }
  svg {
    margin-right: 0.4rem;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    padding: 0.6rem 0.4rem 0.6rem ${({ level }) => `${level * 1.5}rem`};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const shine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Skeleton = styled.div`
  height: 380px;
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

  @media (max-width: 600px) {
    height: 320px;
  }
`;

const MobileNavButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.7rem 1rem;
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  @media (max-width: 900px) {
    display: flex;
  }
`;

const Overlay = styled.div<{ $visible?: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'all' : 'none')};
  transition: opacity 0.3s ease;

  @media (max-width: 900px) {
    display: block;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (min-width: 901px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-700);
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 900 });

  // Close mobile nav when resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [isMobile, mobileNavOpen]);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/products`)
      .then(r => {
        if (!r.ok) return Promise.reject(r.status);
        return r.json();
      })
      .then((data: Product[]) => {
        const clean = data.filter(p => !p.archived);
        setAllProducts(clean);
        setProducts(clean);
      })
      .catch(e => {
        console.error('Failed loading products', e);
        toast.error('Could not load products');
      })
      .finally(() => {
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

  const handleCategorySelect = (key: string) => {
    setCat(key);
    if (isMobile) {
      setMobileNavOpen(false);
    }
  };

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
              handleCategorySelect(key);
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
      {/* Mobile Navigation Button */}
      <MobileNavButton onClick={() => setMobileNavOpen(true)}>
        <FiMenu size={20} />
        Browse Categories
      </MobileNavButton>

      {/* Mobile Overlay */}
      <Overlay 
        $visible={mobileNavOpen} 
        onClick={() => setMobileNavOpen(false)}
      />

      {/* Navigation */}
      <NavWrap $mobileOpen={mobileNavOpen}>
        <CategoryHeader>
          <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem' }}>
            Browse categories
          </h3>
          <CloseButton onClick={() => setMobileNavOpen(false)}>
            &times;
          </CloseButton>
        </CategoryHeader>
        
        <Row level={0} active={activeCat === ''} onClick={() => handleCategorySelect('')}>
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