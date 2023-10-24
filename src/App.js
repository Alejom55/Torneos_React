import React, { useState } from 'react';

const TournamentGenerator = () => {
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(Array(teamCount).fill(''));
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [winner, setWinner] = useState(null);
  const [winnersList, setWinnersList] = useState([]);
  const [showWinnersList, setShowWinnersList] = useState(false);
  const [round, setRound] = useState(1);
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [showPodium, setShowPodium] = useState(false);
  const [showButtons, setShowButtons] = useState(true); // Agregado para controlar la visibilidad de los botones
  const [tournamentEnded, setTournamentEnded] = useState(false);
const [finalWinner, setFinalWinner] = useState('');

  const handleTeamCountChange = (event) => {
    const count = parseInt(event.target.value, 10);

    if (count % 2 === 0) {
      setTeamCount(count);
      setTeamNames(Array(count).fill(''));
      setErrorMessage('');
      setMatches([]);
      setWinner(null);
      setWinnersList([]);
      setShowWinnersList(false);
      setShowButtons(true); // Muestra los botones nuevamente
    } else {
      setErrorMessage('El número de equipos debe ser par.');
    }
  };


  const handleTeamNameChange = (index, event) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = event.target.value;
    setTeamNames(updatedNames);
  };

  const generateMatches = () => {
    const shuffledNames = [...teamNames].sort(() => Math.random() - 0.5);
    const newMatches = [];

    for (let i = 0; i < shuffledNames.length; i += 2) {
      const teamA = shuffledNames[i];
      const teamB = shuffledNames[i + 1];
      const match = {
        id: `match-${i}`,
        name: `Match ${i / 2 + 1}`,
        tournamentRoundText: '1',
        participants: [
          {
            id: `participant-${i}-A`,
            name: teamA,
          },
          {
            id: `participant-${i}-B`,
            name: teamB,
          },
        ],
      };
      newMatches.push(match);
    }

    setMatches(newMatches);
    setWinner(null);
    setWinnersList([]);
    setShowWinnersList(false);
  };

  const determineWinner = (matchIndex, participantIndex) => {
    const updatedMatches = [...matches];
    updatedMatches[matchIndex].participants[participantIndex].resultText = 'WON';
    setMatches(updatedMatches);
  
    const winningTeam = updatedMatches[matchIndex].participants[participantIndex].name;
  
    if (!winnersList.includes(winningTeam)) {
      setWinnersList((prevWinnersList) => [...prevWinnersList, winningTeam]);
    }
  
    if (winnersList.length || teamCount < 1) {
      // El último ganador, ocultar los botones y mostrar el mensaje de ganador
      setShowButtons(false);
      setWinner(`${winningTeam}`);
    } else {
      // Mostrar mensaje de jugador que pasa de ronda
      setWinner(`${winningTeam} pasa a la siguiente ronda.`);
    }
  
    // Deshabilitar los botones después de seleccionar un ganador
    const updatedMatchesAfterSelection = updatedMatches.map((match, index) => {
      if (index === matchIndex) {
        // Deshabilitar los botones de este match
        return {
          ...match,
          participants: match.participants.map((participant, pIndex) => {
            if (pIndex === participantIndex) {
              return {
                ...participant,
                disabled: true,
              };
            }
            return participant;
          }),
        };
      }
      return match;
    });
  
    setMatches(updatedMatchesAfterSelection);
  
    if (winnersList.length + 1 === teamCount / 2) {
      // Mostrar los botones de la competencia final
      setShowButtons(true);
    }
  };
  const generateWinnersMatches = () => {
    if (winnersList.length < 2 && waitingPlayers.length === 0) {
      setErrorMessage('Debe haber al menos dos ganadores o jugadores en espera para generar enfrentamientos.');
      return;
    }

    if (winnersList.length >= 2) {
      const shuffledWinners = [...winnersList].sort(() => Math.random() - 0.5);
      const newMatches = [];

      for (let i = 0; i < shuffledWinners.length; i += 2) {
        const winnerA = shuffledWinners[i];
        const winnerB = shuffledWinners[i + 1];
        const match = {
          id: `winners-match-${i}`,
          name: `Winners Match ${i / 2 + 1}`,
          tournamentRoundText: `Round ${round}`,
          participants: [
            {
              id: `winner-participant-${i}-A`,
              name: winnerA,
            },
            {
              id: `winner-participant-${i}-B`,
              name: winnerB,
            },
          ],
        };
        newMatches.push(match);
      }

      setMatches(newMatches);
      setWinner(null);
      setErrorMessage('');
      setShowWinnersList(true);
      setRound(round + 1);
      setWaitingPlayers([]);

      if (shuffledWinners.length === 1) {
        setWinner(shuffledWinners[0]);
        setShowWinnersList(false);
        setShowButtons(false); // Ocultar los botones
      }
    } else if (winnersList.length === 1 && waitingPlayers.length === 1) {
      const winnerA = winnersList[0];
      const winnerB = waitingPlayers[0];
      const match = {
        id: `winners-match-${round - 1}`,
        name: `Final Match`,
        tournamentRoundText: `Round ${round}`,
        participants: [
          {
            id: `winner-participant-${round - 1}-A`,
            name: winnerA,
          },
          {
            id: `winner-participant-${round - 1}-B`,
            name: winnerB,
          },
        ],
      };
      setMatches([match]);
      setWinner(null);
      setErrorMessage('');
      setShowWinnersList(false);
      setShowButtons(true); // Muestra los botones para la competencia final
      setRound(round + 1);
      setWaitingPlayers([]);
    }
  };

  return (
    <div>
      <h1>Tournament Generator</h1>
      <label>
        Number of Teams (must be even):
        <input type="number" min="2" max="32" step="2" value={teamCount} onChange={handleTeamCountChange} />
      </label>
      <ul>
        {teamNames.map((teamName, index) => (
          <li key={index}>
            <input
              type="text"
              placeholder={`Team ${index + 1}`}
              value={teamName}
              onChange={(e) => handleTeamNameChange(index, e)}
            />
          </li>
        ))}
      </ul>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={generateMatches}>Generate Matches</button>
      {matches.length > 0 &&
        matches.map((match, matchIndex) => (
          <div key={match.id}>
            <p>{match.name}</p>
            {match.participants.map((participant, participantIndex) => (
              <button
                key={participant.id}
                onClick={() => determineWinner(matchIndex, participantIndex)}
              >
                {participant.name}
              </button>
            ))}
          </div>
        ))}
        {showPodium && winnersList.length > 0 && (
          <div>
            <h2>Podium</h2>
            {winnersList.slice(0, 3).map((winner, index) => (
              <p key={index}>{`#${index + 1}: ${winner}`}</p>
            ))}
          </div>
        )}
      {winner !== null && winner !== '' && (
        <p>{winner === 'Nadie' ? 'Nadie ha ganado el torneo.' : `${winner} ha ganado el torneo.`}</p>
      )}
      {showWinnersList && (
        <div>
          <h2>Winners List (Round {round - 1})</h2>
          <ul>
            {winnersList.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ul>
        </div>
      )}
      {showButtons && (
        <div>
          <button onClick={generateWinnersMatches}>Generate Winners Matches</button>
        </div>
      )}
    </div>
  );
};

export default TournamentGenerator;