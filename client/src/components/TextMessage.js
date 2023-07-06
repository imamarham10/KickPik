import React from 'react';

export default function TextMessage(props) {
  return (
    <div className={`alert alert-${props.variant || 'info'} text-lg font-nunito`}>
      {props.children}
    </div>
  );
}
