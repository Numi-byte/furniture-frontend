// src/components/NewsletterSection.tsx

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import toast from 'react-hot-toast';
import { API_BASE } from '../api';

const ACCENT = '#0071e3';
const CHAR   = '#111';
const spin = keyframes`to{transform:rotate(360deg)}`;

const Section = styled.section`
  background: #fff;
  padding: 4.5rem 1.2rem;
  text-align: center;
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  max-width: 440px;
  margin-inline: auto;

  input {
    flex: 1;
    padding: 1rem;
    font-size: .95rem;
    border: 1px solid #ccc;
    border-right: none;
    border-radius: 14px 0 0 14px;

    &:disabled {
      background: #f0f0f0;
    }
  }

  button {
    width: 140px;
    padding: 1rem;
    border: none;
    border-radius: 0 14px 14px 0;
    background: ${ACCENT};
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;

    &:disabled {
      opacity: .6;
      cursor: default;
    }
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} .9s linear infinite;
`;

export default function NewsletterSection() {
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value.trim();
    if (!email) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('Subscribed ✓  Check your inbox!');
        emailInput.value = '';
      } else if (res.status === 409 || res.status === 400) {
        const { message } = await res.json();
        toast.error(message || 'Already subscribed');
      } else {
        toast.error('Subscription failed');
      }
    } catch {
      toast.error('Network error – try later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <h2 style={{ fontSize: '1.9rem', fontWeight: 600, color: CHAR }}>
        Stay inspired.
      </h2>
      <p style={{ color: '#4b4b4b', marginTop: '.6rem' }}>
        Monthly stories – never spam.
      </p>

      <Form onSubmit={subscribe}>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Subscribe'}
        </button>
      </Form>
    </Section>
  );
}
