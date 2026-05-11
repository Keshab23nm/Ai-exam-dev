import Exam from "../models/exam.js";

export const createExamFromPrompt = async (req, res) => {
  try {
    const { promptInput, prompt } = req.body;
    const actualInput = promptInput || prompt;

    console.log("Backend received prompt:", actualInput);

    if (!actualInput) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    //: PARSE INPUT
    const parsePrompt = `
Extract the following fields from the sentence:
- title
- subject
- class
- duration (number only, in minutes)
- difficulty (easy/medium/hard)
- numberOfQuestions

Sentence: "${actualInput}"

Return ONLY JSON:
{
  "title": "",
  "subject": "",
  "class": "",
  "duration": 0,
  "difficulty": "",
  "numberOfQuestions": 0
}
`;

    const parseResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: parsePrompt }] }],
        }),
      }
    );

    const parseData = await parseResponse.json();

    let parsedText =
      parseData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔥 CLEAN JSON
    parsedText = parsedText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedData;

    try {
      parsedData = JSON.parse(parsedText);
    } catch (err) {
      return res.status(500).json({
        message: "Parsing failed",
        raw: parsedText,
      });
    }

    const {
      title,
      subject,
      class: examClass,
      duration,
      difficulty,
      numberOfQuestions,
    } = parsedData;

    const finalTitle =
      title || `${examClass || "General"} ${subject || "Exam"} Test`;

    //  GENERATE QUESTIONS
    const questionPrompt = `
Generate ${numberOfQuestions || 10} ${difficulty || "medium"} level MCQ questions 
for ${examClass || "General"} ${subject || "General"}.

IMPORTANT:
- Return ONLY raw JSON
- No markdown
- No explanation

Format:
[
  {
    "question": "",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": ""
  }
]
`;

    const questionResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: questionPrompt }] }],
        }),
      }
    );

    const questionData = await questionResponse.json();

    let qText =
      questionData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    //  CLEAN JSON
    qText = qText.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Raw AI Question Response:", qText);

    let questions;

    try {
      questions = JSON.parse(qText);
    } catch (err) {
      return res.status(500).json({
        message: "Question generation failed",
        raw: qText,
      });
    }

    // : SAVE EXAM
    const exam = await Exam.create({
      title: finalTitle,
      subject: subject || "General",
      class: examClass || "General",
      duration: duration || 30,
      difficulty: difficulty || "medium",
      numberOfQuestions: numberOfQuestions || questions.length,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";
// export const createExamFromPrompt = async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: "Say hello" }],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// export const createExamFromPrompt = async (req, res) => {
//   try {
//     const { promptInput } = req.body;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: promptInput }],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     console.log("FULL AI RESPONSE:", data); // 🔥 debug

//     res.status(200).json(data);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// export const createExamFromPrompt = async (req, res) => {
//   try {
//     const { promptInput } = req.body;

// const aiPrompt = `
// ${promptInput}

// IMPORTANT:
// - Return ONLY raw JSON
// - Do NOT use markdown (no \`\`\`)
// - Do NOT add explanation

// Format:
// [
//   {
//     "question": "",
//     "options": ["", "", "", ""],
//     "correctAnswer": ""
//   }
// ]
// `;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: aiPrompt }],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     console.log("AI RESPONSE:", data);

//     // 🧠 Extract text
//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

//     let questions;
//     try {
//       questions = JSON.parse(text);
//     } catch (err) {
//       return res.status(500).json({
//         message: "AI did not return valid JSON",
//         raw: text,
//       });
//     }

//     res.json({
//       message: "Questions generated successfully",
//       questions,
//     });  

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };