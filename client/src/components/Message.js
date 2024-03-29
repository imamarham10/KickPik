import React from 'react';
import { ReactComponent as Error } from '../resources/error.svg';

function ErrorMessage(props) {
  return (
    <div className={`alert alert-${props.variant || 'info'} `}>
      {props.children}
      <div>
        <Error className="error-icon max-sm:h-64 max-sm:w-64 max-sm:ml-10" />
      </div>
    </div>
  );
}
export default ErrorMessage;
