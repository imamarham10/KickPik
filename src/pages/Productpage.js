import React from 'react';
import { useParams } from 'react-router-dom';

export default function Productpage() {
  const params = useParams();
  const { name } = params;
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}
