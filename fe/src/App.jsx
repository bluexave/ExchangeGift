import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { HeaderBar } from './components/HeaderBar/HeaderBar'
import { Worktable } from './components/Worktable/Worktable'
import { MatchResults } from './components/MatchResults/MatchResults'
import { useGiftMatching } from './hooks/useGiftMatching'
import { checkHealth, saveGroups, loadGroups, listGroupFiles, draftPickOrder, draftMembers } from './services/api'
import './App.css'

function App() {
  const { loading, error, results, attempts, performMatching, clearResults } = useGiftMatching()
  const [groups, setGroups] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveFilename, setSaveFilename] = useState('my-groups')
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [savedFiles, setSavedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState('')
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [activeWorklineIdx, setActiveWorklineIdx] = useState(null)
  const [currentFilename, setCurrentFilename] = useState(null)

  const getMemberCount = (group) => {
    return group.members.filter(m => {
      const name = typeof m === 'string' ? m : m.name || '';
      return name.trim();
    }).length;
  };

  const getValidGroups = () => {
    return groups.filter(g => g.name.trim() && g.email.trim());
  };

  const totalMembers = groups.reduce((sum, g) => sum + getMemberCount(g), 0);
  const isFormValid = groups.length >= 3 && totalMembers >= 10 && getValidGroups().length === groups.length;

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

  const fetchSavedFiles = async () => {
    setLoadingFiles(true)
    try {
      const files = await listGroupFiles()
      setSavedFiles(files)
      if (files.length > 0) {
        setSelectedFile(files[0])
      }
    } catch (error) {
      toast.error('Failed to load file list')
    } finally {
      setLoadingFiles(false)
    }
  }

  useEffect(() => {
    if (showLoadDialog) {
      fetchSavedFiles()
    }
  }, [showLoadDialog])

  useEffect(() => {
    if (showSaveDialog && currentFilename) {
      setSaveFilename(currentFilename)
    }
  }, [showSaveDialog, currentFilename])

  const handleAddGroup = () => {
    const newGroup = { name: '', members: [], email: '', isPickAtLeastOnePerGroup: false };
    setGroups([...groups, newGroup]);
  };

  const handleRemoveGroup = (idx) => {
    setGroups(groups.filter((_, i) => i !== idx));
  };

  const handleSaveGroups = async () => {
    if (!saveFilename.trim()) {
      toast.error('Please enter a filename')
      return
    }

    try {
      // Remove .json extension if present before sending to API
      const filenameWithoutJson = saveFilename.endsWith('.json') 
        ? saveFilename.slice(0, -5) 
        : saveFilename
      
      const result = await saveGroups(groups, filenameWithoutJson)
      toast.success(result.message)
      setCurrentFilename(result.filename || filenameWithoutJson)
      setShowSaveDialog(false)
      setSaveFilename(result.filename || filenameWithoutJson)
    } catch (error) {
      toast.error(error.error || 'Failed to save groups')
    }
  }

  const handleLoadGroups = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to load')
      return
    }

    try {
      const loadedData = await loadGroups(selectedFile)
      setGroups(loadedData.groups)
      // Store filename without .json extension for future saves
      const filenameWithoutJson = selectedFile.endsWith('.json') 
        ? selectedFile.slice(0, -5) 
        : selectedFile
      setCurrentFilename(filenameWithoutJson)
      setSaveFilename(filenameWithoutJson)
      toast.success(`Loaded configuration: ${selectedFile}`)
      setShowLoadDialog(false)
    } catch (error) {
      toast.error(error.error || 'Failed to load groups')
    }
  }

  const handleFormSubmit = async (groupsData, sendEmails) => {
    toast.loading('Creating matches...')
    await performMatching(groupsData, sendEmails)
    toast.dismiss()
    if (results && results.length > 0) {
      toast.success(`Successfully matched ${results.length} members!`)
    }
  }

  const handlePickOrderDraft = async () => {
    if (!isFormValid) {
      toast.error('Please complete all group information first')
      return
    }

    toast.loading('Drafting pick order...')
    try {
      // Create a fresh version of groups with member objects (indices set to null)
      const groupsForDraft = groups.map(group => ({
        ...group,
        members: group.members.map(m => {
          const name = typeof m === 'string' ? m : m.name;
          return { name, index: null }; // Always pass objects with index reset to null
        })
      }));
      
      const result = await draftPickOrder(groupsForDraft)
      
      // Update groups with the returned indices
      if (result.groups) {
        const updatedGroups = result.groups.map((group, idx) => ({
          ...groups[idx],
          members: group.members.map((member) => ({
            name: member.name,
            index: member.index
          }))
        }))
        setGroups(updatedGroups)
        toast.dismiss()
        toast.success('Pick order drafted successfully!')
      }
    } catch (error) {
      toast.dismiss()
      toast.error(error.error || 'Failed to draft pick order')
    }
  }

  const handleSantaBabyDraft = async () => {
    if (!isFormValid) {
      toast.error('Please complete all group information first')
      return
    }

    toast.loading('Creating matches...')
    try {
      // Convert groups to JSON format with member objects (name and index)
      const groupsForApi = groups.map(group => ({
        ...group,
        members: group.members.map(m => {
          // Always pass as object with name and index properties
          const name = typeof m === 'string' ? m : m.name;
          const index = typeof m === 'string' ? null : (m.index || null);
          return { name, index };
        })
      }));
      
      const result = await draftMembers(groupsForApi, true)
      
      toast.dismiss()
      toast.success(result.message || 'Matches created successfully!')
    } catch (error) {
      toast.dismiss()
      toast.error(error.error || 'Failed to create matches')
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
          <>
            <HeaderBar 
              groupCount={groups.length}
              totalMembers={totalMembers}
              isValid={isFormValid}
              onAddGroup={handleAddGroup}
              onSave={() => setShowSaveDialog(true)}
              onLoad={() => setShowLoadDialog(true)}
              onPickOrderDraft={handlePickOrderDraft}
              onSantaBabyDraft={handleSantaBabyDraft}
              loading={loading}
            />

            <Worktable 
              groups={groups}
              onNameChange={(idx, value) => {
                const updated = [...groups];
                updated[idx].name = value;
                setGroups(updated);
              }}
              onEmailChange={(idx, value) => {
                const updated = [...groups];
                updated[idx].email = value;
                setGroups(updated);
              }}
              onMemberAdd={(idx) => {
                const updated = [...groups];
                updated[idx].members.push('');
                setGroups(updated);
              }}
              onMemberRemove={(groupIdx, memberIdx) => {
                const updated = [...groups];
                updated[groupIdx].members = updated[groupIdx].members.filter((_, i) => i !== memberIdx);
                setGroups(updated);
              }}
              onMemberChange={(groupIdx, memberIdx, value) => {
                const updated = [...groups];
                updated[groupIdx].members[memberIdx] = value;
                setGroups(updated);
              }}
              onTogglePick={(idx) => {
                const updated = [...groups];
                updated[idx].isPickAtLeastOnePerGroup = !updated[idx].isPickAtLeastOnePerGroup;
                setGroups(updated);
              }}
              onRemove={(idx) => {
                setGroups(groups.filter((_, i) => i !== idx));
              }}
            />

          </>
        ) : (
          <MatchResults results={results} groups={groups} attempts={attempts} onReset={handleReset} />
        )}
      </main>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="modal-overlay">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Save Group Configuration</h3>
              <button 
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="btn-close-modal"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Enter a name for this group configuration:</p>
              <input
                type="text"
                value={saveFilename}
                onChange={(e) => setSaveFilename(e.target.value)}
                placeholder="e.g., holiday-2025"
                className="modal-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveGroups()
                  }
                }}
              />
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveGroups}
                className="btn-modal-save"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="modal-overlay">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Load Group Configuration</h3>
              <button 
                type="button"
                onClick={() => setShowLoadDialog(false)}
                className="btn-close-modal"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {loadingFiles ? (
                <p className="loading-text">Loading saved configurations...</p>
              ) : savedFiles.length === 0 ? (
                <p className="empty-files-text">No saved configurations found</p>
              ) : (
                <>
                  <p>Select a configuration to load:</p>
                  <div className="files-list">
                    {savedFiles.map((file) => (
                      <label key={file} className="file-option">
                        <input 
                          type="radio" 
                          name="savedFile" 
                          value={file} 
                          checked={selectedFile === file}
                          onChange={(e) => setSelectedFile(e.target.value)}
                          className="file-radio"
                        />
                        <span className="file-name">{file}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            {!loadingFiles && savedFiles.length > 0 && (
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => setShowLoadDialog(false)}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleLoadGroups}
                  className="btn-modal-save"
                >
                  Load Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>Gift Exchange API v1.0</p>
      </footer>
    </div>
  )
}

export default App