import { create } from "zustand";
import { nanoid } from "../utils/id";
import { resumeAPI } from "../services/api";

const DEFAULT_PAGE = { id: "page-1", width: 794, height: 1123 };
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const BINDINGS = {
  fullName: "b_fullName",
  headline: "b_headline",
  email: "b_email",
  phone: "b_phone",
  location: "b_location",
  summary: "b_summary",
  github: "b_github",
  linkedin: "b_linkedin",
  portfolio: "b_portfolio",
};

// History management
const MAX_HISTORY = 50;

const createHistoryState = (state) => ({
  pages: state.pages,
  blocks: state.blocks,
  resumeData: state.resumeData,
  sections: state.sections,
});

export const useEditorStore = create((set, get) => ({
  pages: [DEFAULT_PAGE],
  currentPageId: "page-1",
  blocks: [],
  selectedId: null,
  title: 'Untitled Resume',

  // Undo/Redo state
  history: [],
  historyIndex: -1,

  // API state
  currentResumeId: null,
  isSaving: false,
  lastSaved: null,
  saveError: null,

  // Canvas View State (Zoom & Pan)
  canvasView: {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: false,
  },

  // Canvas View Actions
  setZoom: (zoom) =>
    set((s) => ({
      canvasView: { ...s.canvasView, zoom },
    })),

  setPanOffset: (panOffset) =>
    set((s) => ({
      canvasView: { ...s.canvasView, panOffset },
    })),

  toggleGrid: () =>
    set((s) => ({
      canvasView: { ...s.canvasView, showGrid: !s.canvasView.showGrid },
    })),

  resetCanvasView: () =>
    set((s) => ({
      canvasView: { ...s.canvasView, zoom: 1, panOffset: { x: 0, y: 0 } },
    })),

//For title
title: 'Untitled Resume',

setTitle: (title) => set({ title }),

  // Basic Info
  resumeData: {
    fullName: "Your Name",
    headline: "Backend Developer | MERN | Real-time Systems",
    email: "you@email.com",
    phone: "+91 XXXXX XXXXX",
    location: "Mumbai, India",
    summary: "Passionate developer with 3+ years of experience...",
    github: "github.com/yourusername",
    linkedin: "linkedin.com/in/yourusername",
    portfolio: "yourportfolio.com",
  },

  // Dynamic Sections (Experience, Skills, Education, Achievements, etc.)
  sections: {
    experience: [
      {
        id: "exp_1",
        company: "Tech Corp",
        position: "Senior Backend Developer",
        location: "Mumbai, India",
        startDate: "Jan 2022",
        endDate: "Present",
        description: "• Built scalable microservices handling 1M+ requests/day\n• Led team of 4 developers in migrating legacy systems",
      },
    ],
    skills: [
      {
        id: "skill_1",
        category: "Backend",
        items: "Node.js, Express, MongoDB, Redis, PostgreSQL",
      },
      {
        id: "skill_2",
        category: "Frontend",
        items: "React, Next.js, TypeScript, Tailwind CSS",
      },
    ],
    education: [
      {
        id: "edu_1",
        institution: "University of Mumbai",
        degree: "B.Tech in Computer Science",
        location: "Mumbai, India",
        startDate: "2018",
        endDate: "2022",
        gpa: "8.5/10",
      },
    ],
    achievements: [
      {
        id: "ach_1",
        title: "Hackathon Winner",
        description: "Won 1st place at XYZ Hackathon 2023 for building real-time collaboration tool",
      },
      {
        id: "ach_2",
        title: "Open Source Contributor",
        description: "Contributed to 10+ major open source projects with 500+ stars",
      },
    ],
    projects: [
      {
        id: "proj_1",
        name: "Resume Builder",
        link: "github.com/user/resume-builder",
        description: "Built a drag-and-drop resume builder with React and Node.js",
        tech: "React, Node.js, MongoDB",
      },
    ],
  },

  // ============================================
  // API METHODS
  // ============================================

  // Load resume from backend
  loadResume: async (id) => {
    try {
      set({ isSaving: true, saveError: null });
      const response = await resumeAPI.getById(id);
      
      if (response.success) {
        const resume = response.data;
        set({
          currentResumeId: resume._id,
          title: resume.title || 'Untitled Resume', 
          pages: resume.pages || [DEFAULT_PAGE],
          currentPageId: resume.currentPageId || "page-1",
          blocks: resume.blocks || [],
          resumeData: resume.resumeData || get().resumeData,
          sections: resume.sections || get().sections,
          canvasView: resume.canvasView || get().canvasView,
          isSaving: false,
          lastSaved: new Date(resume.updatedAt),
          saveError: null,
        });
        console.log('✅ Resume loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      set({ 
        saveError: error.response?.data?.message || 'Failed to load resume',
        isSaving: false 
      });
    }
  },

  // Save resume to backend
  saveResume: async () => {
    try {
      const state = get();
      set({ isSaving: true, saveError: null });

      const resumeData = {
        title: state.title,
        pages: state.pages,
        currentPageId: state.currentPageId,
        blocks: state.blocks,
        resumeData: state.resumeData,
        sections: state.sections,
        canvasView: state.canvasView,
      };

      let response;
      if (state.currentResumeId) {
        // Update existing resume
        response = await resumeAPI.update(state.currentResumeId, resumeData);
        console.log('✅ Resume updated successfully!');
      } else {
        // Create new resume
        response = await resumeAPI.create({
          ...resumeData,
          title: `Resume - ${state.resumeData.fullName}`,
        });
        console.log('✅ Resume created successfully!');
      }

      if (response.success) {
        set({
          currentResumeId: response.data._id,
          isSaving: false,
          lastSaved: new Date(),
          saveError: null,
        });
        return true;
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      set({ 
        saveError: error.response?.data?.message || 'Failed to save resume',
        isSaving: false 
      });
      return false;
    }
  },

  // Auto-save (lighter version - only saves blocks and canvas view)
  autoSave: async () => {
    try {
      const state = get();
      if (!state.currentResumeId) {
        // If no resume ID, do a full save
        return await get().saveResume();
      }

      const autoSaveData = {
        blocks: state.blocks,
        canvasView: state.canvasView,
      };

      const response = await resumeAPI.autoSave(state.currentResumeId, autoSaveData);
      
      if (response.success) {
        set({ 
          lastSaved: new Date(response.data.lastModified),
          saveError: null 
        });
        console.log('💾 Auto-saved');
        return true;
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      return false;
    }
  },

  // Create new resume (reset state)
  newResume: () => {
    set({
      currentResumeId: null,
      title: 'Untitled Resume',
      pages: [DEFAULT_PAGE],
      currentPageId: "page-1",
      blocks: [],
      selectedId: null,
      history: [],
      historyIndex: -1,
      lastSaved: null,
      saveError: null,
      isSaving: false,
    });
    console.log('📄 New resume created');
  },
  // Reset editor (for creating new resume)
resetEditor: () => {
  set({
    currentResumeId: null,
    title: 'Untitled Resume',  // ✅ Add this
    pages: [DEFAULT_PAGE],
    currentPageId: "page-1",
    blocks: [],
    selectedId: null,
    resumeData: {
      fullName: 'Your Name',
      headline: 'Your Professional Headline',
      email: 'you@email.com',
      phone: '+1 (555) 000-0000',
      location: 'City, Country',
      summary: 'Your professional summary...',
      github: '',
      linkedin: '',
      portfolio: '',
    },
    sections: {
      experience: [],
      skills: [],
      education: [],
      achievements: [],
      projects: [],
    },
    canvasView: {
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      showGrid: false,
    },
    history: [],
    historyIndex: -1,
    lastSaved: null,
    saveError: null,
  });
},

  // ============================================
  // HISTORY MANAGEMENT
  // ============================================

  saveHistory: () => {
    const state = get();
    const historyState = createHistoryState(state);
    
    // Remove any future history if we're not at the end
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    
    // Add new state
    newHistory.push(historyState);
    
    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        ...previousState,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        ...nextState,
        historyIndex: historyIndex + 1,
      });
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // ============================================
  // PAGE MANAGEMENT
  // ============================================

  setCurrentPage: (pageId) => set({ currentPageId: pageId }),

  addPage: () => {
    const newPage = {
      id: `page-${nanoid()}`,
      width: 794,
      height: 1123,
    };
    
    set((s) => {
      const newState = {
        pages: [...s.pages, newPage],
        currentPageId: newPage.id,
      };
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    });
  },

  deletePage: (pageId) => {
    const { pages, currentPageId } = get();
    if (pages.length <= 1) return; // Don't delete the last page
    
    set((s) => {
      const newPages = s.pages.filter(p => p.id !== pageId);
      const newCurrentPageId = pageId === currentPageId 
        ? newPages[0].id 
        : currentPageId;
      
      // Remove blocks associated with this page
      const newBlocks = s.blocks.filter(b => b.pageId !== pageId);
      
      const newState = {
        pages: newPages,
        currentPageId: newCurrentPageId,
        blocks: newBlocks,
      };
      
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    });
  },

  duplicatePage: (pageId) => {
    const { pages, blocks } = get();
    const pageToDuplicate = pages.find(p => p.id === pageId);
    if (!pageToDuplicate) return;
    
    const newPageId = `page-${nanoid()}`;
    const newPage = {
      ...pageToDuplicate,
      id: newPageId,
    };
    
    // Duplicate all blocks from this page
    const pageBlocks = blocks.filter(b => b.pageId === pageId);
    const newBlocks = pageBlocks.map(block => ({
      ...block,
      id: nanoid(),
      pageId: newPageId,
    }));
    
    set((s) => {
      const pageIndex = s.pages.findIndex(p => p.id === pageId);
      const newPages = [
        ...s.pages.slice(0, pageIndex + 1),
        newPage,
        ...s.pages.slice(pageIndex + 1),
      ];
      
      const newState = {
        pages: newPages,
        blocks: [...s.blocks, ...newBlocks],
        currentPageId: newPageId,
      };
      
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    });
  },

  setSelected: (id) => set({ selectedId: id }),

  // ============================================
  // RESUME DATA MANAGEMENT
  // ============================================

  setResumeField: (field, value) => {
    const blockId = BINDINGS[field];

    set((s) => {
      const newResumeData = { ...s.resumeData, [field]: value };
      const newBlocks = blockId
        ? s.blocks.map((b) => (b.id === blockId ? { ...b, content: value } : b))
        : s.blocks;

      setTimeout(() => get().saveHistory(), 0);
      
      return {
        resumeData: newResumeData,
        blocks: newBlocks,
      };
    });
  },

  // Section Management
  addSectionItem: (sectionName, item) =>
    set((s) => {
      const newState = {
        sections: {
          ...s.sections,
          [sectionName]: [...(s.sections[sectionName] || []), { ...item, id: nanoid() }],
        },
      };
      
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  updateSectionItem: (sectionName, itemId, updates) =>
    set((s) => {
      const newState = {
        sections: {
          ...s.sections,
          [sectionName]: s.sections[sectionName].map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        },
      };
      
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  deleteSectionItem: (sectionName, itemId) =>
    set((s) => {
      const newState = {
        sections: {
          ...s.sections,
          [sectionName]: s.sections[sectionName].filter((item) => item.id !== itemId),
        },
      };
      
      setTimeout(() => get().saveHistory(), 0);
      return newState;
    }),

  // ============================================
  // BLOCK OPERATIONS
  // ============================================

  // Initialize base blocks (header only)
  ensureBaseBlocks: () => {
    const { blocks, resumeData, currentPageId } = get();

    const exists = (id) => blocks.some((b) => b.id === id);

    if (exists(BINDINGS.fullName)) return;

    const nextBlocks = [...blocks];

    const addBoundText = (id, x, y, w, h, style, content) => {
      nextBlocks.push({
        id,
        type: "text",
        pageId: currentPageId,
        x,
        y,
        w,
        h,
        style,
        content,
      });
    };

    // Header section
    addBoundText(
      BINDINGS.fullName,
      60,
      60,
      650,
      60,
      { fontSize: 32, fontWeight: 800, color: "#111111", align: "left", lineHeight: 1.15 },
      resumeData.fullName
    );

    addBoundText(
      BINDINGS.headline,
      60,
      115,
      650,
      36,
      { fontSize: 14, fontWeight: 600, color: "#111111", align: "left", lineHeight: 1.35 },
      resumeData.headline
    );

    // Contact info row
    addBoundText(
      BINDINGS.email,
      60,
      155,
      200,
      28,
      { fontSize: 12, fontWeight: 500, color: "#111111", align: "left", lineHeight: 1.35 },
      resumeData.email
    );

    addBoundText(
      BINDINGS.phone,
      270,
      155,
      180,
      28,
      { fontSize: 12, fontWeight: 500, color: "#111111", align: "left", lineHeight: 1.35 },
      resumeData.phone
    );

    addBoundText(
      BINDINGS.location,
      460,
      155,
      250,
      28,
      { fontSize: 12, fontWeight: 500, color: "#111111", align: "left", lineHeight: 1.35 },
      resumeData.location
    );

    // Links row
    addBoundText(
      BINDINGS.github,
      60,
      185,
      200,
      28,
      { fontSize: 11, fontWeight: 400, color: "#0066cc", align: "left", lineHeight: 1.35 },
      resumeData.github
    );

    addBoundText(
      BINDINGS.linkedin,
      270,
      185,
      220,
      28,
      { fontSize: 11, fontWeight: 400, color: "#0066cc", align: "left", lineHeight: 1.35 },
      resumeData.linkedin
    );

    addBoundText(
      BINDINGS.portfolio,
      500,
      185,
      210,
      28,
      { fontSize: 11, fontWeight: 400, color: "#0066cc", align: "left", lineHeight: 1.35 },
      resumeData.portfolio
    );

    // Summary
    addBoundText(
      BINDINGS.summary,
      60,
      225,
      650,
      90,
      { fontSize: 12, fontWeight: 400, color: "#111111", align: "left", lineHeight: 1.45 },
      resumeData.summary
    );

    set({ blocks: nextBlocks });
    setTimeout(() => get().saveHistory(), 0);
  },

  updateBlock: (id, patch) =>
    set((s) => {
      const boundField = Object.keys(BINDINGS).find((k) => BINDINGS[k] === id);
      const updatedBlocks = s.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b));

      setTimeout(() => get().saveHistory(), 0);

      if (boundField && typeof patch.content === "string") {
        return {
          blocks: updatedBlocks,
          resumeData: { ...s.resumeData, [boundField]: patch.content },
        };
      }

      return { blocks: updatedBlocks };
    }),

  updateBlockStyle: (id, stylePatch) =>
    set((s) => {
      setTimeout(() => get().saveHistory(), 0);
      
      return {
        blocks: s.blocks.map((b) =>
          b.id === id ? { ...b, style: { ...b.style, ...stylePatch } } : b
        ),
      };
    }),

  addBlock: (type) => {
    const { currentPageId } = get();
    const id = nanoid();
    const base = {
      id,
      type,
      pageId: currentPageId,
      x: 80,
      y: 400,
      w: type === "divider" ? 520 : 360,
      h: type === "divider" ? 18 : 70,
      style: {
        fontSize: type === "heading" ? 20 : 14,
        fontWeight: type === "heading" ? 700 : 400,
        color: "#111111",
        align: "left",
        lineHeight: 1.35,
      },
      content:
        type === "heading"
          ? "Section Heading"
          : type === "text"
          ? "Click to edit text"
          : type === "list"
          ? ["• Bullet one", "• Bullet two"]
          : "",
    };

    set((s) => {
      setTimeout(() => get().saveHistory(), 0);
      return { blocks: [...s.blocks, base], selectedId: id };
    });
  },

  moveResizeBlock: (id, { x, y, w, h }) => {
    const { pages, blocks } = get();
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    
    const page = pages.find(p => p.id === block.pageId);
    if (!page) return;
    
    const nx = clamp(x, 0, page.width - 20);
    const ny = clamp(y, 0, page.height - 20);
    const nw = clamp(w, 40, page.width);
    const nh = clamp(h, 18, page.height);

    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, x: nx, y: ny, w: nw, h: nh } : b)),
    }));
  },

  deleteSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    
    set((s) => {
      setTimeout(() => get().saveHistory(), 0);
      
      return {
        blocks: s.blocks.filter((b) => b.id !== selectedId),
        selectedId: null,
      };
    });
  },

  // COMPATIBILITY: Getter for old code that expects s.page
  get page() {
    const state = get();
    return state.pages.find(p => p.id === state.currentPageId) || state.pages[0];
  },

  // ============================================
  // TEMPLATE GENERATION
  // ============================================

  generateFromTemplate: (templateName) => {
    const { pages, resumeData, sections } = get();
    
    const PAGE_HEIGHT = 1123;
    const PAGE_MARGIN_TOP = 60;
    const PAGE_MARGIN_BOTTOM = 60;
    
    let generatedBlocks = [];
    let currentPageIndex = 0;
    let yOffset = PAGE_MARGIN_TOP;
    
    const getPageId = (index) => {
      if (index < pages.length) {
        return pages[index].id;
      }
      return `page-overflow-${index}`;
    };
    
    const addBlock = (block) => {
      const blockHeight = block.h;
      
      if (yOffset + blockHeight > PAGE_HEIGHT - PAGE_MARGIN_BOTTOM) {
        currentPageIndex++;
        yOffset = PAGE_MARGIN_TOP;
      }
      
      generatedBlocks.push({
        ...block,
        pageId: getPageId(currentPageIndex),
        y: yOffset
      });
      
      yOffset += blockHeight + (block.spacing || 0);
    };

    const addDivider = () => {
      addBlock({
        id: nanoid(),
        type: "divider",
        x: 60,
        w: 650,
        h: 1,
        spacing: 16,
        style: { color: "#d1d5db" },
        content: ""
      });
    };

    // HEADER SECTION
    addBlock({
      id: BINDINGS.fullName,
      type: "text",
      x: 60,
      w: 650,
      h: 55,
      spacing: 5,
      style: { fontSize: 32, fontWeight: 800, color: "#111827", align: "left", lineHeight: 1.15 },
      content: resumeData.fullName
    });

    addBlock({
      id: BINDINGS.headline,
      type: "text",
      x: 60,
      w: 650,
      h: 28,
      spacing: 7,
      style: { fontSize: 13, fontWeight: 600, color: "#374151", align: "left", lineHeight: 1.35 },
      content: resumeData.headline
    });

    // Contact Info Row
    const contactY = yOffset;
    addBlock({
      id: BINDINGS.email,
      type: "text",
      x: 60,
      w: 200,
      h: 22,
      spacing: 0,
      style: { fontSize: 11, fontWeight: 500, color: "#6b7280", align: "left", lineHeight: 1.35 },
      content: resumeData.email
    });
    
    yOffset = contactY;
    addBlock({
      id: BINDINGS.phone,
      type: "text",
      x: 270,
      w: 180,
      h: 22,
      spacing: 0,
      style: { fontSize: 11, fontWeight: 500, color: "#6b7280", align: "left", lineHeight: 1.35 },
      content: resumeData.phone
    });
    
    yOffset = contactY;
    addBlock({
      id: BINDINGS.location,
      type: "text",
      x: 460,
      w: 250,
      h: 22,
      spacing: 6,
      style: { fontSize: 11, fontWeight: 500, color: "#6b7280", align: "left", lineHeight: 1.35 },
      content: resumeData.location
    });

    // Links Row
    const linksY = yOffset;
    addBlock({
      id: BINDINGS.github,
      type: "text",
      x: 60,
      w: 200,
      h: 20,
      spacing: 0,
      style: { fontSize: 10, fontWeight: 400, color: "#0ea5e9", align: "left", lineHeight: 1.35 },
      content: resumeData.github
    });
    
    yOffset = linksY;
    addBlock({
      id: BINDINGS.linkedin,
      type: "text",
      x: 270,
      w: 220,
      h: 20,
      spacing: 0,
      style: { fontSize: 10, fontWeight: 400, color: "#0ea5e9", align: "left", lineHeight: 1.35 },
      content: resumeData.linkedin
    });
    
    yOffset = linksY;
    addBlock({
      id: BINDINGS.portfolio,
      type: "text",
      x: 500,
      w: 210,
      h: 20,
      spacing: 18,
      style: { fontSize: 10, fontWeight: 400, color: "#0ea5e9", align: "left", lineHeight: 1.35 },
      content: resumeData.portfolio
    });

    // SUMMARY SECTION
    addBlock({
      id: nanoid(),
      type: "heading",
      x: 60,
      w: 650,
      h: 30,
      spacing: 5,
      style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
      content: "SUMMARY"
    });

    addBlock({
      id: BINDINGS.summary,
      type: "text",
      x: 60,
      w: 650,
      h: 70,
      spacing: 12,
      style: { fontSize: 11, fontWeight: 400, color: "#374151", align: "left", lineHeight: 1.6 },
      content: resumeData.summary
    });

    addDivider();

    // EXPERIENCE SECTION
    if (sections.experience && sections.experience.length > 0) {
      addBlock({
        id: nanoid(),
        type: "heading",
        x: 60,
        w: 650,
        h: 30,
        spacing: 10,
        style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
        content: "EXPERIENCE"
      });

      sections.experience.forEach((exp) => {
        const expStartY = yOffset;
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 450,
          h: 24,
          spacing: 0,
          style: { fontSize: 13, fontWeight: 700, color: "#111827", align: "left", lineHeight: 1.3 },
          content: exp.position
        });

        yOffset = expStartY;
        addBlock({
          id: nanoid(),
          type: "text",
          x: 520,
          w: 190,
          h: 24,
          spacing: 2,
          style: { fontSize: 10, fontWeight: 600, color: "#6b7280", align: "right", lineHeight: 1.3 },
          content: `${exp.startDate} - ${exp.endDate}`
        });

        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 650,
          h: 20,
          spacing: 4,
          style: { fontSize: 11, fontWeight: 600, color: "#6b7280", align: "left", lineHeight: 1.3, fontStyle: "italic" },
          content: `${exp.company} • ${exp.location}`
        });

        const descLines = exp.description.split('\n').filter(l => l.trim()).length;
        const descHeight = Math.max(40, descLines * 17);
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 650,
          h: descHeight,
          spacing: 18,
          style: { fontSize: 10, fontWeight: 400, color: "#374151", align: "left", lineHeight: 1.6 },
          content: exp.description
        });
      });
      
      addDivider();
    }

    // SKILLS SECTION
    if (sections.skills && sections.skills.length > 0) {
      addBlock({
        id: nanoid(),
        type: "heading",
        x: 60,
        w: 650,
        h: 30,
        spacing: 8,
        style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
        content: "SKILLS"
      });

      sections.skills.forEach((skill) => {
        const skillY = yOffset;
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 140,
          h: 20,
          spacing: 0,
          style: { fontSize: 11, fontWeight: 700, color: "#111827", align: "left", lineHeight: 1.4 },
          content: `${skill.category}:`
        });

        yOffset = skillY;
        addBlock({
          id: nanoid(),
          type: "text",
          x: 210,
          w: 500,
          h: 20,
          spacing: 4,
          style: { fontSize: 11, fontWeight: 400, color: "#374151", align: "left", lineHeight: 1.4 },
          content: skill.items
        });
      });
      
      yOffset += 8;
      addDivider();
    }

    // EDUCATION SECTION
    if (sections.education && sections.education.length > 0) {
      addBlock({
        id: nanoid(),
        type: "heading",
        x: 60,
        w: 650,
        h: 30,
        spacing: 10,
        style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
        content: "EDUCATION"
      });

      sections.education.forEach((edu) => {
        const eduY = yOffset;
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 450,
          h: 24,
          spacing: 0,
          style: { fontSize: 12, fontWeight: 700, color: "#111827", align: "left", lineHeight: 1.3 },
          content: edu.degree
        });

        yOffset = eduY;
        addBlock({
          id: nanoid(),
          type: "text",
          x: 520,
          w: 190,
          h: 24,
          spacing: 2,
          style: { fontSize: 10, fontWeight: 600, color: "#6b7280", align: "right", lineHeight: 1.3 },
          content: `${edu.startDate} - ${edu.endDate}`
        });

        const instText = edu.gpa ? `${edu.institution} • GPA: ${edu.gpa}` : edu.institution;
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 650,
          h: 20,
          spacing: 10,
          style: { fontSize: 10, fontWeight: 500, color: "#6b7280", align: "left", lineHeight: 1.3, fontStyle: "italic" },
          content: instText
        });
      });
      
      addDivider();
    }

    // PROJECTS SECTION
    if (sections.projects && sections.projects.length > 0) {
      addBlock({
        id: nanoid(),
        type: "heading",
        x: 60,
        w: 650,
        h: 30,
        spacing: 8,
        style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
        content: "PROJECTS"
      });

      sections.projects.forEach((proj) => {
        const projY = yOffset;
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 550,
          h: 22,
          spacing: 0,
          style: { fontSize: 12, fontWeight: 700, color: "#111827", align: "left", lineHeight: 1.3 },
          content: proj.name
        });

        if (proj.link) {
          yOffset = projY;
          addBlock({
            id: nanoid(),
            type: "text",
            x: 620,
            w: 90,
            h: 22,
            spacing: 4,
            style: { fontSize: 9, fontWeight: 500, color: "#0ea5e9", align: "right", lineHeight: 1.3 },
            content: "Link"
          });
        } else {
          yOffset += 26;
        }

        if (proj.tech) {
          addBlock({
            id: nanoid(),
            type: "text",
            x: 60,
            w: 650,
            h: 18,
            spacing: 2,
            style: { fontSize: 9, fontWeight: 600, color: "#6b7280", align: "left", lineHeight: 1.3 },
            content: `Tech: ${proj.tech}`
          });
        }

        const descLines = proj.description.split('\n').filter(l => l.trim()).length;
        const descHeight = Math.max(32, descLines * 15);
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 650,
          h: descHeight,
          spacing: 16,
          style: { fontSize: 10, fontWeight: 400, color: "#374151", align: "left", lineHeight: 1.5 },
          content: proj.description
        });
      });
      
      addDivider();
    }

    // ACHIEVEMENTS SECTION
    if (sections.achievements && sections.achievements.length > 0) {
      addBlock({
        id: nanoid(),
        type: "heading",
        x: 60,
        w: 650,
        h: 30,
        spacing: 8,
        style: { fontSize: 16, fontWeight: 700, color: "#1a56db", align: "left", lineHeight: 1.3, letterSpacing: "0.5px" },
        content: "ACHIEVEMENTS"
      });

      sections.achievements.forEach((ach) => {
        addBlock({
          id: nanoid(),
          type: "text",
          x: 60,
          w: 650,
          h: 20,
          spacing: 2,
          style: { fontSize: 11, fontWeight: 700, color: "#111827", align: "left", lineHeight: 1.4 },
          content: `• ${ach.title}`
        });

        const descLines = ach.description.split('\n').filter(l => l.trim()).length;
        const descHeight = Math.max(28, descLines * 15);
        
        addBlock({
          id: nanoid(),
          type: "text",
          x: 75,
          w: 635,
          h: descHeight,
          spacing: 14,
          style: { fontSize: 10, fontWeight: 400, color: "#374151", align: "left", lineHeight: 1.5 },
          content: ach.description
        });
      });
    }
    
    // Create additional pages if needed
    const pagesNeeded = currentPageIndex + 1;
    const newPages = [...pages];
    
    for (let i = pages.length; i < pagesNeeded; i++) {
      newPages.push({
        id: `page-${nanoid()}`,
        width: 794,
        height: 1123,
      });
    }
    
    // Update page IDs for overflow blocks
    generatedBlocks = generatedBlocks.map(block => {
      if (block.pageId.startsWith('page-overflow-')) {
        const index = parseInt(block.pageId.split('-')[2]);
        return { ...block, pageId: newPages[index].id };
      }
      return block;
    });
    
    // Replace all blocks and update pages
    set((s) => {
      setTimeout(() => get().saveHistory(), 0);
      
      return { 
        pages: newPages,
        blocks: generatedBlocks,
        selectedId: null,
        currentPageId: newPages[0].id
      };
    });
  },
}));