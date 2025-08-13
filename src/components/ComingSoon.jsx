import React from 'react';
import Card from './Card';

export default function ComingSoon({ title = 'Coming soon', children }) {
  return (
    <Card title={title}>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {children || 'This mode is under construction. Check back soon!'}
      </div>
    </Card>
  );
}