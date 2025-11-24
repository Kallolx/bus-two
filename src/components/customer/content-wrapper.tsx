'use client';

import { motion } from 'framer-motion';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className = '' }: ContentWrapperProps) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className={`bg-background rounded-t-[2rem] min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-y-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}
