// Utility to parse CSV into member objects and export member lists to CSV
export function exportMembersToCSV(members) {
  const headers = ["Employee ID", "Full Name", "Username", "Title / Role", "Department", "Email", "Phone", "Location", "GitHub URL", "LinkedIn URL", "Profile QR Link"];

  const rows = members.map(m => {
    const p = m.profile;
    const github = m.socials.find(s => s.platform === 'github')?.url || '';
    const linkedin = m.socials.find(s => s.platform === 'linkedin')?.url || '';
    const qrLink = `${window.location.origin}${window.location.pathname}#user=${m.id}`;

    return [
      `"${m.employeeId || ''}"`,
      `"${p.name || ''}"`,
      `"${p.username || ''}"`,
      `"${p.title || ''}"`,
      `"${m.department || 'General'}"`,
      `"${p.email || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.location || ''}"`,
      `"${github}"`,
      `"${linkedin}"`,
      `"${qrLink}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `organization_100_members_directory.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSVToMembers(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim());
  if (lines.length <= 1) return [];


  const members = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex to parse comma-separated fields with quotes
    const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanValues = values.map(v => v ? v.replace(/^"|"$/g, '').trim() : '');

    const name = cleanValues[1] || cleanValues[0] || `Member ${i}`;
    const username = cleanValues[2] || `user_${i}_${Date.now()}`;
    const title = cleanValues[3] || 'Team Member';
    const dept = cleanValues[4] || 'General';
    const email = cleanValues[5] || `${username}@example.com`;
    const phone = cleanValues[6] || '';
    const location = cleanValues[7] || '';
    const github = cleanValues[8] || '';
    const linkedin = cleanValues[9] || '';

    members.push({
      id: `user_csv_${i}_${Date.now()}`,
      employeeId: cleanValues[0] || `EMP-${2000 + i}`,
      department: dept,
      profile: {
        name,
        username,
        title,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400`,
        bio: `Team member in ${dept}. Connect via social links or contact options.`,
        location,
        email,
        phone,
        verified: true,
        statusText: `🚀 ${dept} Department`,
        adminPin: "1234",
      },
      socials: [
        github ? { id: `s1_${i}`, platform: "github", title: "GitHub", url: github, icon: "Github", color: "#333333", enabled: true } : null,
        linkedin ? { id: `s2_${i}`, platform: "linkedin", title: "LinkedIn", url: linkedin, icon: "Linkedin", color: "#0a66c2", enabled: true } : null,
        email ? { id: `s3_${i}`, platform: "email", title: "Email", url: `mailto:${email}`, icon: "Mail", color: "#ea4335", enabled: true } : null,
      ].filter(Boolean),
      portfolio: [],
      theme: {
        id: "midnight-glass",
        name: "Midnight Glass",
        bgStyle: "bg-preset-midnight",
        cardStyle: "glass-card",
        accentColor: "#6366f1",
        buttonRadius: "rounded-xl",
        fontFamily: "font-sans",
        buttonGlow: true,
      },
      qrConfig: {
        mode: "url",
        fgColor: "#a855f7",
        bgColor: "#090d16",
        dotStyle: "rounded",
        cornerStyle: "rounded",
        frameText: `SCAN FOR ${name.toUpperCase()}'S PROFILE`,
        frameColor: "#6366f1",
        logoText: "⚡",
        includeLogo: true,
        errorCorrectionLevel: "H",
      }
    });
  }

  return members;
}
