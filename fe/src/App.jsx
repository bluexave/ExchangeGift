import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { GroupForm } from './components/GroupForm/GroupForm'
import { MatchResults } from './components/MatchResults/MatchResults'
import { useGiftMatching } from './hooks/useGiftMatching'
import { checkHealth } from './services/api'
import './App.css'

function App() {
  const { loading, error, results, attempts, groups, performMatching, clearResults } = useGiftMatching()

  useEffect(() => {
    checkHealth()
      .then(() => {
        toast.success('Connected to API server')
      })
      .catch(() => {
        toast.error('Cannot connect to API server at http://localhost:3000')
      })
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleFormSubmit = async (groups, sendEmails) => {
    toast.loading('Creating matches...')
    await performMatching(groups, sendEmails)
    toast.dismiss()
    if (results && results.length > 0) {
      toast.success(`Successfully matched ${results.length} members!`)
    }
  }

  const handleReset = () => {
    clearResults()
    toast.success('Ready for new matches')
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      <header className="app-header">
        <div className="header-content">
          <h1>🎁 Gift Exchange Matcher</h1>
          <p>Match gift exchange partners across families</p>
        </div>
      </header>

      <main className="app-main">
        {!results ? (
          <GroupForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <MatchResults results={results} groups={groups} attempts={attempts} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        <p>Gift Exchange API v1.0</p>
      </footer>
    </div>
  )
}

export default App
