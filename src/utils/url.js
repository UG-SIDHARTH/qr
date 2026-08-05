export const getProfileHash = (profile = {}) => {
  if (profile?.username && profile.username.trim()) {
    const cleanUser = profile.username.trim().replace(/^#/, '');
    return `#${cleanUser}`;
  }
  if (profile?.name && profile.name.trim()) {
    const slug = profile.name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    return `#${slug}`;
  }
  return '';
};

export const getProfileUrl = (profile = {}) => {
  const hash = getProfileHash(profile);
  return `${window.location.origin}${window.location.pathname}${hash}`;
};
