import React from 'react';
import { Card } from 'react-bootstrap';

interface Student {
  id: string;
  name: string;
  progress?: {
    score?: number;
  };
}

interface LeaderboardProps {
  sortedStudents: Student[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ sortedStudents }) => {
  const topThree = sortedStudents.slice(0, 3);
  const rest = sortedStudents.slice(3);

  return (
    <div className=" text-center ">
      {/* Podium Display */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', height: '150px' }}>
        {topThree.map((student, index) => (
          <div key={student.id} style={{
            width: '80px',
            height: `${100 - index * 20}px`, // Dynamic height
            backgroundColor: index === 0 ? '#4a81c2' : index === 1 ? '#e55' : '#44b86d',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            color: 'white',
            fontWeight: 'bold',
            padding: '5px',
            borderRadius: '10px'
          }}>
            <h5>{index+1}</h5>
            <span>{student.name}</span>
            <span>{student.progress?.score?.toFixed(2) ?? 'N/A'}</span>
          </div>
        ))}
      </div>
      
      {/* Full Ranking Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px',
         backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>الترتيب</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>الاسم</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '8px' }}>التقدم (%)</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr key={student.id}>
              <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{index +1}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{student.name}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                {student.progress?.score !== undefined ? student.progress.score.toFixed(2) : 'غير متوفر'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
