import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { SkillGapAnalysisSchemaType } from "@/schema/gaps.schema";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  summary: { fontSize: 11, color: "#4b5563", marginTop: 8, lineHeight: 1.4 },

  // Skills Grid
  grid: { flexDirection: "row", gap: 10, marginBottom: 20 },
  column: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
  },
  colTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  skillTag: { fontSize: 9, marginBottom: 2 },

  // Roadmap Items
  roadmapTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    borderBottomStyle: "solid",
    paddingBottom: 5,
  },
  card: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f3f4f6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillName: { fontSize: 14, fontWeight: "bold" },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  sectionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  projectBox: {
    backgroundColor: "#fffbeb",
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    borderLeftStyle: "solid",
  },
});

export const GapAnalysisPDF = ({
  data,
}: {
  data: SkillGapAnalysisSchemaType;
}) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Skill Gap Analysis Report</Text>
        <Text style={styles.summary}>{data.analysis_summary}</Text>
        <Text style={{ marginTop: 10, fontWeight: "bold", color: "#2563eb" }}>
          Match Score: {data.match_score}
        </Text>
      </View>

      {/* Skills Analysis Grid */}
      <View style={styles.grid}>
        <View
          style={[
            styles.column,
            { borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" },
          ]}
        >
          <Text style={[styles.colTitle, { color: "#166534" }]}>
            Matched Skills
          </Text>
          {data.skills_analysis.matched.map((s, i) => (
            <Text key={i} style={styles.skillTag}>
              • {s}
            </Text>
          ))}
        </View>
        <View
          style={[
            styles.column,
            { borderColor: "#fecaca", backgroundColor: "#fef2f2" },
          ]}
        >
          <Text style={[styles.colTitle, { color: "#991b1b" }]}>
            Missing Skills
          </Text>
          {data.skills_analysis.missing.map((s, i) => (
            <Text key={i} style={styles.skillTag}>
              • {s}
            </Text>
          ))}
        </View>
      </View>

      {/* Roadmap */}
      <Text style={styles.roadmapTitle}>Personalized Learning Roadmap</Text>
      {data.learning_roadmap.map((item, i) => (
        <View key={i} style={styles.card} wrap={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.skillName}>{item.skill_name}</Text>
            <Text
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.priority === "High" ? "#fee2e2" : "#dbeafe",
                  color: item.priority === "High" ? "#991b1b" : "#1e40af",
                },
              ]}
            >
              {item.priority} Priority
            </Text>
          </View>

          <Text style={{ fontSize: 9, color: "#6b7280", marginBottom: 5 }}>
            Path: {item.learning_path} | Time: {item.estimated_time}
          </Text>

          <Text style={styles.sectionLabel}>Recommended Resources</Text>
          {item.recommended_resources.map((res, idx) => (
            <Text key={idx} style={{ fontSize: 9, marginBottom: 2 }}>
              - {res}
            </Text>
          ))}

          <Text style={styles.sectionLabel}>Practice Project</Text>
          <View style={styles.projectBox}>
            <Text style={{ fontSize: 9, color: "#92400e" }}>
              {item.practice_project}
            </Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);
