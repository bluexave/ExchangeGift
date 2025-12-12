import { useState } from 'react';
import './GroupForm.css';

export const GroupForm = ({ onSubmit, loading }) => {
  const [groups, setgroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [errors, setErrors] = useState([]);

  const isGroupValid = (Group) => {
    return Group.name.trim() && Group.email.trim();
  };

  const getMemberCount = (Group) => {
    return Group.members.filter(m => m.trim()).length;
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (groups.length < 3) {
      newErrors.push('At least 3 groups are required');
    }

    groups.forEach((Group, idx) => {
      if (!Group.name.trim()) {
        newErrors.push(`group ${idx + 1}: Name is required`);
      }

      if (!Group.email.trim()) {
        newErrors.push(`group ${idx + 1}: Email is required`);
      }

      const validMembers = getMemberCount(Group);
      if (validMembers < 3) {
        newErrors.push(`group ${idx + 1}: At least 3 members required`);
      }
    });

    const totalMembers = groups.reduce((sum, f) => sum + getMemberCount(f), 0);
    if (totalMembers < 10) {
      newErrors.push(`Total members must be at least 10 (currently ${totalMembers})`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const isFormValid = () => {
    if (groups.length < 3) return false;
    
    for (let group of groups) {
      if (!Group.name.trim() || !Group.email.trim()) return false;
      if (getMemberCount(Group) < 3) return false;
    }
    
    const totalMembers = groups.reduce((sum, f) => sum + getMemberCount(f), 0);
    return totalMembers >= 10;
  };

  const addgroup = () => {
    const newIdx = groups.length;
    setgroups([...groups, { name: '', members: [], email: '', isPickAtLeastOnePerGroup: false }]);
    setEditingGroup(newIdx);
  };

  const removegroup = (idx) => {
    setgroups(groups.filter((_, i) => i !== idx));
    if (editinggroup === idx) {
      setEditingGroup(null);
    }
  };

  const updateGroupName = (idx, value) => {
    const updated = [...groups];
    updated[idx].name = value;
    setgroups(updated);
  };

  const updateGroupEmail = (idx, value) => {
    const updated = [...groups];
    updated[idx].email = value;
    setgroups(updated);
  };

  const addMember = (idx) => {
    const updated = [...groups];
    updated[idx].members.push('');
    setgroups(updated);
  };

  const removeMember = (GroupIdx, memberIdx) => {
    const updated = [...groups];
    updated[GroupIdx].members = updated[GroupIdx].members.filter((_, i) => i !== memberIdx);
    setgroups(updated);
  };

  const updateMember = (GroupIdx, memberIdx, value) => {
    const updated = [...groups];
    updated[GroupIdx].members[memberIdx] = value;
    setgroups(updated);
  };

  const togglePickAtLeastOnePerGroup = (idx) => {
    const updated = [...groups];
    updated[idx].isPickAtLeastOnePerGroup = !updated[idx].isPickAtLeastOnePerGroup;
    setgroups(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(groups, true);
    }
  };

  const totalMembers = groups.reduce((sum, f) => sum + getMemberCount(f), 0);

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <div className="form-header">
        <div className="form-title">
          <h2>Gift Exchange Setup</h2>
          <div className="form-stats">
            <span>groups: {groups.length}/3+</span>
            <span>Total Members: {totalMembers}/10+</span>
          </div>
        </div>
        <div className="header-buttons">
          <button type="button" onClick={addGroup} className="btn-add-Group-top">
            + Add Group
          </button>
          <button 
            type="submit" 
            className="btn-submit-top" 
            disabled={loading || !isFormValid()}
          >
            {loading ? '⏳ Creating Matches...' : '🎯 Create Matches'}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((err, idx) => (
            <div key={idx} className="error-item">
              ⚠️ {err}
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>Click "Add Group" to get started</p>
        </div>
      ) : (
        <div 
          className="groups-grid"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingGroup(null);
            }
          }}
        >
          {groups.map((Group, GroupIdx) => {
            const memberCount = getMemberCount(Group);
            const isValid = isGroupValid(Group);
            const isEditing = editinggroup === GroupIdx;

            return (
              <div 
                key={GroupIdx} 
                className={`group-card ${isEditing ? 'editing' : ''}`}
                onClick={(e) => {
                  if (!isEditing) {
                    setEditingGroup(GroupIdx);
                  }
                }}
                onMouseLeave={() => {
                  if (isEditing) {
                    setEditingGroup(null);
                  }
                }}
              >
                <div className="group-header-section">
                  <div className="group-info">
                    <input
                      type="text"
                      placeholder="group Name"
                      value={Group.name}
                      onChange={(e) => updateGroupName(GroupIdx, e.target.value)}
                      className="group-name-input"
                    />
                    <input
                      type="email"
                      placeholder="group Email"
                      value={Group.email}
                      onChange={(e) => updateGroupEmail(GroupIdx, e.target.value)}
                      className="group-email-input"
                    />
                  </div>
                  <div className="group-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={Group.isPickAtLeastOnePerGroup || false}
                        onChange={() => togglePickAtLeastOnePerGroup(GroupIdx)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Pick 1 per Group</span>
                    </label>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGroup(GroupIdx);
                        setEditingGroup(null);
                      }}
                      className="btn-remove-Group"
                      title="Remove Group"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isValid && (
                  <div className="members-section">
                    <div className="members-header">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addMember(GroupIdx);
                        }}
                        className="btn-add-member-inline"
                        disabled={Group.members.some(m => !m.trim())}
                        title={Group.members.some(m => !m.trim()) ? "Fill all members first" : "Add member"}
                      >
                        +
                      </button>
                      <h4>{memberCount}/3</h4>
                    </div>
                    {Group.members.map((member, memberIdx) => (
                      <div key={memberIdx} className="member-input-group">
                        <input
                          type="text"
                          placeholder={`Member ${memberIdx + 1}`}
                          value={member}
                          onChange={(e) => updateMember(GroupIdx, memberIdx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.shiftKey && e.key === 'Enter') {
                              e.preventDefault();
                              if (!Group.members.some(m => !m.trim())) {
                                addMember(GroupIdx);
                              }
                            }
                          }}
                          className="member-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMember(GroupIdx, memberIdx);
                            }}
                            className="btn-remove-member"
                            title="Remove member"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
};
