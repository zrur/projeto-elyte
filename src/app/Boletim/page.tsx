'use client'
import React, { useState, useEffect } from "react";

// Componente de InputField
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div className="mb-6">
    <label htmlFor={label} className="block text-sm font-semibold text-blue-700 mb-2">{label}</label>
    <input
      id={label}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105"
      placeholder={placeholder}
    />
  </div>
);

const Boletim: React.FC = () => {
  const [evaluationPeriod, setEvaluationPeriod] = useState("semestre");
  const [grades, setGrades] = useState<{ grade: string, weight: string }[]>([]);
  const [average, setAverage] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset grades and weights when changing the evaluation period
    const numPeriods = getNumberOfPeriods(evaluationPeriod);
    setGrades(new Array(numPeriods).fill({ grade: "", weight: "" }));
  }, [evaluationPeriod]);

  const getNumberOfPeriods = (period: string) => {
    if (period === "semestre") {
      return 2; // 2 médias por semestre
    }
    if (period === "bimestre") {
      return 4; // 4 médias por bimestre
    }
    return 3; // 3 médias por trimestre
  };

  // Função para atualizar as médias
  const handleGradeChange = (index: number, value: string) => {
    const newGrades = [...grades]; // Cria uma cópia do array grades
    newGrades[index] = { ...newGrades[index], grade: value || "0" }; // Atualiza apenas o índice desejado
    setGrades(newGrades); // Atualiza o estado com a cópia modificada
  };
  
  const handleWeightChange = (index: number, value: string) => {
    const newGrades = [...grades]; // Cria uma cópia do array grades
    newGrades[index] = { ...newGrades[index], weight: value || "0" }; // Atualiza apenas o índice desejado
    setGrades(newGrades); // Atualiza o estado com a cópia modificada
  };
  
  const validateGrades = () => {
    setError(""); // Reseta o erro
    return grades.every(item => {
      const grade = parseFloat(item.grade);
      const weight = parseFloat(item.weight);
      if (isNaN(grade) || grade < 0 || grade > 10 || isNaN(weight) || weight <= 0) {
        setError("As médias devem estar entre 0 e 10, e os pesos devem ser números válidos e positivos.");
        return false;
      }
      return true;
    });
  };

  const calculateAverage = () => {
    if (!validateGrades()) {
      return;
    }

    const totalWeight = grades.reduce((acc, item) => acc + parseFloat(item.weight), 0);
    if (totalWeight === 0) {
      setError("O total de pesos não pode ser zero.");
      return;
    }

    const weightedSum = grades.reduce((acc, item) => acc + parseFloat(item.grade) * parseFloat(item.weight), 0);
    const avg = weightedSum / totalWeight;
    setAverage(avg);
    setStatus(avg >= 7 ? "Aprovado" : "Reprovado");
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg rounded-xl my-8 transition-all duration-300 ease-in-out transform hover:scale-105">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">Calculadora de Média</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="evaluationPeriod" className="block text-sm font-semibold text-blue-700 mb-2">Período de Avaliação</label>
          <select
            id="evaluationPeriod"
            value={evaluationPeriod}
            onChange={(e) => setEvaluationPeriod(e.target.value)}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <option value="semestre">Semestre</option>
            <option value="bimestre">Bimestre</option>
            <option value="trimestre">Trimestre</option>
          </select>
          {/* Exibe o período selecionado */}
          <p className="mt-2 text-blue-600">Você selecionou: {evaluationPeriod}</p>
        </div>
      </div>

      <table className="min-w-full mt-8 table-auto text-sm">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Média
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Peso
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {grades.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                {`${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <InputField
                  label={`Média do ${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
                  value={item.grade}
                  onChange={(value) => handleGradeChange(index, value)} // Atualiza apenas o índice correto
                  placeholder="Digite a média"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <InputField
                  label={`Peso do ${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
                  value={item.weight}
                  onChange={(value) => handleWeightChange(index, value)} // Atualiza apenas o índice correto
                  placeholder="Digite o peso"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={calculateAverage}
          className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-110"
        >
          Calcular Média Final
        </button>
      </div>

      {/* Exibe a mensagem de erro */}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {status && (
        <p
          className={`text-lg font-bold mt-6 text-center ${
            status === "Aprovado" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status === "Aprovado"
            ? `Parabéns! Você foi aprovado com média final de ${average.toFixed(2)}`
            : `Infelizmente, você foi reprovado. Sua média final foi ${average.toFixed(2)}.`}
        </p>
      )}
    </div>
  );
};

export default Boletim;
