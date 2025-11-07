import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ReactNode } from 'react';

export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);

export { m };
