import { z } from "zod";

// JSON schema
export const ParseResumeResponse = {
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



// zod schema
export const ParseResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().nullable().optional(),
    email: z.email().nullable().optional(),
    phone: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    linkedin: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
  }).nullable().optional(),

  workExperience: z.array(
    z.object({
      company: z.string().nullable().optional(),
      role: z.string().nullable().optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
    })
  ).nullable().optional(),

  education: z.array(
    z.object({
      institution: z.string().nullable().optional(),
      degree: z.string().nullable().optional(),
      fieldOfStudy: z.string().nullable().optional(),
      graduationDate: z.string().nullable().optional(),
    })
  ).nullable().optional(),

  skills: z.array(z.string()).nullable().optional(),

  projects: z.array(
    z.object({
      name: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      link: z.string().nullable().optional(),
    })
  ).nullable().optional(),
});

export type ParseResumeResponseType = typeof ParseResumeResponse;

//  for form state
export type ParseResumeSchemaType = z.infer<typeof ParseResumeSchema>;