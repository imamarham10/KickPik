import React from 'react';
import { Link } from 'react-router-dom';

export default function Socials() {
  return (
    <ul>
      <li>
        <Link
          to={'https://www.linkedin.com/in/arham-imam-100800/'}
          target="_blank"
        >
          <i className="fab fa-linkedin"></i>
        </Link>
      </li>
      <li>
        <Link to={'https://www.github.com/imamarham10/kickpik'} target="_blank">
          <i className="fab fa-github"></i>
        </Link>
      </li>
    </ul>
  );
}
