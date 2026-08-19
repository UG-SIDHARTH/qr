import { describe, it, expect } from 'vitest';
import { parseCSVToMembers } from '../csv';

describe('csv utils', () => {
  it('parses valid CSV lines into member objects', () => {
    const csvData = `Employee ID,Full Name,Username,Title / Role,Department,Email,Phone,Location,GitHub URL,LinkedIn URL
EMP-101,Jane Developer,jane_dev,Senior Engineer,Engineering,jane@company.com,+1234567,New York,https://github.com/janedev,https://linkedin.com/in/janedev`;

    const members = parseCSVToMembers(csvData);
    expect(members).toHaveLength(1);
    expect(members[0].employeeId).toBe('EMP-101');
    expect(members[0].profile.name).toBe('Jane Developer');
    expect(members[0].profile.username).toBe('jane_dev');
    expect(members[0].profile.title).toBe('Senior Engineer');
    expect(members[0].department).toBe('Engineering');
  });

  it('returns empty array when CSV has no rows', () => {
    const members = parseCSVToMembers('');
    expect(members).toEqual([]);
  });
});
