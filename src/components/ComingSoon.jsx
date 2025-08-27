import React from 'react';
import Card from './Card';
export default function ComingSoon({ title='Coming Soon', children }) {
  return (
    <div className="space-y-4">
      <Card title={title}>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This section is under construction.
        </p>
        {children}
      </Card>
    </div>
  );
}