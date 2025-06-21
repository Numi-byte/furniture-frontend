import { useState } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-left: 4px solid #0071e3;
  border-radius: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const Cost = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Note = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

// Example VAT + base shipping for 5kg package from India
const countryData: Record<string, { vat: number; shipping: number }> = {
  'Germany': { vat: 19, shipping: 32 },
  'France': { vat: 20, shipping: 34 },
  'Italy': { vat: 22, shipping: 30 },
  'Spain': { vat: 21, shipping: 35 },
  'Netherlands': { vat: 21, shipping: 33 },
  'Belgium': { vat: 21, shipping: 33 },
  'Poland': { vat: 23, shipping: 38 },
  'Sweden': { vat: 25, shipping: 40 },
  'Austria': { vat: 20, shipping: 31 },
  'Denmark': { vat: 25, shipping: 42 },
  'United Kingdom': { vat: 20, shipping: 36 },
  'Ireland': { vat: 23, shipping: 35 },
  'Scotland': { vat: 20, shipping: 36 },
  'Wales': { vat: 20, shipping: 36 },
  'United States': { vat: 0, shipping: 45 },
  'Canada': { vat: 5, shipping: 48 },
  'Australia': { vat: 10, shipping: 50 },
  'Japan': { vat: 10, shipping: 42 },
  'United Arab Emirates': { vat: 5, shipping: 40 },
  'Saudi Arabia': { vat: 15, shipping: 40 },
  'Qatar': { vat: 5, shipping: 40 },
  'Kuwait': { vat: 5, shipping: 40 },
  'Bahrain': { vat: 5, shipping: 40 },
  'Oman': { vat: 5, shipping: 40 },
  'Other': { vat: 0, shipping: 60 }
};

const countries = Object.keys(countryData);

export default function AdvancedShippingCalculator() {
  const [selected, setSelected] = useState('Germany');

  const { vat, shipping } = countryData[selected] || countryData['Other'];
  const vatAmount = (shipping * vat) / 100;
  const total = shipping + vatAmount;

  return (
    <Box>
      <Label htmlFor="country">Select destination country:</Label>
      <Select
        id="country"
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        {countries.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Cost>
        Base Shipping (5kg): <strong>€{shipping.toFixed(2)}</strong>
      </Cost>
      <Cost>
        VAT ({vat}%): <strong>€{vatAmount.toFixed(2)}</strong>
      </Cost>
      <Cost>
        <span style={{ color: '#0071e3' }}>Estimated Total:</span>{' '}
        <strong>€{total.toFixed(2)}</strong>
      </Cost>

      <Note>
        * These are rough estimates. Exact cost (incl. import duties, additional shipping fees)
        will be confirmed by our support team after your order is placed.
      </Note>
      <Note>
         Final rates depend on your specific address and total package weight.
      </Note>
    </Box>
  );
}
