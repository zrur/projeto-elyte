'use client'
import React, { useState, useEffect } from "react";

// Componente de InputField
const InputField: React.FC<{
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}> = ({ label, value, onChange, type = "text", min, max, step, placeholder }) => (
  <div className="mb-6">
    <label htmlFor={label} className="block text-sm font-semibold text-blue-700 mb-2">{label}</label>
    <input
      id={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105"
      placeholder={placeholder}
    />
  </div>
);

const Boletim: React.FC = () => {
  const [schoolLevel, setSchoolLevel] = useState("fundamental");
  const [equalWeights, setEqualWeights] = useState(true);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [average, setAverage] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const subjectsList = getSubjects(schoolLevel);
    setSubjects(subjectsList);
    initializeGradesAndWeights(subjectsList);
  }, [schoolLevel]);

  const getSubjects = (level: string) => {
    if (level === "fundamental") {
      return ["Português", "História", "Geografia", "Ciências", "Matemática", "Educação Física", "Artes", "Inglês", "Espanhol", "Ensino Religioso"];
    }
    return ["Matemática", "Português", "Física", "Química", "Biologia"];
  };

  const initializeGradesAndWeights = (subjectsList: string[]) => {
    setGrades(new Array(subjectsList.length).fill(0));
    setWeights(new Array(subjectsList.length).fill(1));
  };

  const validateGrades = () => {
    if (grades.some((grade) => grade < 0 || grade > 10)) {
      alert("As notas devem estar entre 0 e 10.");
      return false;
    }
    if (!equalWeights && weights.some((weight) => weight <= 0)) {
      alert("Os pesos devem ser maiores que 0.");
      return false;
    }
    return true;
  };

  const validateInput = (value: string, type: string) => {
    const numValue = parseFloat(value);
    if (type === 'nota' && (numValue < 0 || numValue > 10)) {
      return 'A nota deve estar entre 0 e 10';
    }
    if (type === 'peso' && numValue <= 0) {
      return 'O peso deve ser maior que 0';
    }
    return '';
  };

  const calculateAverage = () => {
    if (!validateGrades()) return;

    let total = 0;
    let totalWeights = 0;

    grades.forEach((grade, index) => {
      const weight = equalWeights ? 1 : weights[index];
      total += grade * weight;
      totalWeights += weight;
    });

    const avg = total / totalWeights;
    setAverage(avg);
    setStatus(avg >= 7 ? "Aprovado" : "Reprovado");
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg rounded-xl my-8 transition-all duration-300 ease-in-out transform hover:scale-105">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">Calculadora de Notas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="schoolLevel" className="block text-sm font-semibold text-blue-700 mb-2">Nível Escolar</label>
          <select
            id="schoolLevel"
            value={schoolLevel}
            onChange={(e) => setSchoolLevel(e.target.value)}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <option value="fundamental">Fundamental</option>
            <option value="medio">Médio</option>
          </select>
          {/* Aqui você exibe o valor selecionado */}
          <p className="mt-2 text-blue-600">Você selecionou: {schoolLevel === "fundamental" ? "Ensino Fundamental" : "Ensino Médio"}</p>
        </div>

        <div className="flex items-center mt-6 md:mt-0">
          <input
            id="equalWeights"
            type="checkbox"
            checked={equalWeights}
            onChange={(e) => setEqualWeights(e.target.checked)}
            className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded transition-all duration-200 ease-in-out transform hover:scale-105"
          />
          <label htmlFor="equalWeights" className="ml-2 text-sm font-semibold text-blue-700">
            Pesos Iguais para Todas as Disciplinas
          </label>
        </div>
      </div>

      <table className="min-w-full mt-8 table-auto text-sm">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Disciplina
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Nota
            </th>
            {!equalWeights && (
              <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Peso
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {subjects.map((subject, index) => (
            <tr key={subject}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">{subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <InputField
                  label="Nota"
                  value={grades[index]}
                  onChange={(value) => {
                    const error = validateInput(value, 'nota');
                    if (error) {
                      alert(error); // Melhor seria exibir um erro visual
                    } else {
                      const newGrades = [...grades];
                      newGrades[index] = parseFloat(value) || 0;
                      setGrades(newGrades);
                    }
                  }}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder="Digite a nota"
                />
              </td>
              {!equalWeights && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <InputField
                    label="Peso"
                    value={weights[index]}
                    onChange={(value) => {
                      const error = validateInput(value, 'peso');
                      if (error) {
                        alert(error); // Melhor seria exibir um erro visual
                      } else {
                        const newWeights = [...weights];
                        newWeights[index] = parseFloat(value) || 1;
                        setWeights(newWeights);
                      }
                    }}
                    type="number"
                    min={1}
                    step={1}
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
          Calcular Média
        </button>
      </div>

      {status && (
        <p
          className={`text-lg font-bold mt-6 text-center ${
            status === "Aprovado" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status === "Aprovado"
            ? `Parabéns! Você foi aprovado com média ${average.toFixed(2)}`
            : `Infelizmente, você foi reprovado. Sua média foi ${average.toFixed(2)}.`}
        </p>
      )}
    </div>
  );
};

export default Boletim;
