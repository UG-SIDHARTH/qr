export const encodeProfileToHash = (profileData = {}) => {
  const p = profileData?.profile || profileData || {};
  const username = (p.username || p.name || 'user').trim().toLowerCase().replace(/\s+/g, '_').replace(/^#/, '');

  try {
    const compact = {
      p: {
        n: p.name || '',
        u: username,
        t: p.title || '',
        a: p.avatar || '',
        b: p.bio || '',
        l: p.location || '',
        e: p.email || '',
        s: p.statusText || '',
      },
      s: (profileData.socials || []).map(soc => ({
        t: soc.title || '',
        u: soc.url || '',
        i: soc.icon || '',
        c: soc.color || '',
        b: soc.badge || '',
        e: soc.enabled !== false
      })),
      k: (profileData.portfolio || []).map(port => ({
        t: port.title || '',
        d: port.description || '',
        u: port.url || '',
        i: port.image || ''
      })),
      tm: profileData.theme || {}
    };

    const jsonStr = JSON.stringify(compact);
    const b64 = btoa(encodeURIComponent(jsonStr));
    return `#${username}?p=${b64}`;
  } catch (e) {
    return `#${username}`;
  }
};

export const decodeHashToProfile = (hashString = '') => {
  if (!hashString) return null;
  const clean = hashString.replace(/^#/, '');
  if (!clean.includes('?p=')) return null;

  try {
    const parts = clean.split('?p=');
    const b64 = parts[1];
    if (!b64) return null;
    const jsonStr = decodeURIComponent(atob(b64));
    const compact = JSON.parse(jsonStr);
    
    return {
      id: compact.p?.u || `user_${Date.now()}`,
      profile: {
        name: compact.p?.n || '',
        username: compact.p?.u || '',
        title: compact.p?.t || '',
        avatar: compact.p?.a || '',
        bio: compact.p?.b || '',
        location: compact.p?.l || '',
        email: compact.p?.e || '',
        statusText: compact.p?.s || '',
      },
      socials: (compact.s || []).map((soc, idx) => ({
        id: `soc_${idx}`,
        title: soc.t,
        url: soc.u,
        icon: soc.i,
        color: soc.c,
        badge: soc.b,
        enabled: soc.e !== false
      })),
      portfolio: (compact.k || []).map((port, idx) => ({
        id: `port_${idx}`,
        title: port.t,
        description: port.d,
        url: port.u,
        image: port.i
      })),
      theme: compact.tm || {}
    };
  } catch (e) {
    return null;
  }
};

export const getProfileHash = (profileData = {}) => {
  if (typeof profileData === 'string') {
    return `#${profileData.replace(/^#/, '')}`;
  }
  return encodeProfileToHash(profileData);
};

export const getProfileUrl = (profileData = {}) => {
  const hash = getProfileHash(profileData);
  return `${window.location.origin}${window.location.pathname}${hash}`;
};
