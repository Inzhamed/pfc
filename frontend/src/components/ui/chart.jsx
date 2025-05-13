// Dans chart.jsx

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const sampleData = [
  { name: 'Jan', défauts: 3 },
  { name: 'Fév', défauts: 2 },
  { name: 'Mars', défauts: 5 },
  { name: 'Avr', défauts: 1 },
];

// Définir ChartContainer
export const ChartContainer = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={sampleData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="défauts" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// Définir ChartTooltip
export const ChartTooltip = (props) => (
  <Tooltip {...props} />
);

// Définir ChartTooltipContent
export const ChartTooltipContent = () => (
  <div>
    {/* Contenu personnalisé pour le tooltip */}
    <p>Contenu du tooltip personnalisé</p>
  </div>
);
