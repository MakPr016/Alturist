import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const BountyPage = () => {
  const { id } = useParams()
  const [bounty, setBounty] = useState(null)
  const [completions, setCompletions] = useState([])

  useEffect(() => {
    const load = async () => {
      const b = await fetch(`http://localhost:3000/api/bounties/${id}`).then(r => r.json())
      const c = await fetch(`http://localhost:3000/api/bounties/${id}/completions`).then(r => r.json())
      setBounty(b)
      setCompletions(c)
    }
    load()
  }, [id])

  if (!bounty) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold">{bounty.bounty_name}</h1>
      <p className="mt-2 text-gray-600">{bounty.bounty_requirements}</p>
      <h2 className="mt-6 text-xl font-semibold">Completed PRs</h2>
      <ul className="mt-2">
        {completions.map(c => (
          <li key={c.id} className="border p-2 rounded">
            <a href={c.pr_url} target="_blank" rel="noreferrer">PR #{c.pr_number}</a> by {c.username}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BountyPage
