import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SearchPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const searchParam = new URLSearchParams(search); //search?category:shoes
    const category = searchParam.get('category') || 'all';
    const query = searchParam.get('query') || 'all';
    const price = searchParam.get('price') || 'all';
    const rating = searchParam.get('rating') || 'all';
    const order = searchParam.get('order') || 'newest';
    const page = searchParam.get('page') || '1';
    

  return (
    <div>SearchPage</div>
  )
}
