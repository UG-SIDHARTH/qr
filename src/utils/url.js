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

export const encodeProfileData = (profileData = {}) => {
  try {
    if (!profileData) return null;
    const pObj = profileData.profile || (profileData.name || profileData.username ? profileData : null);
    if (!pObj && (!profileData.socials || profileData.socials.length === 0)) return null;

    const p = pObj || {};

    const compact = {
      id: profileData.id || p.username || 'user',
      p: {
        n: p.name || '',
        u: p.username || '',
        t: p.title || '',
        a: p.avatar || '',
        b: p.bio || '',
        s: p.statusText || '',
        l: p.location || '',
        e: p.email || '',
        ph: p.phone || '',
        v: p.verified || false,
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
      pf: (profileData.portfolio || []).map(pItem => ({
        i: pItem.id,
        t: pItem.title,
        d: pItem.description,
        u: pItem.url,
        im: pItem.image,
        tg: pItem.tags,
        f: pItem.featured,
        st: pItem.stars
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

export const getShortProfileUrl = (profileData = {}) => {
  const hash = getProfileHash(profileData);
  return `${window.location.origin}${window.location.pathname}${hash}`;
};

export const getProfileUrl = (profileData = {}, includeFullPayload = false) => {
  const hash = getProfileHash(profileData);
  if (includeFullPayload) {
    const encodedParam = encodeProfileData(profileData);
    if (encodedParam && encodedParam.length < 1800) {
      return `${window.location.origin}${window.location.pathname}${hash}?${encodedParam}`;
    }
  }
  return `${window.location.origin}${window.location.pathname}${hash}`;
};
