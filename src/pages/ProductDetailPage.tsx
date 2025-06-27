import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import ShippingCalculator from '../components/ShippingCalculator';
import { API_BASE } from '../api';

const Page = styled.div`
  padding: 4rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageBox = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
`;

const Image = styled.img`
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const Category = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
`;

const Stock = styled.p<{ inStock: boolean }>`
  color: ${p => p.inStock ? '#28a745' : '#dc3545'};
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #111;
  color: #fff;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }

  &:disabled {
    background: #888;
    cursor: not-allowed;
  }
`;

const Notice = styled.div`
  background: #f9f9f9;
  border-left: 4px solid #0071e3;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: #444;
  margin-top: 3rem;
  border-radius: 8px;
  line-height: 1.6;
`;

interface Prod {
  id: number;
  title: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  weightKg: number;
  category: string;  // 🆕 Added category
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [prod, set] = useState<Prod | null>(null);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

useEffect(() => {
  fetch(`${API_BASE}/products/${id}`)
    .then(r => {
      if (!r.ok) throw new Error('Error loading product');
      return r.json();
    })
    .then(data => {
      set(data);
      setLoading(false);
    })
    .catch(() => {
      toast.error('Error loading product');
      setLoading(false);
    });
}, [id]);

  if (loading) {
    return <Page><p>Loading…</p></Page>;
  }

  if (!prod) {
    return <Page><p>Product not found.</p></Page>;
  }

  const addCart = () => {
    add({ id: prod.id, title: prod.title, price: prod.price, imageUrl: prod.imageUrl });
    toast.success('Added to cart');
  };

  return (
    <Page>
      <Hero>
        <ImageBox>
          <Image src={prod.imageUrl} alt={prod.title} />
        </ImageBox>
        <InfoBox>
          <Title>{prod.title}</Title>
          <Category>Category: {prod.category}</Category> {/* 🆕 Show category */}
          <Price>€{prod.price.toFixed(2)}</Price>
          <Stock inStock={prod.stock > 0}>
            {prod.stock > 0 ? `In stock: ${prod.stock}` : 'Out of stock'}
          </Stock>

          <Description>{prod.description}</Description>
          <Button onClick={addCart} disabled={prod.stock === 0}>
            {prod.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </InfoBox>
      </Hero>
      <ShippingCalculator />
      <Notice>
        <strong>Important information for EU customers:</strong>
        <ul style={{ marginTop: '0.8rem', paddingLeft: '1.2rem' }}>
          <li>All prices shown exclude shipping costs.</li>
          <li>Depending on your delivery country, import duties or local taxes may apply at delivery.</li>
          <li>We comply with EU consumer protection rules, including your right to withdrawal within 14 days.</li>
          <li>Shipping costs are calculated at checkout based on destination.</li>
        </ul>
        <p style={{ marginTop: '0.8rem' }}>
          For more details, please review our <a href="/terms" style={{ color: '#0071e3' }}>Terms & Conditions</a> and <a href="/shipping" style={{ color: '#0071e3' }}>Shipping Policy</a>.
        </p>
      </Notice>
    </Page>
  );
}
