import { Link } from 'react-router-dom';
import { useRef } from 'react';
import styled from 'styled-components';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string; // ✅ added category
}

interface Props {
  product: Product;
}

const Card = styled.div`
  perspective: 900px;
  border-radius: 16px;
  overflow: hidden;
`;

const Inner = styled.div`
  background: #fff;
  border-radius: inherit;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
`;

const Body = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Category = styled.div`
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #c9a14a;
`;

const Desc = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  flex: 1;
  margin: 0;
`;

const DetailLink = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #c9a14a;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  transition: background 0.25s ease;

  &:hover {
    background: #b48f3f;
  }
`;

export default function ProductCard({ product }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${ -y * 4 }deg) rotateY(${ x * 4 }deg)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'rotateX(0) rotateY(0)';
  };

  return (
    <Card onMouseMove={tilt} onMouseLeave={reset}>
      <Inner ref={ref}>
        <Link to={`/products/${product.id}`}>
          <Img src={product.imageUrl} alt={product.title} />
        </Link>
        <Body>
          <Category>{product.category}</Category>
          <Title>{product.title}</Title>
          <Price>€{product.price.toFixed(2)}</Price>
          <Desc>{product.description}</Desc>
          <DetailLink to={`/products/${product.id}`}>View details →</DetailLink>
        </Body>
      </Inner>
    </Card>
  );
}
