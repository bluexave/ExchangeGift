import { useState } from 'react';
import './FamilyForm.css';

export const FamilyForm = ({ onSubmit, loading }) => {
  const [families, setFamilies] = useState([]);
  const [editingFamily, setEditingFamily] = useState(null);
  const [errors, setErrors] = useState([]);

  const isFamilyValid = (family) => {
    return family.name.trim() && family.email.trim();
  };

  const getMemberCount = (family) => {
    return family.members.filter(m => m.trim()).length;
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (families.length < 3) {
      newErrors.push('At least 3 families are required');
    }

    families.forEach((family, idx) => {
      if (!family.name.trim()) {
        newErrors.push(`Family ${idx + 1}: Name is required`);
      }

      if (!family.email.trim()) {
        newErrors.push(`Family ${idx + 1}: Email is required`);
      }

      const validMembers = getMemberCount(family);
      if (validMembers < 3) {
        newErrors.push(`Family ${idx + 1}: At least 3 members required`);
      }
    });

    const totalMembers = families.reduce((sum, f) => sum + getMemberCount(f), 0);
    if (totalMembers < 10) {
      newErrors.push(`Total members must be at least 10 (currently ${totalMembers})`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const isFormValid = () => {
    if (families.length < 3) return false;
    
    for (let family of families) {
      if (!family.name.trim() || !family.email.trim()) return false;
      if (getMemberCount(family) < 3) return false;
    }
    
    const totalMembers = families.reduce((sum, f) => sum + getMemberCount(f), 0);
    return totalMembers >= 10;
  };

  const addFamily = () => {
    const newIdx = families.length;
    setFamilies([...families, { name: '', members: [], email: '' }]);
    setEditingFamily(newIdx);
  };

  const removeFamily = (idx) => {
    setFamilies(families.filter((_, i) => i !== idx));
    if (editingFamily === idx) {
      setEditingFamily(null);
    }
  };

  const updateFamilyName = (idx, value) => {
    const updated = [...families];
    updated[idx].name = value;
    setFamilies(updated);
  };

  const updateFamilyEmail = (idx, value) => {
    const updated = [...families];
    updated[idx].email = value;
    setFamilies(updated);
  };

  const addMember = (idx) => {
    const updated = [...families];
    updated[idx].members.push('');
    setFamilies(updated);
  };

  const removeMember = (familyIdx, memberIdx) => {
    const updated = [...families];
    updated[familyIdx].members = updated[familyIdx].members.filter((_, i) => i !== memberIdx);
    setFamilies(updated);
  };

  const updateMember = (familyIdx, memberIdx, value) => {
    const updated = [...families];
    updated[familyIdx].members[memberIdx] = value;
    setFamilies(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(families, true);
    }
  };

  const totalMembers = families.reduce((sum, f) => sum + getMemberCount(f), 0);

  return (
    <form onSubmit={handleSubmit} className="family-form">
      <div className="form-header">
        <div className="form-title">
          <h2>Gift Exchange Setup</h2>
          <div className="form-stats">
            <span>Families: {families.length}/3+</span>
            <span>Total Members: {totalMembers}/10+</span>
          </div>
        </div>
        <div className="header-buttons">
          <button type="button" onClick={addFamily} className="btn-add-family-top">
            + Add Family
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

      {families.length === 0 ? (
        <div className="empty-state">
          <p>Click "Add Family" to get started</p>
        </div>
      ) : (
        <div 
          className="families-grid"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingFamily(null);
            }
          }}
        >
          {families.map((family, familyIdx) => {
            const memberCount = getMemberCount(family);
            const isValid = isFamilyValid(family);
            const isEditing = editingFamily === familyIdx;

            return (
              <div 
                key={familyIdx} 
                className={`family-card ${isEditing ? 'editing' : ''}`}
                onClick={(e) => {
                  if (!isEditing) {
                    setEditingFamily(familyIdx);
                  }
                }}
                onMouseLeave={() => {
                  if (isEditing) {
                    setEditingFamily(null);
                  }
                }}
              >
                <div className="family-header-section">
                  <div className="family-info">
                    <input
                      type="text"
                      placeholder="Family Name"
                      value={family.name}
                      onChange={(e) => updateFamilyName(familyIdx, e.target.value)}
                      className="family-name-input"
                    />
                    <input
                      type="email"
                      placeholder="Family Email"
                      value={family.email}
                      onChange={(e) => updateFamilyEmail(familyIdx, e.target.value)}
                      className="family-email-input"
                    />
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFamily(familyIdx);
                        setEditingFamily(null);
                      }}
                      className="btn-remove-family"
                      title="Remove family"
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
                          addMember(familyIdx);
                        }}
                        className="btn-add-member-inline"
                        disabled={family.members.some(m => !m.trim())}
                        title={family.members.some(m => !m.trim()) ? "Fill all members first" : "Add member"}
                      >
                        +
                      </button>
                      <h4>{memberCount}/3</h4>
                    </div>
                    {family.members.map((member, memberIdx) => (
                      <div key={memberIdx} className="member-input-group">
                        <input
                          type="text"
                          placeholder={`Member ${memberIdx + 1}`}
                          value={member}
                          onChange={(e) => updateMember(familyIdx, memberIdx, e.target.value)}
                          className="member-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMember(familyIdx, memberIdx);
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
