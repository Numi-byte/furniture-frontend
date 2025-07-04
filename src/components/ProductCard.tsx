
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import styled from 'styled-components';

/* —— types —— */
interface Product {
  id:        number;
  title:     string;
  price:     number;
  description: string;
  imageUrl:  string;
  category:  string;
}
interface Props { product: Product }

/* —— styling tokens —— */
const gold     = '#c9a14a';
const accent   = '#0071e3';
const txtMain  = '#222';
const txtSub   = '#666';
const bgCard   = '#fff';

/* —— card shell —— */
const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${bgCard};
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow .25s, transform .25s;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);

  &:hover {
    box-shadow: 0 8px 22px rgba(0,0,0,.12);
    transform: translateY(-2px);
  }
`;

/* —— image —— */
const ImgWrap = styled(Link)`
  display: block;
  aspect-ratio: 3/2;
  background: #fafafa;        /* subtle placeholder bg */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity .35s;
  }

  ${Card}:hover & img { opacity: .92; }
`;

/* —— body —— */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.2rem 1.4rem;
  gap: .55rem;
  flex: 1;
`;

/* —— text bits —— */
const Cat  = styled.span`
  font-size: .72rem;
  color: ${txtSub};
  letter-spacing: .05em;
  text-transform: uppercase;
`;
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${txtMain};
  line-height: 1.35;
  min-height: 2.7em;          /* 2 lines reserve */
  overflow: hidden;           /* clamp effect */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const Price = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${gold};
`;
const Blurb = styled.p`
  font-size: .85rem;
  color: ${txtSub};
  line-height: 1.45;
  max-height: 2.9em;          /* ~2 lines */
  overflow: hidden;
  margin: .3rem 0 0;
`;

/* —— CTA —— */
const BuyLink = styled(Link)`
  margin-top: auto;           /* sticks to bottom */
  align-self: flex-start;
  padding: .55rem 1.1rem;
  background: ${accent};
  color: #fff;
  border-radius: 6px;
  font-size: .83rem;
  font-weight: 600;
  transition: background .25s, transform .25s;

  &:hover { background: #055dc4; }
  &:active { transform: scale(.96); }
`;

/* —— tilt on desktop only —— */
const Wrapper = styled.div`
  perspective: 800px;

  @media (max-width: 900px) {
    perspective: none;         /* disables tilt on touch devices */
  }
`;

/* ========================================================= */
export default function ProductCard({ product }: Props) {
  const inner = useRef<HTMLDivElement>(null);

  /* gentle tilt */
  const tilt = (e: React.MouseEvent) => {
    const el = inner.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  };
  const reset = () => inner.current && (inner.current.style.transform = '');

  return (
    <Wrapper onMouseMove={tilt} onMouseLeave={reset}>
      <Card ref={inner}>
        <ImgWrap to={`/products/${product.id}`}>
          <img src={product.imageUrl} alt={product.title} loading="lazy" />
        </ImgWrap>

        <Body>
          <Cat>{product.category}</Cat>
          <Title>{product.title}</Title>
          <Price>€{product.price.toFixed(2)}</Price>
          <Blurb>{product.description}</Blurb>

          <BuyLink to={`/products/${product.id}`}>View&nbsp;details</BuyLink>
        </Body>
      </Card>
    </Wrapper>
  );
}
