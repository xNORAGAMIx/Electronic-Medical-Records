// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import {
  Syringe,
  User,
  Stethoscope,
  Award,
  Activity,
  Calendar,
  Home,
  Printer,
  Mail,
  Info,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const Generate = () => {
  // form states
  const [patientAddress, setPatientAddress] = useState("");
  const [remarks, setRemarks] = useState("");

  // redux states
  const { account } = useSelector((state) => state.user);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Donation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-cyan-50 mr-4">
                  <Stethoscope className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Prescription Form
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Register new blood donations in the system
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              {/* Patient Address Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition overflow-x-auto whitespace-nowrap"
                    placeholder="Patient Wallet Address"
                    required
                  />
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <Syringe className="h-5 w-5 text-gray-400 mt-1" />
                  </div>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-y overflow-auto"
                    placeholder="Medicine"
                    required
                  />
                </div>
              </div>

              {/* Doctor Address Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={account}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start text-sm text-gray-500">
                <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                <p>
                  All fields marked with <span className="text-red-500">*</span>{" "}
                  are required. Please ensure patient details are accurate.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full "
        >
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-cyan-900 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Patient Prescription PDF
              </h2>
            </div>

            <div className="border-2 border-cyan-200 rounded-lg p-6 bg-gradient-to-br from-cyan-50 to-white relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 z-0">
                <Stethoscope className="w-64 h-64 text-cyan-300" />
              </div>

              <div className="relative z-10">
                {/* Certificate Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-cyan-900 uppercase tracking-wide">
                    Prescription
                  </h3>
                  <p className="text-gray-600 mt-2 italic">
                    Valid only for 24HRS to pharmacy
                  </p>
                  <div className="w-24 h-1 bg-cyan-900 mx-auto mt-3 rounded-full"></div>
                </div>

                {/* Certificate Body */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2" /> Patient:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {patientAddress}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium text-gray-700 flex items-center">
                      <Activity className="w-4 h-4 mr-2" /> Remarks:
                    </span>
                    <span className="text-gray-900 font-medium">{remarks}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium text-gray-700 flex items-center">
                      <Home className="w-4 h-4 mr-2" /> Doctor:
                    </span>
                    <span className="text-gray-900 font-medium">{account}</span>
                  </div>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Date:
                  </span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Certificate Footer */}
                <div className="mt-8 text-center">
                  <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                    <div className="inline-block px-8">
                      <p className="text-xs text-gray-500 mb-1">
                        Authorized Signature
                      </p>
                      <div className="h-0.5 w-24 bg-gray-400 mx-auto mb-1"></div>
                      <p className="text-xs text-gray-600">Hospital Director</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <PDFDownloadLink
                      document={
                        <CertificatePDF
                          patientAddress={patientAddress}
                          remarks={remarks}
                          account={account}
                        />
                      }
                      fileName="prescription.pdf"
                      className="flex items-center text-sm bg-white border border-cyan-300 text-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-50 transition"
                    >
                      Download &nbsp; <Printer className="w-4 h-4 mr-2" />
                    </PDFDownloadLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Generate;

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#fff",
  },
  container: {
    border: "2px solid #a5f3fc",
    borderRadius: 8,
    padding: 30,
    position: "relative",
    backgroundColor: "#ecfeff",
  },
  watermark: {
    position: "absolute",
    opacity: 0.1,
    top: "90%",
    left: "13%",
    transform: "translate(-50%, -50%)",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    fontStyle: "italic",
    marginBottom: 12,
  },
  divider: {
    width: 96,
    height: 2,
    backgroundColor: "#67e8f9",
    marginHorizontal: "auto",
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "medium",
    color: "#374151",
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    fontWeight: "medium",
    color: "#111827",
  },
  bloodGroup: {
    fontSize: 12,
    fontWeight: "semibold",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quote: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  signature: {
    borderTop: "1px dashed #d1d5db",
    paddingTop: 16,
    marginTop: 32,
  },
  signatureText: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  signatureLine: {
    width: 96,
    height: 1,
    backgroundColor: "#9ca3af",
    marginHorizontal: "auto",
    marginBottom: 4,
  },
});

// PDF Document Component
const CertificatePDF = ({ patientAddress, remarks, account }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Watermark - Note: You'll need to provide a base64 encoded image */}
        <View style={styles.watermark}>
          <Text style={{ fontSize: 20, color: "#000000" }}>{account}</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Presciption</Text>
          <Text style={styles.subtitle}>Valid only for 24HRS to pharmacy</Text>
          <View style={styles.divider} />
        </View>

        <View>
          <View style={styles.row}>
            <View style={styles.label}>
              <Text>Patient:</Text>
            </View>
            <Text style={styles.value}>{patientAddress}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.label}>
              <Text>Remarks:</Text>
            </View>
            <Text style={styles.value}>{remarks}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.label}>
              <Text>Doctor:</Text>
            </View>
            <Text style={styles.value}>{account}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.label}>
            <Text>Date:</Text>
          </View>
          <Text style={styles.value}>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View>
          <View style={styles.signature}>
            <View style={{ textAlign: "center" }}>
              <Text style={styles.signatureText}>Authorized Signature</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
