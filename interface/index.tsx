import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { StrictMode } from 'react';
import { Window } from './src/Window';

ReactDOM.render(
  <StrictMode>
    <Window />
  </StrictMode>,
  document.getElementById('interface')
);
