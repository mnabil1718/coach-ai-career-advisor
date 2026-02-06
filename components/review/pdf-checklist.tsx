import { AnalysisSchemaType } from "@/schema/analysis.schema";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11 },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  score: { fontSize: 32, color: "#2563eb", marginVertical: 10 },
  card: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#cbd5e1",
    borderRadius: 4,
  },
  priorityHigh: { color: "#dc2626", fontWeight: "bold", fontSize: 9 },
  codeBox: {
    backgroundColor: "#f9fafb",
    padding: 8,
    marginTop: 5,
    borderRadius: 2,
  },
  label: { fontSize: 9, color: "#6b7280", textTransform: "uppercase" },
});

export const CVChecklistPDF = ({ data }: { data: AnalysisSchemaType }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CV Improvement Checklist</Text>
        <Text style={styles.score}>{data.overallScore}/10</Text>
      </View>

      {/* Recommendations Loop */}
      {data.recommendations.map((item, i) => (
        <View key={i} style={styles.card} wrap={false}>
          <Text style={styles.priorityHigh}>
            {item.priority} PRIORITY • {item.category}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginVertical: 4 }}>
            {item.title}
          </Text>
          <Text style={{ color: "#4b5563", marginBottom: 8 }}>
            {item.feedback}
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.label}>Before:</Text>
            <Text style={{ color: "#991b1b", marginBottom: 4 }}>
              {item.before}
            </Text>
            <Text style={styles.label}>After (Suggested):</Text>
            <Text style={{ color: "#166534" }}>{item.after}</Text>
          </View>

          <Text style={{ marginTop: 8, fontWeight: "bold" }}>
            Action: {item.actionItem}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);
