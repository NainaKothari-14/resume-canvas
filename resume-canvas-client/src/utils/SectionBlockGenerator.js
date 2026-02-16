// src/utils/sectionBlockGenerator.js

// Color palette - Professional ATS-friendly colors
const COLORS = {
  primary: "#1a56db",      // Professional blue
  heading: "#111827",      // Dark gray for headings
  text: "#374151",         // Medium gray for text
  subtext: "#6b7280",      // Light gray for metadata
  accent: "#0ea5e9",       // Bright blue for links
  divider: "#e5e7eb",      // Light gray for dividers
};

export function generateExperienceBlocks(experiences, startY = 350) {
  const blocks = [];
  let currentY = startY;

  if (experiences.length === 0) return blocks;

  // Section heading with underline
  blocks.push({
    id: `exp_heading`,
    type: "heading",
    x: 60,
    y: currentY,
    w: 650,
    h: 35,
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      align: "left",
      lineHeight: 1.2,
      letterSpacing: "0.5px",
    },
    content: "EXPERIENCE",
  });

  currentY += 40;

  // Divider line under heading
  blocks.push({
    id: `exp_divider_top`,
    type: "divider",
    x: 60,
    y: currentY,
    w: 650,
    h: 2,
    style: {
      color: COLORS.divider,
    },
    content: "",
  });

  currentY += 15;

  // Each experience item
  experiences.forEach((exp, idx) => {
    // Position and Company (bold, larger)
    blocks.push({
      id: `exp_${exp.id}_header`,
      type: "text",
      x: 60,
      y: currentY,
      w: 450,
      h: 26,
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: COLORS.heading,
        align: "left",
        lineHeight: 1.3,
      },
      content: exp.position,
    });

    // Date range (right aligned)
    blocks.push({
      id: `exp_${exp.id}_dates`,
      type: "text",
      x: 520,
      y: currentY,
      w: 190,
      h: 26,
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: COLORS.subtext,
        align: "right",
        lineHeight: 1.3,
      },
      content: `${exp.startDate} - ${exp.endDate}`,
    });

    currentY += 24;

    // Company and Location
    blocks.push({
      id: `exp_${exp.id}_company`,
      type: "text",
      x: 60,
      y: currentY,
      w: 650,
      h: 20,
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: COLORS.subtext,
        align: "left",
        lineHeight: 1.3,
        fontStyle: "italic",
      },
      content: `${exp.company} • ${exp.location}`,
    });

    currentY += 24;

    // Description bullets
    const descLines = exp.description.split('\n').filter(l => l.trim()).length;
    const descHeight = Math.max(40, descLines * 18);

    blocks.push({
      id: `exp_${exp.id}_desc`,
      type: "text",
      x: 60,
      y: currentY,
      w: 650,
      h: descHeight,
      style: {
        fontSize: 11,
        fontWeight: 400,
        color: COLORS.text,
        align: "left",
        lineHeight: 1.6,
      },
      content: exp.description,
    });

    currentY += descHeight + 18;
  });

  return blocks;
}

export function generateSkillsBlocks(skills, startY = 350) {
  const blocks = [];
  let currentY = startY;

  if (skills.length === 0) return blocks;

  // Section heading
  blocks.push({
    id: `skills_heading`,
    type: "heading",
    x: 60,
    y: currentY,
    w: 650,
    h: 35,
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      align: "left",
      lineHeight: 1.2,
      letterSpacing: "0.5px",
    },
    content: "SKILLS",
  });

  currentY += 40;

  // Divider
  blocks.push({
    id: `skills_divider_top`,
    type: "divider",
    x: 60,
    y: currentY,
    w: 650,
    h: 2,
    style: {
      color: COLORS.divider,
    },
    content: "",
  });

  currentY += 15;

  // Skills in compact rows
  skills.forEach((skill) => {
    blocks.push({
      id: `skill_${skill.id}_cat`,
      type: "text",
      x: 60,
      y: currentY,
      w: 140,
      h: 22,
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.heading,
        align: "left",
        lineHeight: 1.4,
      },
      content: `${skill.category}:`,
    });

    blocks.push({
      id: `skill_${skill.id}_items`,
      type: "text",
      x: 210,
      y: currentY,
      w: 500,
      h: 22,
      style: {
        fontSize: 11,
        fontWeight: 400,
        color: COLORS.text,
        align: "left",
        lineHeight: 1.4,
      },
      content: skill.items,
    });

    currentY += 24;
  });

  return blocks;
}

