/*  src/pages/HomePage.tsx  */
/*  Apple‑inspired landing with lazy‑loaded Newsletter  */

import {
  useEffect,
  useState,
  Suspense,
  lazy,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { API_BASE } from '../api';
import { toast } from 'react-toastify';

/* ---- palette ---- */
const ACCENT = '#0071e3';
const TXT    = '#111';
const SUB    = '#4b4b4b';
const BG     = '#f5f5f7';

/* ---- hero ---- */
const Hero = styled.section`
  min-height:88vh;display:grid;place-items:center;text-align:center;
  background:#fff url('https://images.unsplash.com/photo-1600585154153-14ca8c92a76e?auto=format&fit=crop&w=2100&q=80')
              center/cover;
  position:relative;overflow:hidden;
  &:before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.7);
           backdrop-filter:blur(12px);}
`;
const HeroInner = styled(motion.div)`
  position:relative;z-index:1;max-width:720px;padding:0 1.2rem;
`;
const CTA = styled(Link)`
  display:inline-block;background:${ACCENT};color:#fff;padding:.9rem 2.4rem;
  border-radius:24px;font-weight:600;margin-top:2.4rem;transition:transform .25s;
  &:hover{transform:scale(1.06);}
`;

/* ---- marquee ---- */
const slide = keyframes`to{transform:translateX(-50%);} `;
const Strip = styled.section`
  overflow:hidden;white-space:nowrap;background:#fff;padding:3rem 0;
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  &:hover div{animation-play-state:paused;}
`;
const Track = styled.div`
  display:inline-flex;animation:${slide} 26s linear infinite;
`;
const Tile = styled.figure`
  width:320px;margin:0 1.6rem;border-radius:20px;overflow:hidden;
  background:#fff;border:1px solid #e5e5e5;transition:.3s;
  img{width:100%;height:200px;object-fit:cover;}
  figcaption{padding:1rem;font-size:1rem;color:${TXT};}
  &:hover{transform:translateY(-5px);box-shadow:0 6px 16px rgba(0,0,0,.06);}
`;

/* ---- values ---- */
const Values = styled.section`background:${BG};padding:5rem 1.2rem;`;
const Grid = styled.div`
  max-width:1180px;margin:0 auto;display:grid;gap:2.4rem;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
`;
const Card = styled(motion.div)`
  background:#fff;border:1px solid #e5e5e5;border-radius:18px;
  padding:2.2rem;text-align:center;
  h3{margin:.8rem 0;color:${TXT};font-size:1.15rem;font-weight:600;}
  p{color:${SUB};font-size:.95rem;line-height:1.55;}
`;

/* ---- lazy Newsletter ---- */
const NewsletterSection = lazy(() => import('../components/NewsletterSection'));

/* ---- component ---- */
export default function HomePage() {
  const [products, setProducts] = useState<
    { id: number; title: string; imageUrl: string }[]
  >([]);

  /* load 6 showcase products */
/* load 6 showcase products */
useEffect(() => {
  fetch(`${API_BASE}/products?limit=6`)
    .then(r => {
      if (!r.ok) throw new Error('Failed to load products');
      return r.json();
    })
    .then(setProducts)
    .catch(err => {
      console.error(err);
      toast.error('Could not load products');
    });
}, []);

  /* sentinel triggers Newsletter lazy‑load */
  const { ref: sentryRef, inView } = useInView({ rootMargin: '400px' });

  return (
    <>
      {/* hero */}
      <Hero>
        <HeroInner
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 style={{ fontSize: '3.2rem', lineHeight: 1.12, color: TXT }}>
            Furniture crafted for<br />
            quiet&nbsp;beauty.
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: SUB,
              maxWidth: 540,
              margin: '1.4rem auto 0',
            }}
          >
            Discover timeless pieces engineered for modern living.
          </p>
          <CTA to="/products">Explore collection</CTA>
        </HeroInner>
      </Hero>

      {/* marquee */}
      {products.length > 0 && (
        <Strip>
          <Track>
            {[...products, ...products].map((p) => (
              <Tile key={Math.random()}>
                <img src={p.imageUrl} alt={p.title} />
                <figcaption>{p.title}</figcaption>
              </Tile>
            ))}
          </Track>
        </Strip>
      )}

      {/* values */}
      <Values>
        <Grid>
          {[
            {
              icon: '🪵',
              title: 'Natural materials',
              txt: 'Solid oak, walnut & Italian leather.',
            },
            {
              icon: '🛠️',
              title: 'Craftsmanship',
              txt: 'Each piece hand‑finished in Lombardy.',
            },
            {
              icon: '♻️',
              title: 'Circular design',
              txt: 'Built to be repaired, reused and loved.',
            },
          ].map((v) => (
            <Card
              key={v.title}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 18px rgba(0,0,0,.08)',
              }}
            >
              <div style={{ fontSize: '2.2rem' }}>{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.txt}</p>
            </Card>
          ))}
        </Grid>
      </Values>

      {/* sentinel */}
      <div ref={sentryRef} />

      {/* lazy Newsletter */}
      <Suspense fallback={<></>}>{inView && <NewsletterSection />}</Suspense>
    </>
  );
}
