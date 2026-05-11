import React from 'react';

const QuestionCard = ({ q, onAnswer, currentAnswer }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white mb-4">
      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 leading-snug">{q.question}</h4>

      <div className="space-y-2 sm:space-y-3">
        {q.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center p-3 sm:p-4 border rounded-xl cursor-pointer transition-colors select-none touch-manipulation ${
              currentAnswer === opt
                ? 'bg-blue-50 border-blue-500 shadow-sm'
                : 'hover:bg-gray-50 border-gray-200 active:bg-gray-100'
            }`}
          >
            <input
              type="radio"
              name={`question-${q._id}`}
              value={opt}
              checked={currentAnswer === opt}
              onChange={() => onAnswer(q._id, opt)}
              className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
            />
            <span className="text-gray-700 text-sm sm:text-base">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;