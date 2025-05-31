'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import bootstrap JS only on the client
    import('bootstrap/dist/js/bootstrap.bundle.min')
      .then(() => {
        console.log('✅ Bootstrap JS loaded');
      })
      .catch(err => {
        console.error('Failed to load bootstrap JS', err);
      });
  }, []);

  return null;
}
