export const ResumeSchema = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      nullable: true,
      properties: {
        fullName: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
        phone: { type: "string", nullable: true },
        location: { type: "string", nullable: true },
        linkedin: { type: "string", nullable: true },
        website: { type: "string", nullable: true }
      }
      // Removed required: ["fullName", "email"]
    },
    workExperience: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        properties: {
          company: { type: "string", nullable: true },
          role: { type: "string", nullable: true },
          startDate: { type: "string", nullable: true },
          endDate: { type: "string", nullable: true },
          description: { type: "string", nullable: true }
        }
      }
    },
    education: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        properties: {
          institution: { type: "string", nullable: true },
          degree: { type: "string", nullable: true },
          fieldOfStudy: { type: "string", nullable: true },
          graduationDate: { type: "string", nullable: true }
        }
      }
    },
    skills: {
      type: "array",
      nullable: true,
      items: { type: "string" }
    },
    projects: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        properties: {
          name: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          link: { type: "string", nullable: true }
        }
      }
    }
  }
  // No global required array either
};