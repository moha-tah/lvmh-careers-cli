import React from 'react';
import Logo from './Logo.js';

const ShowApp: React.FC = () => {
  return <Logo />;
};

export const showApp = (): React.ReactNode => <ShowApp />;
