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
  return '#user_profile';
};

export const getProfileUrl = (profileData = {}) => {
  const hash = getProfileHash(profileData);
  return `${window.location.origin}${window.location.pathname}${hash}`;
};
