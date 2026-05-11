import PDFDocument from "pdfkit";
import fs from "fs";
import { config } from "../config/config.js";
import pdfModel from "../models/pdfModel.js";
import ImageKit from "imagekit";
import { calculateResult } from "../utils/calculateResult.js";

const imagekit = new ImageKit({
  publicKey: config.publicKey,
  privateKey: config.privateKey,
  urlEndpoint: config.urlEndpoint
});

export const generatePDF = async (req, res) => {
  try {
    const { name, studentClass, obtained, total, studentId, examId, subject } = req.body;

    const result = calculateResult(obtained, total);
    // Check if PDF already exists for this student and exam
    const existingPdf = await pdfModel.findOne({ studentId, examId, iscreated: true });

    if(existingPdf && existingPdf.iscreated){
      return res.status(200).json({ success: false, message: "PDF already created for this student and exam" });
    }

    const dirPath = "./public/pdfs";
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = `${dirPath}/result_${name}.pdf`;

    const doc = new PDFDocument({ margin: 0 }); // Remove default margins that cause page breaks
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // PDF Content (Professional Marksheet Design)
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // 1. Outer Border
    doc.lineWidth(2).rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();
    doc.lineWidth(1); // Reset line width to default

    // 2. School Header
    doc.font("Helvetica-Bold").fontSize(24).text("ABC INTERNATIONAL SCHOOL", 0, 50, { align: "center" });
    doc.font("Helvetica").fontSize(10).text("123 Education Lane, Learning City, State 12345", { align: "center" });
    doc.text("Phone: (555) 123-4567 | Email: support@abcschool.com", { align: "center" });

    // Separator line under header
    doc.moveTo(40, 100).lineTo(pageWidth - 40, 100).stroke();

    // Marksheet Title
    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(18).text("OFFICIAL MARKSHEET", { align: "center", underline: true });
    
    // 3. Student Details Box
    doc.rect(50, 160, pageWidth - 100, 60).stroke();
    
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Student Name:", 70, 175);
    doc.font("Helvetica").text(name, 170, 175);
    
    doc.font("Helvetica-Bold").text("Class:", 350, 175);
    doc.font("Helvetica").text(studentClass, 400, 175);

    doc.font("Helvetica-Bold").text("Roll / ID:", 70, 195);
    doc.font("Helvetica").text(studentId.toString().slice(-6).toUpperCase(), 170, 195);

    const formattedDate = new Date().toLocaleDateString();
    doc.font("Helvetica-Bold").text("Date:", 350, 195);
    doc.font("Helvetica").text(formattedDate, 400, 195);

    // 4. Marks Table
    const tableTop = 250;
    
    // Table Header Row (grey background)
    doc.rect(50, tableTop, pageWidth - 100, 30).fillAndStroke("#f0f0f0", "#000");
    
    // Table Header Text
    doc.fillColor("#000").font("Helvetica-Bold");
    doc.text("Subject / Description", 70, tableTop + 10);
    doc.text("Total Marks", 250, tableTop + 10);
    doc.text("Marks Obtained", 350, tableTop + 10);
    doc.text("Percentage", 470, tableTop + 10);

    // Table Content Row
    doc.rect(50, tableTop + 30, pageWidth - 100, 30).stroke();
    
    doc.font("Helvetica");
    doc.text(subject || "Main Examination", 70, tableTop + 40);
    doc.text(total.toString(), 250, tableTop + 40);
    doc.text(obtained.toString(), 350, tableTop + 40);
    doc.text(`${result.percentage}%`, 470, tableTop + 40);

    // Vertical Lines for the Table Structure
    doc.moveTo(230, tableTop).lineTo(230, tableTop + 60).stroke();
    doc.moveTo(330, tableTop).lineTo(330, tableTop + 60).stroke();
    doc.moveTo(450, tableTop).lineTo(450, tableTop + 60).stroke();

    // 5. Final Result Summary Box
    doc.rect(50, 340, pageWidth - 100, 80).stroke();
    
    doc.font("Helvetica-Bold").fontSize(14);
    doc.text("Final Grade:", 70, 360);
    doc.font("Helvetica").text(result.grade, 170, 360);

    const passStatus = result.pass ? "PASS" : "FAIL";
    const statusColor = result.pass ? "green" : "red";

    doc.fillColor("#000").font("Helvetica-Bold");
    doc.text("Result Status:", 70, 390);
    doc.fillColor(statusColor).font("Helvetica-Bold").text(passStatus, 180, 390);

    // 6. Signatures Section at the Bottom
    doc.fillColor("#000").font("Helvetica").fontSize(12);
    
    // doc.moveTo(70, pageHeight - 110).lineTo(200, pageHeight - 110).stroke();
    // doc.text("Class Teacher", 90, pageHeight - 100);

    // doc.moveTo(pageWidth - 200, pageHeight - 110).lineTo(pageWidth - 70, pageHeight - 110).stroke();
    // doc.text("Principal's Signature", pageWidth - 190, pageHeight - 100);

    // Footer Note
    doc.fontSize(9).fillColor("grey").text("This is an electronically generated document. No physical signature is required.", 0, pageHeight - 40, { align: "center" });

    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", async () => {
        try {
          const fileBuffer = fs.readFileSync(filePath);

          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: `result_${name}.pdf`,
            folder: "/results",
          });

          const pdfUrl = response.url;

          // Save in DB
          await pdfModel.create({
            studentId,
            examId,
            name,
            subject,
            studentClass,
            obtained,
            total,
            percentage: result.percentage,
            grade: result.grade,
            pdfUrl,
            iscreated: true
          });

          res.json({
            message: "PDF generated & uploaded",
            pdfUrl,
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      stream.on("error", reject);
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};