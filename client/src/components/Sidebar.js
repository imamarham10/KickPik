/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import { CategoryTwoTone } from '@mui/icons-material';
import { ArrowBackRounded } from '@mui/icons-material';

export default function () {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`bg-primary max-h-full pr-7 pl-3 pt-8 relative rounded-tr-full rounded-br-full sidebar ${
        open ? 'w-40' : 'w-14'
      } duration-1000 flex-col`}
    >
      <ArrowBackRounded
        className={`bg-amber text-primary w-9 h-9 rounded-full  absolute -right-3 top-40 cursor-pointer ${
          !open && 'rotate-180'
        } duration-1000`}
        onClick={() => setOpen(!open)}
      />
      <div className="inline-flex mt-16">
        <CategoryTwoTone
          className={`text-amber text-2xl mr-2 float-left block -left-3`}
        />
        <h1
          className={`text-white text-lg mr-5 font-primary ${
            !open && 'scale-0'
          } duration-1000 origin-left font-normal`}
        >
          Categories
        </h1>
      </div>
    </div>
  );
}
