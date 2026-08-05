import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  QrCode, 
  Eye, 
  Edit3, 
  CheckSquare, 
  Square, 
  Sparkles,
  Printer,
  FileSpreadsheet,
  Building2,
  BadgeCheck
} from 'lucide-react';
import { exportMembersToCSV, parseCSVToMembers } from '../../utils/csv';
import { generate100Members } from '../../data/sample100Members';
import BatchQRExporter from './BatchQRExporter';

export default function BulkAdminDashboard({ 
  members, 
  onUpdateMembers, 
  onSelectMemberToEdit, 
  onViewMemberProfile 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporterOpen, setIsExporterOpen] = useState(false);

  // Departments list
  const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Human Resources'];

  // Filtered members list based on search and department
  const filteredMembers = members.filter(m => {
    const matchesDept = selectedDept === 'All' || m.department === selectedDept;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      m.profile.name.toLowerCase().includes(searchLower) ||
      m.profile.title.toLowerCase().includes(searchLower) ||
      m.profile.email.toLowerCase().includes(searchLower) ||
      (m.employeeId && m.employeeId.toLowerCase().includes(searchLower));
    
    return matchesDept && matchesSearch;
  });

  // Select / Deselect All Filtered
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredMembers.map(m => m.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Generate 100 Sample Members
  const handleGenerate100 = () => {
    if (window.confirm("Generate 100 sample organization members with complete Linktree profiles & QR codes?")) {
      const new100 = generate100Members();
      onUpdateMembers(new100);
      setSelectedIds([]);
    }
  };

  // CSV Import handler
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imported = parseCSVToMembers(event.target.result);
        if (imported.length > 0) {
          onUpdateMembers([...imported, ...members]);
          alert(`Successfully imported ${imported.length} member profiles from CSV!`);
        } else {
          alert("Could not parse members from CSV. Ensure headers match Name, Title, Email, Department.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Export Selected CSV
  const handleExportCSV = () => {
    const targets = selectedIds.length > 0 
      ? members.filter(m => selectedIds.includes(m.id))
      : filteredMembers;
    exportMembersToCSV(targets);
  };

  // Delete Selected Members
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected member profiles?`)) {
      onUpdateMembers(members.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
  };

  // Add Single Member
  const handleAddSingleMember = () => {
    const id = `user_${Date.now()}`;
    const newMember = {
      id,
      employeeId: `EMP-${1000 + members.length + 1}`,
      department: 'General',
      profile: {
        name: 'New Member',
        username: `user_${members.length + 1}`,
        title: 'Team Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        bio: 'Team member bio...',
        email: `member${members.length + 1}@organization.com`,
        phone: '',
        location: '',
        verified: false,
        statusText: '🚀 Team Member',
        adminPin: '1234',
      },
      socials: [],
      portfolio: [],
      theme: {
        id: 'midnight-glass',
        name: 'Midnight Glass',
        bgStyle: 'bg-preset-midnight',
        cardStyle: 'glass-card',
        accentColor: '#6366f1',
        buttonRadius: 'rounded-xl',
        fontFamily: 'font-sans',
        buttonGlow: true,
      },
      qrConfig: {
        mode: 'url',
        fgColor: '#a855f7',
        bgColor: '#090d16',
        dotStyle: 'rounded',
        cornerStyle: 'rounded',
        frameText: 'SCAN FOR PROFILE',
        frameColor: '#6366f1',
        logoText: '⚡',
        includeLogo: true,
        errorCorrectionLevel: 'H',
      }
    };

    onUpdateMembers([newMember, ...members]);
    onSelectMemberToEdit(newMember);
  };

  const selectedMemberList = members.filter(m => selectedIds.includes(m.id));

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header Banner */}
      <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold font-outfit text-white">
              100+ People Bulk QR Administrator Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Manage organization members, auto-generate Linktree profiles & batch export QR codes for 100+ employees.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerate100}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-purple-600/20 flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate 100 Sample Members</span>
          </button>

          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 cursor-pointer flex items-center space-x-1.5 transition-all">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import CSV Roster</span>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={handleAddSingleMember}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center space-x-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Stats Counter & Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="block text-2xl font-extrabold text-white font-outfit">{members.length}</span>
          <span className="text-[11px] text-slate-400">Total Directory Members</span>
        </div>

        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="block text-2xl font-extrabold text-indigo-400 font-outfit">{selectedIds.length}</span>
          <span className="text-[11px] text-slate-400">Members Selected</span>
        </div>

        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="block text-2xl font-extrabold text-purple-400 font-outfit">{filteredMembers.length}</span>
          <span className="text-[11px] text-slate-400">Matching Search Filter</span>
        </div>

        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="block text-2xl font-extrabold text-emerald-400 font-outfit">{departments.length - 1}</span>
          <span className="text-[11px] text-slate-400">Active Departments</span>
        </div>
      </div>

      {/* Search, Filter Tabs & Batch Toolbar */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Input & Batch Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100+ members by name, title, department, or email..."
              className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-xs"
            />
          </div>

          {/* Batch Actions */}
          <div className="flex items-center space-x-2">
            <button
              disabled={selectedIds.length === 0}
              onClick={() => setIsExporterOpen(true)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Batch Print QR Cards ({selectedIds.length})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV Directory</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-medium rounded-xl flex items-center space-x-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3 text-indigo-400" />
            Dept:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

      </div>

      {/* Directory Table */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <button onClick={handleSelectAllFiltered} className="hover:text-white">
                    {filteredMembers.length > 0 && filteredMembers.every(m => selectedIds.includes(m.id)) ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Title & Department</th>
                <th className="py-3 px-4">Email Contact</th>
                <th className="py-3 px-4">Unique QR Profile URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredMembers.map((member) => {
                const isSelected = selectedIds.includes(member.id);
                const profileUrl = member.profile?.username 
                  ? `${window.location.origin}${window.location.pathname}#${member.profile.username}`
                  : `${window.location.origin}${window.location.pathname}#user=${member.id}`;

                return (
                  <tr 
                    key={member.id}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-indigo-500/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelectOne(member.id)} className="hover:text-white">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </td>

                    {/* Member Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={member.profile.avatar} 
                          alt={member.profile.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold text-slate-100">{member.profile.name}</span>
                            {member.profile.verified && <BadgeCheck className="w-3.5 h-3.5 text-indigo-400" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">@{member.profile.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Department */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="block font-medium text-slate-200">{member.profile.title}</span>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-indigo-300 rounded-full border border-slate-700">
                          {member.department || 'General'}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {member.profile.email}
                    </td>

                    {/* Unique Profile Link */}
                    <td className="py-3 px-4">
                      <a 
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline font-mono text-[11px] truncate max-w-[200px] block"
                      >
                        #user={member.id}
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewMemberProfile(member)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                          title="View Linktree Bio Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectMemberToEdit(member)}
                          className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg border border-indigo-500/30"
                          title="Edit Profile & QR"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No organization members found matching "{searchTerm}". Click "Generate 100 Sample Members" above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch QR Code Exporter Modal */}
      {isExporterOpen && (
        <BatchQRExporter
          selectedMembers={selectedMemberList.length > 0 ? selectedMemberList : filteredMembers}
          onClose={() => setIsExporterOpen(false)}
        />
      )}

    </div>
  );
}
