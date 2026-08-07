export const getProfileHash = (profileData = {}) => {
  if (typeof profileData === 'string') {
    return `#${profileData.replace(/^#/, '')}`;
  }
  const p = profileData?.profile || profileData || {};
  if (p.username && p.username.trim()) {
    const cleanUser = p.username.trim().replace(/^#/, '');
    return `#${cleanUser}`;
  }
  if (p.name && p.name.trim()) {
    const slug = p.name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    return `#${slug}`;
  }
  if (profileData?.id) {
    return `#user=${profileData.id}`;
  }
  return '#profile';
};

// Safe UTF-8 to URL-safe Base64 encoding using Uint8Array & TextEncoder
const utf8ToBase64 = (str) => {
  try {
    const bytes = new TextEncoder().encode(str);
    let binString = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binString += String.fromCharCode(bytes[i]);
    }
    return btoa(binString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return "";
  }
};

// Safe URL-safe Base64 to UTF-8 decoding using Uint8Array & TextDecoder
const base64ToUtf8 = (base64Str) => {
  try {
    let b64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binString = atob(b64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return "";
  }
};

// Encode profile payload into URL parameter so any device scanning QR receives full profile data
export const encodeProfileData = (profileData = {}) => {
  try {
    if (!profileData || (!profileData.profile && !profileData.socials)) return null;

    const compact = {
      id: profileData.id,
      p: {
        n: profileData.profile?.name || '',
        u: profileData.profile?.username || '',
        t: profileData.profile?.title || '',
        a: profileData.profile?.avatar || '',
        b: profileData.profile?.bio || '',
        s: profileData.profile?.statusText || '',
        l: profileData.profile?.location || '',
        e: profileData.profile?.email || '',
        ph: profileData.profile?.phone || '',
        v: profileData.profile?.verified || false,
      },
      s: (profileData.socials || []).filter(s => s && s.enabled).map(s => ({
        i: s.id,
        t: s.title,
        st: s.subtitle,
        u: s.url,
        ic: s.icon,
        c: s.color,
        b: s.badge
      })),
      pf: (profileData.portfolio || []).map(p => ({
        i: p.id,
        t: p.title,
        d: p.description,
        u: p.url,
        im: p.image,
        tg: p.tags,
        f: p.featured,
        st: p.stars
      })),
      th: profileData.theme
    };

    const jsonStr = JSON.stringify(compact);
    const base64 = utf8ToBase64(jsonStr);
    if (!base64) return null;
    return `p=${base64}`;
  } catch (e) {
    console.error("Failed to encode profile for URL:", e);
    return null;
  }
};

// Decode encoded profile payload from URL hash parameter
export const decodeProfileData = (hashStr = '') => {
  try {
    if (!hashStr) return null;
    const clean = hashStr.replace(/^#/, '');
    const match = clean.match(/(?:^|[?&])p=([^&]+)/);
    if (!match || !match[1]) return null;

    const jsonStr = base64ToUtf8(match[1]);
    if (!jsonStr) return null;
    const compact = JSON.parse(jsonStr);

    if (!compact || (!compact.p?.n && !compact.p?.u)) return null;

    return {
      id: compact.id || compact.p?.u || 'user_scanned',
      employeeId: 'SCANNED-QR',
      department: 'QR Scanned',
      profile: {
        name: compact.p?.n || '',
        username: compact.p?.u || '',
        title: compact.p?.t || '',
        avatar: compact.p?.a || '',
        bio: compact.p?.b || '',
        statusText: compact.p?.s || '',
        location: compact.p?.l || '',
        email: compact.p?.e || '',
        phone: compact.p?.ph || '',
        verified: compact.p?.v || false,
      },
      socials: (compact.s || []).map((s, idx) => ({
        id: s.i || `s_${idx}`,
        title: s.t || '',
        subtitle: s.st || '',
        url: s.u || '',
        icon: s.ic || 'Globe',
        color: s.c || '#4f46e5',
        enabled: true,
        badge: s.b || ''
      })),
      portfolio: (compact.pf || []).map((p, idx) => ({
        id: p.i || `p_${idx}`,
        title: p.t || '',
        description: p.d || '',
        url: p.u || '',
        image: p.im || '',
        tags: p.tg || [],
        featured: p.f || false,
        stars: p.st || ''
      })),
      theme: compact.th || {
        id: 'midnight-glass',
        name: 'Midnight Glass',
        bgStyle: 'bg-preset-midnight',
        accentColor: '#6366f1',
        buttonRadius: 'rounded-2xl',
        buttonGlow: true
      }
    };
  } catch (e) {
    console.error("Failed to decode profile from URL:", e);
    return null;
  }
};

export const getProfileUrl = (profileData = {}) => {
  const hash = getProfileHash(profileData);
  const encodedParam = encodeProfileData(profileData);
  if (encodedParam) {
    return `${window.location.origin}${window.location.pathname}${hash}?${encodedParam}`;
  }
  return `${window.location.origin}${window.location.pathname}${hash}`;
};
