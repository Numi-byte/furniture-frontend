/*  src/pages/HomePage.tsx
    Casa Neuvo · adaptive landing
    – hero · marquee · value‐props · lazy newsletter
------------------------------------------------------------------ */

import {
  useEffect,
  useState,
  Suspense,
  lazy,
} from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled, { keyframes } from 'styled-components';
import { API_BASE } from '../api';
import { toast } from 'react-toastify';

/* ------------ design tokens ------------ */
const ACCENT = '#0071e3';
const TXT    = '#111';
const SUB    = '#4b4b4b';
const BG     = '#f5f5f7';

/* =============== HERO =============== */
const Hero = styled.section`
  min-height: 92vh;
  display: grid;
  place-items: center;
  text-align: center;
  background:
    /*  ✨ darken on small screens so white text still pops  */
    linear-gradient(
      rgba(255,255,255,.78) 0%,
      rgba(255,255,255,.68) 35%,
      rgba(255,255,255,.45) 75%,
      rgba(255,255,255,.30) 100%
    ),
    url('https://unsplash.com/photos/XpbtQfr9Skg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8SG9tZSUyMGRlY29yfGVufDB8fHx8MTc1MTEwOTg2NXww&force=true')
      center/cover no-repeat;

  @media (max-width: 600px) {
    background-position: 60% center;
  }
`;

const HeroInner = styled(motion.div)`
  max-width: 820px;
  padding: 0 1.4rem;
`;

const Heading = styled.h1`
  font-size: clamp(2.3rem, 5vw + 0.5rem, 4rem);
  line-height: 1.08;
  color: ${TXT};

  /* tighten tracking on very big headings */
  @media (min-width: 1440px) { letter-spacing: -1px; }
`;

const Lead = styled.p`
  font-size: clamp(1rem, 1.1vw + .6rem, 1.2rem);
  color: ${SUB};
  max-width: 640px;
  margin: 1.4rem auto 0;
`;

const CTA = styled(Link)`
  display: inline-block;
  margin-top: 2.6rem;
  padding: .95rem 2.6rem;
  border-radius: 28px;
  font-weight: 600;
  color: #fff;
  background: ${ACCENT};
  transition: transform .25s, box-shadow .25s;

  &:hover {
    transform: translateY(-2px) scale(1.045);
    box-shadow: 0 10px 24px rgb(0 0 0 /.15);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
`;

/* =============== MARQUEE =============== */
const slide = keyframes`to { transform: translateX(-50%); }`;

const Strip = styled.section`
  overflow: hidden;
  background: #fff;
  padding: 2.8rem 0;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);

  &:hover div { animation-play-state: paused; }
`;

const Track = styled.div`
  display: inline-flex;
  animation: ${slide} 34s linear infinite;
`;

const Tile = styled.figure`
  width: 300px;
  margin: 0 1.8rem;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e5e5;
  transition: transform .3s, box-shadow .3s;

  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
  }

  figcaption {
    padding: .9rem 1rem 1.2rem;
    font-size: .97rem;
    color: ${TXT};
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 18px rgba(0,0,0,.08);
  }
`;

/* =============== VALUES =============== */
const Values = styled.section`
  background: ${BG};
  padding: clamp(3.5rem, 7vw, 6rem) 1.2rem;
`;

const Grid = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 2.4rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const Card = styled(motion.div)`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  padding: 2.4rem 2rem;
  text-align: center;

  h3 {
    margin: 1rem 0 .75rem;
    color: ${TXT};
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    color: ${SUB};
    font-size: .95rem;
    line-height: 1.55;
  }
`;

/* =============== Newsletter (lazy) =============== */
const NewsletterSection = lazy(() => import('../components/NewsletterSection'));

/* =============== Page component =============== */
export default function HomePage() {
  const [products, setProducts] = useState<
    { id: number; title: string; imageUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, []);

  /* lazy‐load newsletter when near viewport */
  const { ref: sentryRef, inView } = useInView({ rootMargin: '400px' });

  return (
    <>
      {/* HERO */}
      <Hero>
        <HeroInner
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <Heading>
            Furniture crafted for<br />
            quiet&nbsp;beauty
          </Heading>
          <Lead>
            Discover timeless pieces engineered&nbsp;for&nbsp;modern&nbsp;living.
          </Lead>

          <CTA to="/products">Explore collection</CTA>
        </HeroInner>
      </Hero>

      {/* MARQUEE */}
      {loading ? null : products.length > 0 && (
        <Strip aria-label="Trending products">
          <Track>
            {[...products, ...products].map(p => (
              <Tile key={p.id + Math.random()}>
                <img src={p.imageUrl} alt={p.title} loading="lazy" />
                <figcaption>{p.title}</figcaption>
              </Tile>
            ))}
          </Track>
        </Strip>
      )}

      {/* VALUES */}
      <Values>
        <Grid>
          {[
            { icon:'🪵', title:'Natural materials',
              txt:'Solid oak, walnut & Italian leather.'},
            { icon:'🛠️', title:'Craftsmanship',
              txt:'Each piece hand‑finished in Lombardy.'},
            { icon:'♻️', title:'Circular design',
              txt:'Built to be repaired, reused and loved.'},
          ].map(v => (
            <Card
              key={v.title}
              whileHover={{ y: -6, boxShadow: '0 12px 22px rgba(0,0,0,.06)' }}
              transition={{ type:'spring', stiffness:260, damping:22 }}
            >
              <div style={{ fontSize:'2.35rem' }}>{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.txt}</p>
            </Card>
          ))}
        </Grid>
      </Values>

      {/* sentinel for lazy newsletter */}
      <div ref={sentryRef} />

      {/* NEWSLETTER (lazy) */}
      <Suspense fallback={null}>
        {inView && <NewsletterSection />}
      </Suspense>
    </>
  );
}
