import { useEditorStore } from "../store/editorStore";
import { memo, useCallback, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

/** ✅ Add https:// if user didn't type it */
const formatUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/** ✅ Basic field component (now supports link preview) */
const FormField = memo(
  ({ label, value, placeholder, onChangeText, rows, isLinkPreview = false }) => {
    const safeValue = value || "";
    const href = isLinkPreview ? formatUrl(safeValue) : "";

    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-400 mb-1">
          {label}
        </label>

        {rows ? (
          <textarea
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 resize-none"
            value={safeValue}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder}
            rows={rows}
          />
        ) : (
          <input
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
            value={safeValue}
            placeholder={placeholder}
            onChange={(e) => onChangeText(e.target.value)}
          />
        )}

        {/* ✅ Clickable link preview — plain <a> works now that Section uses div not button */}
        {isLinkPreview && safeValue.trim() && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-400 hover:text-blue-300 underline break-all cursor-pointer mt-1"
          >
            Open: {safeValue}
          </a>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// ✅ Collapsible Section — uses div+role instead of <button> to avoid
// invalid HTML nesting (interactive elements inside <button> breaks clicks in Edge/Chrome)
const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-950">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer select-none"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      {isOpen && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  );
};

// ✅ Experience Item
const ExperienceItem = memo(({ item, onUpdate, onDelete }) => {
  return (
    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <input
          className="flex-1 px-2 py-1.5 text-sm font-medium bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={item.position}
          onChange={(e) => onUpdate({ position: e.target.value })}
          placeholder="Position"
        />
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <input
        className="w-full px-2 py-1.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.company}
        onChange={(e) => onUpdate({ company: e.target.value })}
        placeholder="Company"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          className="px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={item.startDate}
          onChange={(e) => onUpdate({ startDate: e.target.value })}
          placeholder="Start (Jan 2022)"
        />
        <input
          className="px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={item.endDate}
          onChange={(e) => onUpdate({ endDate: e.target.value })}
          placeholder="End (Present)"
        />
      </div>
      <input
        className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.location}
        onChange={(e) => onUpdate({ location: e.target.value })}
        placeholder="Location"
      />
      <textarea
        className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700 resize-none"
        value={item.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder={"• Achievement 1\n• Achievement 2"}
        rows={3}
      />
    </div>
  );
});
ExperienceItem.displayName = "ExperienceItem";

// ✅ Skill Item
const SkillItem = memo(({ item, onUpdate, onDelete }) => (
  <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
    <div className="flex items-center gap-2">
      <input
        className="flex-1 px-2 py-1.5 text-sm font-medium bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.category}
        onChange={(e) => onUpdate({ category: e.target.value })}
        placeholder="Category (e.g., Backend)"
      />
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <input
      className="w-full px-2 py-1.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
      value={item.items}
      onChange={(e) => onUpdate({ items: e.target.value })}
      placeholder="Node.js, Express, MongoDB..."
    />
  </div>
));
SkillItem.displayName = "SkillItem";

// ✅ Education Item
const EducationItem = memo(({ item, onUpdate, onDelete }) => (
  <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
    <div className="flex items-start gap-2">
      <input
        className="flex-1 px-2 py-1.5 text-sm font-medium bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.degree}
        onChange={(e) => onUpdate({ degree: e.target.value })}
        placeholder="Degree"
      />
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <input
      className="w-full px-2 py-1.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
      value={item.institution}
      onChange={(e) => onUpdate({ institution: e.target.value })}
      placeholder="Institution"
    />
    <div className="grid grid-cols-3 gap-2">
      <input
        className="px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.startDate}
        onChange={(e) => onUpdate({ startDate: e.target.value })}
        placeholder="2018"
      />
      <input
        className="px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.endDate}
        onChange={(e) => onUpdate({ endDate: e.target.value })}
        placeholder="2022"
      />
      <input
        className="px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.gpa || ""}
        onChange={(e) => onUpdate({ gpa: e.target.value })}
        placeholder="GPA"
      />
    </div>
  </div>
));
EducationItem.displayName = "EducationItem";

// ✅ Achievement Item
const AchievementItem = memo(({ item, onUpdate, onDelete }) => (
  <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
    <div className="flex items-center gap-2">
      <input
        className="flex-1 px-2 py-1.5 text-sm font-medium bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Achievement Title"
      />
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <textarea
      className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700 resize-none"
      value={item.description}
      onChange={(e) => onUpdate({ description: e.target.value })}
      placeholder="Description..."
      rows={2}
    />
  </div>
));
AchievementItem.displayName = "AchievementItem";

// ✅ Project Item with clickable link
const ProjectItem = memo(({ item, onUpdate, onDelete }) => {
  const href = formatUrl(item.link || "");

  return (
    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-2 py-1.5 text-sm font-medium bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Project Name"
        />
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* ✅ Link input + clickable preview */}
      <div className="space-y-1">
        <input
          className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={item.link || ""}
          onChange={(e) => onUpdate({ link: e.target.value })}
          placeholder="Link (optional) - e.g., github.com/user/project"
        />
        {/* ✅ Plain <a> — works correctly now that Section no longer uses <button> */}
        {item.link?.trim() && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-400 hover:text-blue-300 underline break-all cursor-pointer"
          >
            Open: {item.link}
          </a>
        )}
      </div>

      <input
        className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
        value={item.tech || ""}
        onChange={(e) => onUpdate({ tech: e.target.value })}
        placeholder="Tech Stack"
      />
      <textarea
        className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700 resize-none"
        value={item.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Project description..."
        rows={2}
      />
    </div>
  );
});
ProjectItem.displayName = "ProjectItem";

// ✅ Main Form Component
export default function ResumeForm() {
  // Basic info
  const fullName = useEditorStore((s) => s.resumeData.fullName);
  const headline = useEditorStore((s) => s.resumeData.headline);
  const email = useEditorStore((s) => s.resumeData.email);
  const phone = useEditorStore((s) => s.resumeData.phone);
  const location = useEditorStore((s) => s.resumeData.location);
  const summary = useEditorStore((s) => s.resumeData.summary);
  const github = useEditorStore((s) => s.resumeData.github);
  const linkedin = useEditorStore((s) => s.resumeData.linkedin);
  const portfolio = useEditorStore((s) => s.resumeData.portfolio);

  // Sections
  const experience = useEditorStore((s) => s.sections.experience);
  const skills = useEditorStore((s) => s.sections.skills);
  const education = useEditorStore((s) => s.sections.education);
  const achievements = useEditorStore((s) => s.sections.achievements);
  const projects = useEditorStore((s) => s.sections.projects);

  // Actions
  const setField = useEditorStore((s) => s.setResumeField);
  const addSectionItem = useEditorStore((s) => s.addSectionItem);
  const updateSectionItem = useEditorStore((s) => s.updateSectionItem);
  const deleteSectionItem = useEditorStore((s) => s.deleteSectionItem);

  // Callbacks for basic info
  const handleFullName = useCallback((val) => setField("fullName", val), [setField]);
  const handleHeadline = useCallback((val) => setField("headline", val), [setField]);
  const handleEmail = useCallback((val) => setField("email", val), [setField]);
  const handlePhone = useCallback((val) => setField("phone", val), [setField]);
  const handleLocation = useCallback((val) => setField("location", val), [setField]);
  const handleSummary = useCallback((val) => setField("summary", val), [setField]);
  const handleGithub = useCallback((val) => setField("github", val), [setField]);
  const handleLinkedin = useCallback((val) => setField("linkedin", val), [setField]);
  const handlePortfolio = useCallback((val) => setField("portfolio", val), [setField]);

  return (
    <div className="space-y-3 max-h-full overflow-y-auto pr-1">
      {/* Basic Info Section */}
      <Section title="📝 Basic Info" defaultOpen={true}>
        <FormField
          label="Full name"
          value={fullName || ""}
          placeholder="Naina Kothari"
          onChangeText={handleFullName}
        />
        <FormField
          label="Headline"
          value={headline || ""}
          placeholder="MERN | Backend | WebRTC"
          onChangeText={handleHeadline}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Email"
            value={email || ""}
            placeholder="naina@email.com"
            onChangeText={handleEmail}
          />
          <FormField
            label="Phone"
            value={phone || ""}
            placeholder="+91..."
            onChangeText={handlePhone}
          />
        </div>
        <FormField
          label="Location"
          value={location || ""}
          placeholder="Mumbai, India"
          onChangeText={handleLocation}
        />
        <FormField
          label="Summary"
          value={summary || ""}
          placeholder="Brief professional summary..."
          onChangeText={handleSummary}
          rows={3}
        />
      </Section>

      {/* Links Section */}
      <Section title="🔗 Links">
        <FormField
          label="GitHub"
          value={github || ""}
          placeholder="github.com/username"
          onChangeText={handleGithub}
          isLinkPreview
        />
        <FormField
          label="LinkedIn"
          value={linkedin || ""}
          placeholder="linkedin.com/in/username"
          onChangeText={handleLinkedin}
          isLinkPreview
        />
        <FormField
          label="Portfolio"
          value={portfolio || ""}
          placeholder="yourwebsite.com"
          onChangeText={handlePortfolio}
          isLinkPreview
        />
      </Section>

      {/* Experience Section */}
      <Section title="💼 Experience">
        <div className="space-y-2">
          {experience?.map((item) => (
            <ExperienceItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateSectionItem("experience", item.id, updates)}
              onDelete={() => deleteSectionItem("experience", item.id)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              addSectionItem("experience", {
                company: "Company Name",
                position: "Position",
                location: "Location",
                startDate: "Jan 2023",
                endDate: "Present",
                description: "• Achievement 1\n• Achievement 2",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-200 transition-colors"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>
      </Section>

      {/* Skills Section */}
      <Section title="🛠️ Skills">
        <div className="space-y-2">
          {skills?.map((item) => (
            <SkillItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateSectionItem("skills", item.id, updates)}
              onDelete={() => deleteSectionItem("skills", item.id)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              addSectionItem("skills", {
                category: "Category",
                items: "Skill 1, Skill 2, Skill 3",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-200 transition-colors"
          >
            <Plus size={16} />
            Add Skill Category
          </button>
        </div>
      </Section>

      {/* Education Section */}
      <Section title="🎓 Education">
        <div className="space-y-2">
          {education?.map((item) => (
            <EducationItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateSectionItem("education", item.id, updates)}
              onDelete={() => deleteSectionItem("education", item.id)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              addSectionItem("education", {
                institution: "University Name",
                degree: "B.Tech in Computer Science",
                location: "City, Country",
                startDate: "2018",
                endDate: "2022",
                gpa: "8.5/10",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-200 transition-colors"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>
      </Section>

      {/* Projects Section */}
      <Section title="🚀 Projects">
        <div className="space-y-2">
          {projects?.map((item) => (
            <ProjectItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateSectionItem("projects", item.id, updates)}
              onDelete={() => deleteSectionItem("projects", item.id)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              addSectionItem("projects", {
                name: "Project Name",
                link: "",
                tech: "Tech Stack",
                description: "Project description...",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-200 transition-colors"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
      </Section>

      {/* Achievements Section */}
      <Section title="🏆 Achievements">
        <div className="space-y-2">
          {achievements?.map((item) => (
            <AchievementItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateSectionItem("achievements", item.id, updates)}
              onDelete={() => deleteSectionItem("achievements", item.id)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              addSectionItem("achievements", {
                title: "Achievement Title",
                description: "Achievement description...",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-200 transition-colors"
          >
            <Plus size={16} />
            Add Achievement
          </button>
        </div>
      </Section>

      {/* Info Tip */}
      <div className="text-xs text-neutral-500 bg-neutral-900 rounded-lg p-3 border border-neutral-800">
        💡 After filling the form, manually arrange sections on the canvas for your desired layout.
      </div>
    </div>
  );
}