'use client'

import { useState } from 'react'
import { Plus, User, FileText, MapPin, Briefcase } from 'lucide-react'

// Basic typescript definitions matching our DB
type FamilyMember = {
  id: string
  family_id: string
  first_name: string
  last_name: string
  dob?: string | null
  profession?: string | null
  city?: string | null
  bio?: string | null
  photo_url?: string | null
}

type Relationship = {
  id: string
  member_id_1: string
  member_id_2: string
  relationship_type: string // 'parent', 'child', 'spouse', 'sibling'
}

type Props = {
  familyId: string
  initialMembers: FamilyMember[]
  initialRelationships: Relationship[]
}

export default function FamilyTreeView({ initialMembers }: Props) {
  const [members] = useState(initialMembers)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  // In a robust implementation, we would use a library like D3.js or react-flow 
  // to render a complex tree. For this demo, we will render a simplified flex layout
  // or a list if it's too complex to write a full graph layout engine from scratch.
  
  // Here is a simplified custom visualization grid

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative bg-heritage-50/30">
      
      {/* Tree Visualization Area (Simplified List/Grid for now) */}
      <div className="flex-1 p-8 overflow-auto">
        {members.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-heritage-500">
            <p>No members found in this tree.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center content-center min-h-full">
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`bg-white p-4 rounded-2xl border-2 transition-all shadow-sm flex flex-col items-center w-48 text-center
                  ${selectedMember?.id === member.id 
                    ? 'border-heritage-500 shadow-md scale-105' 
                    : 'border-heritage-100 hover:border-heritage-300 hover:shadow-md'
                  }`}
              >
                <div className="w-20 h-20 rounded-full bg-heritage-100 mb-3 flex items-center justify-center overflow-hidden border border-heritage-200">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-heritage-400" />
                  )}
                </div>
                <h3 className="font-medium text-heritage-900 line-clamp-1">{member.first_name} {member.last_name}</h3>
                {member.profession && (
                  <p className="text-xs text-heritage-500 mt-1 line-clamp-1">{member.profession}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Member Profile Sidebar Panel */}
      {selectedMember && (
        <div className="w-full md:w-80 bg-white border-l border-heritage-100 shadow-xl z-10 flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b border-heritage-100 flex justify-between items-center bg-heritage-50/50">
            <h3 className="font-medium text-heritage-900">Member Profile</h3>
            <button 
              onClick={() => setSelectedMember(null)}
              className="text-heritage-500 hover:text-heritage-900 px-2 py-1 text-sm font-medium"
            >
              Close
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-heritage-100 mb-4 flex items-center justify-center overflow-hidden shadow-sm border-2 border-white ring-1 ring-heritage-200">
                {selectedMember.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedMember.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-heritage-400" />
                )}
              </div>
              <h2 className="text-2xl font-serif text-heritage-900">{selectedMember.first_name} {selectedMember.last_name}</h2>
              {selectedMember.dob && (
                <p className="text-sm text-heritage-500 mt-1">
                  Born: {new Date(selectedMember.dob).toLocaleDateString()}
                  {/* Simplistic age calculation */}
                  <span className="ml-2 bg-heritage-100 px-2 py-0.5 rounded-full text-xs">
                    {new Date().getFullYear() - new Date(selectedMember.dob).getFullYear()} yrs
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-4">
              {selectedMember.profession && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-heritage-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-heritage-500 uppercase tracking-wider">Profession</p>
                    <p className="text-sm text-heritage-900">{selectedMember.profession}</p>
                  </div>
                </div>
              )}
              
              {selectedMember.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-heritage-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-heritage-500 uppercase tracking-wider">Location</p>
                    <p className="text-sm text-heritage-900">{selectedMember.city}</p>
                  </div>
                </div>
              )}

              {selectedMember.bio && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-heritage-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-heritage-500 uppercase tracking-wider">Biography</p>
                    <p className="text-sm text-heritage-900 leading-relaxed">{selectedMember.bio}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-heritage-100">
              <h4 className="text-sm font-medium text-heritage-900 mb-4">Actions</h4>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-heritage-100 text-heritage-800 rounded-lg hover:bg-heritage-200 transition-colors text-sm font-medium mb-3">
                <Plus className="h-4 w-4" /> Add Relationship
              </button>
              <button className="w-full py-2 px-4 border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors text-sm font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
