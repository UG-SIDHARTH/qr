import { describe, it, expect } from 'vitest';
import { generateVCard } from '../vcard';

describe('vcard utils', () => {
  it('generates valid vCard 3.0 content with profile details', () => {
    const profile = {
      name: 'John Doe',
      title: 'Lead Engineer',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      bio: 'Building awesome tech',
    };
    const socials = [
      { platform: 'github', url: 'https://github.com/johndoe', enabled: true },
    ];

    const vcard = generateVCard(profile, socials);

    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN;CHARSET=UTF-8:John Doe');
    expect(vcard).toContain('TITLE;CHARSET=UTF-8:Lead Engineer');
    expect(vcard).toContain('EMAIL;TYPE=INTERNET,HOME:john@example.com');
    expect(vcard).toContain('TEL;TYPE=CELL:+1234567890');
    expect(vcard).toContain('URL;TYPE=GITHUB:https://github.com/johndoe');
    expect(vcard).toContain('END:VCARD');
  });

  it('handles empty profile gracefully', () => {
    const vcard = generateVCard({}, []);
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('FN;CHARSET=UTF-8:Contact');
    expect(vcard).toContain('END:VCARD');
  });
});
