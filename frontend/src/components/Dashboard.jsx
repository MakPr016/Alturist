import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

const Dashboard = () => {
  const { getToken, isSignedIn } = useAuth()
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isSignedIn) fetchRepositories()
  }, [isSignedIn])

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const res = await fetch('http://localhost:3000/api/repositories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setRepositories(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createWebhook = async (repo) => {
    const token = await getToken()
    const res = await fetch('http://localhost:3000/api/create-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ repo })
    })
    const data = await res.json()
    if (res.ok) window.location.href = `/create-bounty?bountyId=${data.bountyId}`
    else alert(data.error)
  }

  if (loading) return <div>Loading repositories...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map(repo => (
        <Card key={repo.id}>
          <CardHeader>
            <CardTitle>{repo.name}</CardTitle>
            <CardDescription>{repo.description || 'No description'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-4">
              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 📝 {repo.language}
            </div>
            <Button onClick={() => createWebhook(repo.full_name)}>Create Webhook</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Dashboard
