import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FeedbackSchemaType } from "@/types/interview.type";
import Html from "react-pdf-html";
import { marked } from "marked";

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
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },

  // Score Section
  overallScoreContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    alignItems: "center",
  },
  scoreLarge: { fontSize: 36, fontWeight: "bold", color: "#2563eb" },
  scoreLabel: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
    marginTop: 4,
  },

  // Criteria Grid
  criteriaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  criteriaItem: {
    width: "48%",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    borderBottomStyle: "solid",
  },
  criteriaName: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  criteriaValue: { fontSize: 12, fontWeight: "bold" },

  // Feedback Blocks
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 6,
    color: "#111827",
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 6,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  strengthBox: {
    backgroundColor: "#f0fdf4",
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
    borderLeftStyle: "solid",
  },
  improveBox: {
    backgroundColor: "#fef2f2",
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
    borderLeftStyle: "solid",
  },

  // Suggested Answer (STAR) Container
  starContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },

  // Styles for Markdown Content
  htmlStyles: {
    p: { fontSize: 10, marginBottom: 6, lineHeight: 1.5, color: "#334155" },
    h1: { fontSize: 14, fontWeight: "bold", marginBottom: 8, marginTop: 10 },
    h2: { fontSize: 12, fontWeight: "bold", marginBottom: 6, marginTop: 8 },
    h3: { fontSize: 11, fontWeight: "bold", marginBottom: 4, marginTop: 6 },
    li: { fontSize: 10, marginBottom: 4 },
    ul: { marginBottom: 10, marginLeft: 10 },
    ol: { marginBottom: 10, marginLeft: 10 },
    strong: { fontWeight: "bold" },
    em: { fontStyle: "italic" },
  },
});

export const InterviewFeedbackPDF = ({
  data,
}: {
  data: FeedbackSchemaType;
}) => {
  // Convert markdown string to HTML for the renderer
  // We use synchronous parsing here
  const htmlContent = marked.parse(data.suggestedAnswer) as string;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Interview Performance Report</Text>
        </View>

        {/* Hero Score */}
        <View style={styles.overallScoreContainer}>
          <Text style={styles.scoreLarge}>{data.score} / 5</Text>
          <Text style={styles.scoreLabel}>Overall Performance Rating</Text>
        </View>

        {/* Breakdown Grid */}
        <View style={styles.criteriaGrid}>
          <View style={styles.criteriaItem}>
            <Text style={styles.criteriaName}>Structure</Text>
            <Text style={styles.criteriaValue}>
              {data.criteriaScores.structure} / 5
            </Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.criteriaName}>Content</Text>
            <Text style={styles.criteriaValue}>
              {data.criteriaScores.content} / 5
            </Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.criteriaName}>Communication</Text>
            <Text style={styles.criteriaValue}>
              {data.criteriaScores.communication} / 5
            </Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.criteriaName}>Technical Accuracy</Text>
            <Text style={styles.criteriaValue}>
              {data.criteriaScores.technicalAccuracy} / 5
            </Text>
          </View>
        </View>

        {/* Feedback Sections */}
        <Text style={styles.heading}>Key Strengths</Text>
        <View style={[styles.feedbackBox, styles.strengthBox]}>
          <Text>{data.strengths}</Text>
        </View>

        <Text style={styles.heading}>Areas for Improvement</Text>
        <View style={[styles.feedbackBox, styles.improveBox]}>
          <Text>{data.areasToImprove}</Text>
        </View>

        {/* Suggested Answer with HTML/Markdown rendering */}
        <View break>
          <Text style={styles.heading}>Model STAR Response</Text>
          <View style={styles.starContainer}>
            <Html stylesheet={styles.htmlStyles}>{htmlContent}</Html>
          </View>
        </View>
      </Page>
    </Document>
  );
};
