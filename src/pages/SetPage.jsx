import React from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'

const SetPage = () => {
  const { slug } = useParams();
  return (
    <Card title={`Set: ${slug}`}>
      <p className="text-sm text-gray-600 dark:text-gray-300">This set is coming soon.</p>
    </Card>
  )
}

export default SetPage
