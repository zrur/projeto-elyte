'use client'
import React, { useState, useEffect } from "react";

// Componente para o campo de entrada
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
    <label className="block mb-2 font-semibold">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      className="border border-gray-300 rounded p-2 w-full"
      placeholder={placeholder}
    />
  </div>
);
const Boletim: React.FC = () => {
const [schoolLevel, setSchoolLevel] = useState("fundamental");
const [gradingPeriod, setGradingPeriod] = useState("bimestre");
const [equalWeights, setEqualWeights] = useState(true);
const [subjects, setSubjects] = useState<string[]>([]);
const [grades, setGrades] = useState<number[]>([]);
const [weights, setWeights] = useState<number[]>([]);
const [average, setAverage] = useState(0);
const [status, setStatus] = useState("");

useEffect(() => {
handleLevelChange(schoolLevel);
}, [schoolLevel]); // Atualização dos dados ao mudar o nível escolar

const getSubjects = (level: string) => {
if (level === "fundamental") {
return ["Matemática", "Português", "Ciências", "História", "Geografia"];
}
return ["Matemática", "Português", "Física", "Química", "Biologia"];
};

const initializeGradesAndWeights = (subjectsList: string[]) => {
setGrades(new Array(subjectsList.length).fill(0));
setWeights(new Array(subjectsList.length).fill(1));
};

const handleLevelChange = (level: string) => {
setSchoolLevel(level);
const subjectsList = getSubjects(level);
setSubjects(subjectsList);
initializeGradesAndWeights(subjectsList);
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
<div className="p-8 max-w-4xl mx-auto">
<h1 className="text-2xl font-bold mb-6">Calculadora de Notas</h1>

{/* Seção para selecionar o nível escolar */}
  <div className="mb-6">
    <label className="block mb-2 font-semibold">Nível Escolar</label>
    <select
      value={schoolLevel}
      onChange={(e) => handleLevelChange(e.target.value)}
      className="border border-gray-300 rounded p-2 w-full"
      aria-label="Nível Escolar"
    >
      <option value="fundamental">Fundamental</option>
      <option value="medio">Médio</option>
    </select>
  </div>

  {/* Seção para selecionar o período de avaliação */}
  <div className="mb-6">
    <label className="block mb-2 font-semibold">Período de Avaliação</label>
    <select
      value={gradingPeriod}
      onChange={(e) => setGradingPeriod(e.target.value)}
      className="border border-gray-300 rounded p-2 w-full"
      aria-label="Período de Avaliação"
    >
      <option value="bimestre">Bimestre</option>
      <option value="trimestre">Trimestre</option>
      <option value="semestre">Semestre</option>
    </select>
  </div>

  {/* Seção para selecionar pesos iguais ou personalizados */}
  <div className="mb-6">
    <label className="block mb-2 font-semibold">
      Pesos Iguais para Todas as Disciplinas
    </label>
    <input
      type="checkbox"
      checked={equalWeights}
      onChange={(e) => setEqualWeights(e.target.checked)}
      className="mr-2"
      aria-label="Pesos Iguais para Todas as Disciplinas"
    />
    Pesos Iguais
  </div>

  {/* Tabela para inserir as notas e pesos */}
  <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2">Disciplina</th>
        <th className="border border-gray-300 p-2">Nota</th>
        {!equalWeights && <th className="border border-gray-300 p-2">Peso</th>}
      </tr>
    </thead>
    <tbody>
      {subjects.map((subject, index) => (
        <tr key={subject}>
          <td className="border border-gray-300 p-2">{subject}</td>
          <td className="border border-gray-300 p-2">
            <InputField
              label="Nota"
              value={grades[index]}
              onChange={(value) => {
                const newGrades = [...grades];
                newGrades[index] = parseFloat(value) || 0;
                setGrades(newGrades);
              }}
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="Digite a nota"
            />
          </td>
          {!equalWeights && (
            <td className="border border-gray-300 p-2">
              <InputField
                label="Peso"
                value={weights[index]}
                onChange={(value) => {
                  const newWeights = [...weights];
                  newWeights[index] = parseFloat(value) || 1;
                  setWeights(newWeights);
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

  {/* Botão para calcular a média */}
  <button
    onClick={calculateAverage}
    className="bg-blue-500 text-white rounded px-4 py-2 mt-4 hover:bg-blue-600"
  >
    Calcular Média
  </button>

  {/* Exibição do status e média do aluno */}
  {status && (
    <p
      className={`text-lg font-bold mt-4 ${
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