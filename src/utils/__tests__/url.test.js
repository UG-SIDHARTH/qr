import { describe, it, expect } from 'vitest';
import { getProfileHash, encodeProfileData, decodeProfileData, getProfileUrl } from '../url';

describe('url utils', () => {
  describe('getProfileHash', () => {
    it('returns hash string if string is passed', () => {
      expect(getProfileHash('alex')).toBe('#alex');
      expect(getProfileHash('#alex')).toBe('#alex');
    });

    it('returns username hash if profile has username', () => {
      expect(getProfileHash({ profile: { username: 'john_doe' } })).toBe('#john_doe');
    });

    it('returns slugified name hash if name is present without username', () => {
      expect(getProfileHash({ profile: { name: 'John Doe' } })).toBe('#john_doe');
    });

    it('returns user ID hash if id is present', () => {
      expect(getProfileHash({ id: '12345' })).toBe('#user=12345');
    });

    it('defaults to #profile', () => {
      expect(getProfileHash({})).toBe('#profile');
    });
  });

  describe('encodeProfileData & decodeProfileData', () => {
    it('encodes and decodes profile data symmetrically', () => {
      const profileData = {
        id: 'test_user',
        profile: {
          name: 'Alice Smith',
          username: 'alice',
          title: 'Software Developer',
          email: 'alice@example.com',
        },
        socials: [
          { id: 's1', title: 'GitHub', url: 'https://github.com/alice', enabled: true },
        ],
      };

      const encoded = encodeProfileData(profileData);
      expect(encoded).toBeTypeOf('string');
      expect(encoded).toContain('p=');

      const decoded = decodeProfileData(`#${encoded}`);
      expect(decoded).not.toBeNull();
      expect(decoded.profile.name).toBe('Alice Smith');
      expect(decoded.profile.username).toBe('alice');
      expect(decoded.profile.title).toBe('Software Developer');
      expect(decoded.socials.length).toBe(1);
      expect(decoded.socials[0].title).toBe('GitHub');
    });

    it('returns null when decoding invalid payload', () => {
      expect(decodeProfileData('')).toBeNull();
      expect(decodeProfileData('#p=invalid_base64_json')).toBeNull();
    });
  });
});
