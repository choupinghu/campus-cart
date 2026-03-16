import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/auth'
import { graphqlRequest } from '../services/graphqlClient'
import { NUS_LOCATIONS } from '../constants/locations'
import ImageUploader from '../components/ui/ImageUploader'
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Package,
  Calendar,
  Pencil,
  Save,
  X,
} from 'lucide-react'

const GET_PROFILE = `
  query Me {
    me {
      id
      name
      email
      image
      bio
      phone
      location
      createdAt
      listingCount
    }
  }
`

const UPDATE_PROFILE = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      image
      bio
      phone
      location
      createdAt
      listingCount
    }
  }
`

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    image: '',
  })

  useEffect(() => {
    if (!session?.user) return
    async function fetchProfile() {
      try {
        const data = await graphqlRequest(GET_PROFILE)
        setProfile(data.me)
        setFormData({
          name: data.me.name || '',
          bio: data.me.bio || '',
          phone: data.me.phone || '',
          location: data.me.location || '',
          image: data.me.image || '',
        })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({ ...prev, image: url || '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccessMsg('')
    try {
      const data = await graphqlRequest(UPDATE_PROFILE, {
        input: {
          name: formData.name || null,
          bio: formData.bio || null,
          phone: formData.phone || null,
          location: formData.location || null,
          image: formData.image || null,
        },
      })
      setProfile(data.updateProfile)
      setEditing(false)
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert(err.message || 'Error updating profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      image: profile?.image || '',
    })
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nus-blue"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <p>Could not load profile.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    )
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h2>
          <p className="text-gray-500 mt-1">Manage your account details</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar section */}
        <div className="bg-gradient-to-r from-nus-blue to-nus-blue-hover p-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 overflow-hidden flex-shrink-0 shadow-lg">
              {(editing ? formData.image : profile.image) ? (
                <img
                  src={editing ? formData.image : profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/80">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="text-white/70 text-sm mt-1">{profile.email}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {profile.listingCount} listing{profile.listingCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {editing ? (
            /* ── Edit Mode ── */
            <div className="space-y-6">
              {/* Avatar upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <ImageUploader onUploadComplete={handleUploadComplete} />
                {formData.image && (
                  <p className="text-xs text-green-600 mt-2 font-medium">✓ Image uploaded</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Tell others about yourself..."
                ></textarea>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. +65 9123 4567"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select a location</option>
                  {NUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button onClick={handleCancel} className="btn-outline">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name}
                  className="btn-primary px-8"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            /* ── View Mode ── */
            <div className="space-y-6">
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={profile.email} />
              <InfoRow
                icon={<FileText className="w-4 h-4" />}
                label="Bio"
                value={profile.bio || 'No bio added yet'}
                muted={!profile.bio}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={profile.phone || 'No phone number added'}
                muted={!profile.phone}
              />
              <InfoRow
                icon={<MapPin className="w-4 h-4" />}
                label="Location"
                value={profile.location || 'No location set'}
                muted={!profile.location}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, muted = false }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p
          className={`text-sm mt-0.5 ${muted ? 'text-gray-400 italic' : 'text-gray-900 font-medium'}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
