import React, { useState } from 'react';

const TournamentGenerator = () => {
    const [teamCount, setTeamCount] = useState("");
    const [teamNames, setTeamNames] = useState([]);
    const [randomizeButtonVisible, setRandomizeButtonVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [winnersList, setWinnersList] = useState([]);
    const [finalMatches, setFinalMatches] = useState([]);
    const [finalWinner, setFinalWinner] = useState(null);

    const generarNombres = (event) => {
        const count = parseInt(event.target.value, 10);
        setTeamCount(count);
        setTeamNames(Array(count).fill(''));
        setRandomizeButtonVisible(false);
        setMatches([]); // Limpiar los enfrentamientos al cambiar la cantidad de equipos
        setWinnersList([]); // Limpiar la lista de ganadores
        setFinalMatches([]); // Limpiar los enfrentamientos finales
        setFinalWinner(null); // Limpiar al ganador final
    };

    const cambioNombres = (index, event) => {
        const updatedNames = [...teamNames];
        updatedNames[index] = event.target.value;
        setTeamNames(updatedNames);
        const allNamesEntered = updatedNames.every(name => name.trim() !== '');
        setRandomizeButtonVisible(allNamesEntered);
    };

    const generarEnfrentamientos = () => {
        const shuffledNames = [...teamNames];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }
        setTeamNames(shuffledNames);
        const newMatches = [];

        for (let i = 0; i < shuffledNames.length; i += 2) {
            const teamA = shuffledNames[i];
            const teamB = shuffledNames[i + 1];
            const match = {
                id: `match-${i}`,
                teamA: teamA,
                teamB: teamB,
                winner: null,
            };
            newMatches.push(match);
        }

        setMatches(newMatches);
    };

    const handleMatchWinner = (matchId, winner) => {
        const updatedMatches = matches.map(match => {
            if (match.id === matchId) {
                return { ...match, winner: winner };
            }
            return match;
        });

        setMatches(updatedMatches);
        const matchWinners = updatedMatches.map(match => match.winner).filter(Boolean);
        setWinnersList(matchWinners);

        if (matchWinners.length === 1) {
            // Aquí puedes declarar al ganador general del la primera fase si solo queda un ganador
            console.log(`El ganador de la primera fase es: ${matchWinners[0]}`);
        }
    };

    const generarFaseFinal = () => {
        const newFinalMatches = [];
        for (let i = 0; i < winnersList.length; i += 2) {
            const teamA = winnersList[i];
            const teamB = winnersList[i + 1];
            const match = {
                id: `final-match-${i}`,
                teamA: teamA,
                teamB: teamB,
                winner: null,
            };
            newFinalMatches.push(match);
        }

        setFinalMatches(newFinalMatches);
    };

    const handleFinalMatchWinner = (matchId, winner) => {
        const updatedFinalMatches = finalMatches.map(match => {
            if (match.id === matchId) {
                return { ...match, winner: winner };
            }
            return match;
        });

        setFinalMatches(updatedFinalMatches);
        const finalMatchWinners = updatedFinalMatches.map(match => match.winner).filter(Boolean);

        if (finalMatchWinners.length === 1) {
            // Aquí puedes declarar al ganador general del torneo si solo queda un ganador
            console.log(`El ganador del torneo es: ${finalMatchWinners[0]}`);
            setFinalWinner(finalMatchWinners[0]);
        }
    };

    return (
        <div>
            <h1>Generador de torneos</h1>
            <label>Seleccionar cantidad de equipos: </label>
            <select name="cantidad_equipos" id="cantidad_equipos" onChange={generarNombres}>
                <option value="0">---</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
            </select>

            <ul>
                {teamNames.map((teamName, index) => (
                    <li key={index}>
                        <input
                            type="text"
                            placeholder={`Equipo ${index + 1}`}
                            value={teamName}
                            onChange={(e) => cambioNombres(index, e)}
                        />
                    </li>
                ))}
            </ul>
            {randomizeButtonVisible && (
                <button onClick={generarEnfrentamientos}>Randomizar enfrentamientos</button>
            )}

            {matches.length > 0 && (
                <div>
                    <h2>Enfrentamientos</h2>
                    <ul>
                        {matches.map(match => (
                            <li key={match.id}>
                                {match.teamA} vs. {match.teamB}
                                {!match.winner && (
                                    <button onClick={() => handleMatchWinner(match.id, match.teamA)}>Ganador: {match.teamA}</button>
                                )}
                                {!match.winner && (
                                    <button onClick={() => handleMatchWinner(match.id, match.teamB)}>Ganador: {match.teamB}</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {winnersList.length > 0 && (
                <div>
                    <h2>Ganadores de la Primera Fase</h2>
                    <ul>
                        {winnersList.map((winner, index) => (
                            <li key={index}>{winner}</li>
                        ))}
                    </ul>
                </div>
            )}

            {winnersList.length > 1 && (
                <div>
                    <button onClick={generarFaseFinal}>Generar Enfrentamientos Finales</button>
                </div>
            )}

            {finalMatches.length > 0 && (
                <div>
                    <h2>Enfrentamientos Finales</h2>
                    <ul>
                        {finalMatches.map(match => (
                            <li key={match.id}>
                                {match.teamA} vs. {match.teamB}
                                {!match.winner && (
                                    <button onClick={() => handleFinalMatchWinner(match.id, match.teamA)}>Ganador: {match.teamA}</button>
                                )}
                                {!match.winner && (
                                    <button onClick={() => handleFinalMatchWinner(match.id, match.teamB)}>Ganador: {match.teamB}</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {finalWinner && (
                <div>
                    <h2>Ganador del Torneo</h2>
                    <p>{finalWinner}</p>
                </div>
            )}
        </div>
    );
};

export default TournamentGenerator;
