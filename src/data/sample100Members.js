// Generator for 100 realistic organization members
const FIRST_NAMES = ["Aarav", "Aditi", "Ananya", "Arjun", "Bhavya", "Dev", "Divya", "Esha", "Gautam", "Isha", "Kabir", "Karan", "Kavya", "Meera", "Neha", "Nikhil", "Pooja", "Rahul", "Riya", "Rohan", "Sanjay", "Shreya", "Sidharth", "Sneha", "Tanvi", "Utkarsh", "Varun", "Vikas", "Yash", "Zoya", "Alexander", "Emily", "James", "Sophia", "Daniel", "Olivia", "Ethan", "Ava", "Lucas", "Mia"];
const LAST_NAMES = ["Kumar", "Sharma", "Verma", "Gupta", "Patel", "Singh", "Reddy", "Joshi", "Mehta", "Nair", "Rao", "Chawla", "Deshmukh", "Kapoor", "Bhat", "Smith", "Johnson", "Brown", "Davis", "Wilson"];

const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Human Resources"];
const ROLES = {
  Engineering: ["Senior Full Stack Engineer", "Frontend Architect", "Backend Developer", "DevOps Engineer", "Mobile App Developer", "QA Lead"],
  Design: ["UI/UX Designer", "Product Designer", "Brand Strategist", "Motion Graphics Designer"],
  Product: ["Senior Product Manager", "Technical Program Manager", "Scrum Master"],
  Marketing: ["Growth Marketing Lead", "Content Creator", "SEO Specialist", "Social Media Manager"],
  Sales: ["Account Executive", "Business Development Lead", "Sales Manager"],
  "Human Resources": ["HR Operations Manager", "Talent Acquisition Specialist", "People Experience Lead"]
};

export function generate100Members() {
  const members = [];
  
  for (let i = 1; i <= 100; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const roleList = ROLES[dept];
    const title = roleList[i % roleList.length];

    members.push({
      id: `user_${i}`,
      employeeId: `EMP-${1000 + i}`,
      department: dept,
      profile: {
        name,
        username,
        title: `${title} • ${dept}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 123456) % 10000000}?auto=format&fit=crop&q=80&w=400`,
        bio: `Passionate ${title} driving innovation at scale. Connecting teams, code, and digital experiences.`,
        location: i % 2 === 0 ? "Bangalore, India" : "Remote / Hybrid",
        email: `${username}@organization.com`,
        phone: `+91 98765 ${(10000 + i).toString().slice(0, 5)}`,
        verified: i % 3 === 0,
        statusText: `🚀 ${dept} Team • Project Batch #${Math.ceil(i / 10)}`,
        adminPin: "1234",
      },
      socials: [
        {
          id: `s1_${i}`,
          platform: "github",
          title: "GitHub Profile",
          url: `https://github.com/${username}`,
          icon: "Github",
          color: "#333333",
          enabled: true,
          badge: "Work Code",
        },
        {
          id: `s2_${i}`,
          platform: "linkedin",
          title: "LinkedIn Network",
          url: `https://linkedin.com/in/${username}`,
          icon: "Linkedin",
          color: "#0a66c2",
          enabled: true,
          badge: "Professional",
        },
        {
          id: `s3_${i}`,
          platform: "email",
          title: "Work Email",
          url: `mailto:${username}@organization.com`,
          icon: "Mail",
          color: "#ea4335",
          enabled: true,
          badge: "Direct Contact",
        }
      ],
      portfolio: [
        {
          id: `p1_${i}`,
          title: `${dept} Core Initiative #${i}`,
          description: `Key enterprise project led by ${name} focusing on architecture and performance optimization.`,
          url: `https://github.com/org/${username}-project`,
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
          tags: [dept, "Vite", "React"],
          featured: true,
          stars: `${(i * 12) % 500 + 50}`
        }
      ],
      theme: {
        id: i % 2 === 0 ? "cyber-neon" : "midnight-glass",
        name: i % 2 === 0 ? "Cyber Neon" : "Midnight Glass",
        bgStyle: i % 2 === 0 ? "bg-preset-cyber" : "bg-preset-midnight",
        cardStyle: "glass-card",
        accentColor: i % 2 === 0 ? "#a855f7" : "#6366f1",
        buttonRadius: "rounded-2xl",
        fontFamily: "font-sans",
        buttonGlow: true,
      },
      qrConfig: {
        mode: "url",
        fgColor: i % 2 === 0 ? "#a855f7" : "#6366f1",
        bgColor: "#090d16",
        dotStyle: "rounded",
        cornerStyle: "rounded",
        frameText: `SCAN FOR ${firstName.toUpperCase()}'S PROFILE`,
        frameColor: "#6366f1",
        logoText: "⚡",
        includeLogo: true,
        errorCorrectionLevel: "H",
      }
    });
  }

  return members;
}
