export function generateVCard(profile, socials = []) {
  const { name, email, phone, bio, title, location, username } = profile;
  
  // Split name into first and last name if possible
  const nameParts = name.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : "";
  const firstName = nameParts.join(" ");

  let vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${name}`,
    `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
    title ? `TITLE;CHARSET=UTF-8:${title}` : "",
    `NOTE;CHARSET=UTF-8:${bio || ""}`,
    email ? `EMAIL;TYPE=INTERNET,HOME:${email}` : "",
    phone ? `TEL;TYPE=CELL:${phone}` : "",
    location ? `ADR;TYPE=HOME:;;;${location};;;` : "",
  ];

  // Add social media URLs
  socials.forEach((social) => {
    if (social.enabled && social.url) {
      vcard.push(`URL;TYPE=${social.platform.toUpperCase()}:${social.url}`);
    }
  });

  vcard.push("END:VCARD");

  return vcard.filter(Boolean).join("\r\n");
}

export function downloadVCard(profile, socials) {
  const vcardData = generateVCard(profile, socials);
  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${profile.username || 'contact'}_vCard.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
