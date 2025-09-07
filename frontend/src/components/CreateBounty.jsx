import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

const CreateBounty = () => {
  const [searchParams] = useSearchParams()
  const bountyId = searchParams.get('bountyId')
  const { getToken } = useAuth()
  const [form, setForm] = useState({ bountyName: '', bountyRequirements: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = await getToken()
    await fetch(`http://localhost:3000/api/bounties/${bountyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    window.location.href = `/bounty/${bountyId}`
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <input
        type="text"
        value={form.bountyName}
        onChange={(e) => setForm({ ...form, bountyName: e.target.value })}
        placeholder="Bounty Name"
        className="w-full p-2 border rounded"
      />
      <textarea
        value={form.bountyRequirements}
        onChange={(e) => setForm({ ...form, bountyRequirements: e.target.value })}
        placeholder="Bounty Requirements"
        className="w-full p-2 border rounded"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
    </form>
  )
}

export default CreateBounty
