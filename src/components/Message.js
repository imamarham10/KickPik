import React from 'react';
import { ReactComponent as Error } from '../resources/error.svg';

function ErrorMessage(props) {
  return (
    <div className={`alert alert-${props.variant || 'info'}`}>
      {props.children}
      <div>
        <Error className="error-icon" />
      </div>
    </div>
  );
}
export default ErrorMessage;
