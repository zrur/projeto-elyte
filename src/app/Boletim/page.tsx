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
  const [grades, setGrades] = useState<string[]>([]);
  const [weights, setWeights] = useState<string[]>([]);
  const [useWeights, setUseWeights] = useState(false);
  const [average, setAverage] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const numPeriods = getNumberOfPeriods(evaluationPeriod);
    setGrades(new Array(numPeriods).fill("")); // Inicializa o array de grades com strings vazias
    setWeights(new Array(numPeriods).fill("")); // Inicializa o array de pesos com strings vazias, caso use pesos
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

  // Função para atualizar as notas
  const handleGradeChange = (index: number, value: string) => {
    const newGrades = [...grades];
    newGrades[index] = value || "0"; // Atualiza apenas o índice desejado
    setGrades(newGrades);
  };

  // Função para atualizar os pesos
  const handleWeightChange = (index: number, value: string) => {
    const newWeights = [...weights];
    newWeights[index] = value || "0"; // Atualiza apenas o índice desejado
    setWeights(newWeights);
  };

  const validateGradesAndWeights = () => {
    setError(""); // Reseta o erro
    // Validação das notas
    const validGrades = grades.every(item => {
      const grade = parseFloat(item);
      if (isNaN(grade) || grade < 0 || grade > 10) {
        setError("As médias devem estar entre 0 e 10.");
        return false;
      }
      return true;
    });

    if (!validGrades) return false;

    // Validação dos pesos, caso a opção de pesos esteja ativa
    if (useWeights) {
      const validWeights = weights.every(item => {
        const weight = parseFloat(item);
        if (isNaN(weight) || weight < 0) {
          setError("Os pesos devem ser números positivos.");
          return false;
        }
        return true;
      });
      return validWeights;
    }

    return true;
  };

  const calculateAverage = () => {
    if (!validateGradesAndWeights()) {
      return;
    }

    if (useWeights) {
      // Cálculo com pesos
      const weightedSum = grades.reduce((acc, grade, index) => {
        return acc + parseFloat(grade) * parseFloat(weights[index]);
      }, 0);
      const totalWeights = weights.reduce((acc, weight) => acc + parseFloat(weight), 0);
      const avg = weightedSum / totalWeights;
      setAverage(avg);
    } else {
      // Cálculo sem pesos
      const sum = grades.reduce((acc, item) => acc + parseFloat(item), 0);
      const avg = sum / grades.length;
      setAverage(avg);
    }

    setStatus(average >= 7 ? "Aprovado" : "Reprovado");
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
        </div>

        <div>
          <label htmlFor="useWeights" className="block text-sm font-semibold text-blue-700 mb-2">Usar Pesos?</label>
          <select
            id="useWeights"
            value={useWeights ? "sim" : "nao"}
            onChange={(e) => setUseWeights(e.target.value === "sim")}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
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
            {useWeights && (
              <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Peso
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {grades.map((grade, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                {`${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <InputField
                  label={`Média do ${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
                  value={grade}
                  onChange={(value) => handleGradeChange(index, value)}
                  placeholder="Digite a média"
                />
              </td>
              {useWeights && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <InputField
                    label={`Peso do ${evaluationPeriod.charAt(0).toUpperCase() + evaluationPeriod.slice(1)} ${index + 1}`}
                    value={weights[index]}
                    onChange={(value) => handleWeightChange(index, value)}
                    placeholder="Digite o peso"
                  />
                </td>
              )}
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
