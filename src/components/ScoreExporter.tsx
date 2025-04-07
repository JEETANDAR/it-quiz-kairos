
import React from 'react';
import { Player } from '@/lib/quizStore';
import Button from '@/components/Button';
import { cn } from '@/lib/utils';

export interface ScoreExporterProps {
  players: Player[];
  quizTitle: string;
  asButton?: boolean;
  buttonText?: string;
  className?: string;
}

const ScoreExporter: React.FC<ScoreExporterProps> = ({ 
  players, 
  quizTitle, 
  asButton = false,
  buttonText = "Export Scores",
  className
}) => {
  const exportToCSV = () => {
    // Sort players by total points (descending)
    const sortedPlayers = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Create headers for the CSV
    const headers = ['Rank', 'Team', 'Score', 'Correct Answers'];
    
    // Create rows for each player
    const rows = sortedPlayers.map((player, index) => {
      const correctAnswers = player.answers.filter(a => a.correct).length;
      return [
        index + 1, // Rank
        player.name, // Team name
        player.totalPoints, // Score
        correctAnswers // Number of correct answers
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${quizTitle.replace(/\s+/g, '_')}_scores.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };
  
  if (asButton) {
    return (
      <Button
        onClick={exportToCSV}
        className={className}
      >
        {buttonText}
      </Button>
    );
  }
  
  return (
    <button 
      onClick={exportToCSV}
      className={cn(
        "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors",
        className
      )}
    >
      {buttonText}
    </button>
  );
};

export default ScoreExporter;
