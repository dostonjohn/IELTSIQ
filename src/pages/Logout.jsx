import React from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'

const Logout = () => (
  <Card title="Sign out">
    <p className="text-sm text-gray-600 dark:text-gray-300">You are currently signed in. Click below to sign out.</p>
    <div className="mt-3"><PrimaryButton disabled title="Coming soon">Sign out</PrimaryButton></div>
  </Card>
)

export default Logout
