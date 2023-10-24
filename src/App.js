import React, { useState } from 'react';

const TournamentGenerator = () => {
  const [teamCount, setTeamCount] = useState(4);
  const [teamNames, setTeamNames] = useState(Array(teamCount).fill(''));
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [winner, setWinner] = useState(null);
  const [winnersList, setWinnersList] = useState([]);
  const [showWinnersList, setShowWinnersList] = useState(false);
  const [round, setRound] = useState(1);
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [tournamentEnded, setTournamentEnded] = useState(false);
  const [finalWinner, setFinalWinner] = useState('');
  const [showButtons, setShowButtons] = useState(true);

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
      setTournamentEnded(false);
      setFinalWinner('');
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

    if (winnersList.length + 1 === teamCount / 2) {
      setTournamentEnded(true);
      setFinalWinner(`${winningTeam} ha ganado el torneo.`);
    } else {
      setWinner(`${winningTeam} pasa a la siguiente ronda.`);
    }

    // Deshabilitar los botones después de seleccionar un ganador
    const updatedMatchesAfterSelection = updatedMatches.map((match, index) => {
      if (index === matchIndex) {
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
        setTournamentEnded(true);
        setFinalWinner(`${shuffledWinners[0]} ha ganado el torneo.`);
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
      setRound(round + 1);
      setWaitingPlayers([]);
    }
  };

  return (
    <div>
      <h1>Tournament Generator</h1>
      <label>
        Number of Teams (must be even):
        <input type="number" min="4" max="32" step="2" value={teamCount} onChange={handleTeamCountChange} />
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
                disabled={tournamentEnded || participant.disabled}
              >
                {participant.name}
              </button>
            ))}
          </div>
        ))}
      {tournamentEnded && finalWinner && <p>{finalWinner}</p>}
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
      {!tournamentEnded && showButtons && (
        <div>
          <button onClick={generateWinnersMatches}>Generate Winners Matches</button>
        </div>
      )}
    </div>
  );
};

export default TournamentGenerator;