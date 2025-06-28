/*  src/pages/AboutPage.tsx
    Casa Neuvo · About
    — hero banner · story · values · atelier collage · CTA
---------------------------------------------------------------- */

import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

/* ---------- tokens ---------- */
const ACCENT = '#0071e3';
const TXT    = '#111';
const SUBTXT = '#565656';
const GLASS  = css`
  background: rgba(255,255,255,.67);
  backdrop-filter: blur(8px);
`;

/* ---------- shells ---------- */
const Page = styled.main`
  max-width: 1280px;
  margin-inline: auto;
  padding: clamp(2.5rem, 6vw, 4rem) 1.4rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
`;

/* ---------- hero ---------- */
const Hero = styled.header`
  position: relative;
  height: clamp(240px, 45vw, 380px);
  border-radius: 18px;
  overflow: hidden;

  &:before {                 /* overlay tint */
    content:'';
    position:absolute;inset:0;
    background:linear-gradient(
       rgba(255,255,255,.75) 0%,
       rgba(255,255,255,.45) 60%,
       rgba(255,255,255,.25) 100%);
    backdrop-filter: blur(4px);
  }

  img {
    position:absolute;inset:0;
    width:100%;height:100%;
    object-fit:cover;
  }
`;
const HeroText = styled(motion.div)`
  ${GLASS};
  position: absolute;
  left: 50%;
  bottom: 1.6rem;
  transform: translateX(-50%);
  padding: .95rem 1.6rem;
  border-radius: 12px;
  font-size: clamp(1.4rem, 2vw + .65rem, 2rem);
  font-weight: 700;
  color: ${TXT};
`;

/* ---------- sections ---------- */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;
const Title = styled.h2`
  font-size: clamp(1.8rem, 1.4vw + 1.2rem, 2.3rem);
  font-weight: 700;
  color: ${ACCENT};
`;
const Text = styled.p`
  font-size: clamp(1rem, .25vw + .9rem, 1.1rem);
  line-height: 1.8;
  color: ${SUBTXT};
`;

/* ---------- values grid ---------- */
const ValuesGrid = styled.div`
  display:grid;
  gap: 1.7rem;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
`;
const ValueCard = styled(motion.div)`
  ${GLASS};
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 1.6rem 1.4rem;
  backdrop-filter: blur(8px);

  h3 { margin-bottom: .55rem; font-size: 1.05rem; }
  p  { font-size: .92rem; line-height: 1.55; color:${SUBTXT}; }
`;

/* ---------- atelier collage ---------- */
const Collage = styled.div`
  display:grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));

  img{
    width:100%;height:200px;object-fit:cover;border-radius:14px;
    transition: transform .35s ease;
  }
  img:hover{ transform: scale(1.05);}
`;

/* ---------- CTA ---------- */
const CTA = styled(Link)`
  align-self: center;
  margin-top: 1rem;
  background: ${ACCENT};
  color:#fff;
  padding: 1rem 3.2rem;
  border-radius: 32px;
  font-weight:600;
  font-size: 1.15rem;
  transition: transform .25s, box-shadow .25s;

  &:hover{
    transform: translateY(-3px);
    box-shadow:0 10px 22px rgb(0 0 0 /.15);
  }
  @media(max-width:480px){
    width:100%;text-align:center;
  }
`;

/* ---------- page ---------- */
export default function AboutPage() {
  return (
    <Page>

      {/* hero */}
      <Hero>
        <img
          src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=2100&q=80"
          alt="Casa Neuvo atelier"
          loading="lazy"
        />
        <HeroText
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.8 }}
        >
          Timeless design — Italian heart
        </HeroText>
      </Hero>

      {/* story */}
      <Section>
        <Title>Our story</Title>
        <Text>
          Casa Neuvo is more than a furniture label&mdash;it’s a philosophy.
          Born in the ateliers of Lombardy, we marry
          traditional joinery with 21‑century engineering to craft pieces
          that live for generations, not seasons.
        </Text>
      </Section>

      {/* values */}
      <Section>
        <Title>What we stand for</Title>

        <ValuesGrid>
          {[
            {icon:'🌱', title:'Sustainability',
              txt:'Responsibly‑harvested wood & plastic‑free packaging.'},
            {icon:'🎨', title:'Design Excellence',
              txt:'Minimal lines, honest materials, human scale.'},
            {icon:'🛠️', title:'Craftsmanship',
              txt:'Hand‑finished by artisans with decades of know‑how.'},
          ].map(v=>(
            <ValueCard
              key={v.title}
              whileHover={{ y:-6, boxShadow:'0 8px 18px rgba(0,0,0,.08)' }}
              transition={{ type:'spring',stiffness:260,damping:22 }}
            >
              <h3>{v.icon} {v.title}</h3>
              <p>{v.txt}</p>
            </ValueCard>
          ))}
        </ValuesGrid>
      </Section>

      {/* atelier images */}
      <Section>
        <Title>Inside our atelier</Title>
        <Collage>
          {[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
            'https://images.unsplash.com/photo-1470093851219-69951fcbb533',
            'https://unsplash.com/photos/vbxyFxlgpjM/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzUxMTE3MjY1fA&force=true',
          ].map((src,i)=>(
            <img key={i} src={`${src}?auto=format&fit=crop&w=800&q=70`} loading="lazy"
                 alt="Casa Neuvo workshop"/>
          ))}
        </Collage>
      </Section>

      {/* call‑to‑action */}
      <CTA to="/products">
        Discover the collection
      </CTA>
    </Page>
  );
}
