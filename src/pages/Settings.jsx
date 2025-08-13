import React, { useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'

const Toggle = ({ label, checked, onChange, desc }) => (
  <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10">
    <input type="checkbox" className="mt-1 accent-indigo-600" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div>
      <div className="font-medium">{label}</div>
      {desc && <div className="text-sm text-gray-500">{desc}</div>}
    </div>
  </label>
)

const Settings = () => {
  const [dark, setDark] = useState(true);
  const [emails, setEmails] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <Card title="Account settings">
      <div className="grid gap-3">
        <Toggle label="Dark theme" checked={dark} onChange={setDark} desc="Use darker colors to reduce eye strain." />
        <Toggle label="Email notifications" checked={emails} onChange={setEmails} desc="Get reminders about streaks and new sets." />
        <Toggle label="Public profile" checked={publicProfile} onChange={setPublicProfile} desc="Let friends find you on leaderboards." />
      </div>
      <div className="mt-4 flex gap-2">
        <PrimaryButton as="button">Save changes</PrimaryButton>
        <PrimaryButton as="button" style={{"--btn-bg":"#111827"}}>Cancel</PrimaryButton>
      </div>
    </Card>
  )
}

export default Settings