export function generateEducationBlocks(education, startY = 350) {
  const blocks = [];
  let currentY = startY;

  if (education.length === 0) return blocks;

  blocks.push({
    id: `edu_heading`,
    type: "heading",
    x: 60,
    y: currentY,
    w: 650,
    h: 35,
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      align: "left",
      lineHeight: 1.2,
      letterSpacing: "0.5px",
    },
    content: "EDUCATION",
  });

  currentY += 40;

  blocks.push({
    id: `edu_divider_top`,
    type: "divider",
    x: 60,
    y: currentY,
    w: 650,
    h: 2,
    style: {
      color: COLORS.divider,
    },
    content: "",
  });

  currentY += 15;

  education.forEach((edu) => {
    // Degree
    blocks.push({
      id: `edu_${edu.id}_degree`,
      type: "text",
      x: 60,
      y: currentY,
      w: 450,
      h: 26,
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: COLORS.heading,
        align: "left",
        lineHeight: 1.3,
      },
      content: edu.degree,
    });

    // Dates
    blocks.push({
      id: `edu_${edu.id}_dates`,
      type: "text",
      x: 520,
      y: currentY,
      w: 190,
      h: 26,
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: COLORS.subtext,
        align: "right",
        lineHeight: 1.3,
      },
      content: `${edu.startDate} - ${edu.endDate}`,
    });

    currentY += 24;

    // Institution with GPA
    const instText = edu.gpa 
      ? `${edu.institution} • GPA: ${edu.gpa}`
      : edu.institution;

    blocks.push({
      id: `edu_${edu.id}_inst`,
      type: "text",
      x: 60,
      y: currentY,
      w: 650,
      h: 20,
      style: {
        fontSize: 11,
        fontWeight: 500,
        color: COLORS.subtext,
        align: "left",
        lineHeight: 1.3,
        fontStyle: "italic",
      },
      content: instText,
    });

    currentY += 30;
  });

  return blocks;
}

export function generateProjectsBlocks(projects, startY = 350) {
  const blocks = [];
  let currentY = startY;

  if (projects.length === 0) return blocks;

  blocks.push({
    id: `proj_heading`,
    type: "heading",
    x: 60,
    y: currentY,
    w: 650,
    h: 35,
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      align: "left",
      lineHeight: 1.2,
      letterSpacing: "0.5px",
    },
    content: "PROJECTS",
  });

  currentY += 40;

  blocks.push({
    id: `proj_divider_top`,
    type: "divider",
    x: 60,
    y: currentY,
    w: 650,
    h: 2,
    style: {
      color: COLORS.divider,
    },
    content: "",
  });

  currentY += 15;

  projects.forEach((proj) => {
    // Project name
    blocks.push({
      id: `proj_${proj.id}_name`,
      type: "text",
      x: 60,
      y: currentY,
      w: 500,
      h: 26,
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: COLORS.heading,
        align: "left",
        lineHeight: 1.3,
      },
      content: proj.name,
    });

    // Link (if exists)
    if (proj.link) {
      blocks.push({
        id: `proj_${proj.id}_link`,
        type: "text",
        x: 570,
        y: currentY,
        w: 140,
        h: 26,
        style: {
          fontSize: 9,
          fontWeight: 500,
          color: COLORS.accent,
          align: "right",
          lineHeight: 1.3,
          textDecoration: "underline",
        },
        content: proj.link,
      });
    }

    currentY += 24;

    // Tech stack
    if (proj.tech) {
      blocks.push({
        id: `proj_${proj.id}_tech`,
        type: "text",
        x: 60,
        y: currentY,
        w: 650,
        h: 18,
        style: {
          fontSize: 10,
          fontWeight: 600,
          color: COLORS.subtext,
          align: "left",
          lineHeight: 1.3,
        },
        content: `Tech: ${proj.tech}`,
      });

      currentY += 20;
    }

    // Description
    const descLines = proj.description.split('\n').filter(l => l.trim()).length;
    const descHeight = Math.max(32, descLines * 16);

    blocks.push({
      id: `proj_${proj.id}_desc`,
      type: "text",
      x: 60,
      y: currentY,
      w: 650,
      h: descHeight,
      style: {
        fontSize: 11,
        fontWeight: 400,
        color: COLORS.text,
        align: "left",
        lineHeight: 1.5,
      },
      content: proj.description,
    });

    currentY += descHeight + 18;
  });

  return blocks;
}

export function generateAchievementsBlocks(achievements, startY = 350) {
  const blocks = [];
  let currentY = startY;

  if (achievements.length === 0) return blocks;

  blocks.push({
    id: `ach_heading`,
    type: "heading",
    x: 60,
    y: currentY,
    w: 650,
    h: 35,
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      align: "left",
      lineHeight: 1.2,
      letterSpacing: "0.5px",
    },
    content: "ACHIEVEMENTS",
  });

  currentY += 40;

  blocks.push({
    id: `ach_divider_top`,
    type: "divider",
    x: 60,
    y: currentY,
    w: 650,
    h: 2,
    style: {
      color: COLORS.divider,
    },
    content: "",
  });

  currentY += 15;

  achievements.forEach((ach) => {
    // Achievement title with bullet
    blocks.push({
      id: `ach_${ach.id}_title`,
      type: "text",
      x: 60,
      y: currentY,
      w: 650,
      h: 22,
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.heading,
        align: "left",
        lineHeight: 1.4,
      },
      content: `• ${ach.title}`,
    });

    currentY += 22;

    // Description
    const descLines = ach.description.split('\n').filter(l => l.trim()).length;
    const descHeight = Math.max(28, descLines * 16);

    blocks.push({
      id: `ach_${ach.id}_desc`,
      type: "text",
      x: 75,
      y: currentY,
      w: 635,
      h: descHeight,
      style: {
        fontSize: 11,
        fontWeight: 400,
        color: COLORS.text,
        align: "left",
        lineHeight: 1.5,
      },
      content: ach.description,
    });

    currentY += descHeight + 12;
  });

  return blocks;
}