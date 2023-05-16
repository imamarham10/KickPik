import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox () {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const submitHandler = (e) => {
      e.preventDefault();
      navigate(query ? `/search/?query=${query}` : '/search');
    }
  return (
    <div>
        <form onSubmit={submitHandler}>
            <div className="flex bg-background shadow-black py-1 rounded-3xl ml-3 border border-primary px-3 flex-wrap" >
                    <input className="w-72 font-nunito bg-background max-sm:w-24 max-sm:text-sm max-sm:px-1 font-normal text-lg focus:outline-none " placeholder='Search' 
                    onChange={(e)=>setQuery(e.target.value)}/>
                    <button className="text-lg" type="submit"><SearchIcon className="text-primary text-3xl"/></button>
            </div>
        </form>
    </div>
    )
}
