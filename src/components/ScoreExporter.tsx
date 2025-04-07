
import React from "react";
import { FileSpreadsheet } from "lucide-react";
import Button from "./Button";
import { Player } from "@/lib/quizStore";

interface ScoreExporterProps {
  players: Player[];
  quizTitle: string;
}

const ScoreExporter: React.FC<ScoreExporterProps> = ({ players, quizTitle }) => {
  const downloadExcel = () => {
    // Create CSV header
    const headers = ["Rank", "Team Name", "Score", "Correct Answers", "Total Questions"];
    
    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Create CSV rows
    const rows = sortedPlayers.map((player, index) => {
      const rank = index + 1;
      const totalQuestions = player.answers.length;
      const correctAnswers = player.answers.filter(a => a.correct).length;
      
      return [
        rank,
        player.name,
        player.totalPoints,
        correctAnswers,
        totalQuestions
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    const sanitizedTitle = quizTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().slice(0, 10);
    
    link.href = url;
    link.setAttribute("download", `${sanitizedTitle}_scores_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      onClick={downloadExcel} 
      className="flex items-center gap-2"
      variant="primary"
    >
      <FileSpreadsheet size={18} />
      <span>Download Scores</span>
    </Button>
  );
};

export default ScoreExporter;
