import React, { useState } from 'react';
import { SingleEliminationBracket, Match, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';


const TournamentGenerator = () => {
    const [teamCount, setTeamCount] = useState("");
    const [teamNames, setTeamNames] = useState([]);
    const [randomizeButtonVisible, setRandomizeButtonVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [generatedNumbers, setGeneratedNumbers] = useState([]);
    const [numeroMatch, setNumeroMatch] = useState(0);
    const [roundNumber, setRoundNumber] = useState(1);
    const [last, setLast] = useState(false)
    let listWinners = [];
    let pepe = false;

    const generateNames = (event) => {
        const count = parseInt(event.target.value, 10);
        setTeamCount(count);
        setTeamNames(Array(count).fill(''));
        setRandomizeButtonVisible(false);
        setMatches([]); // Limpiar los enfrentamientos al cambiar la cantidad de equipos
        setLast(false)
        setRoundNumber(1)
        setNumeroMatch(0)
        setGeneratedNumbers([])
    };

    const changeNames = (index, event) => {
        const updatedNames = [...teamNames];
        updatedNames[index] = event.target.value;
        setTeamNames(updatedNames);
        const allNamesEntered = updatedNames.every(name => name.trim() !== '');
        setRandomizeButtonVisible(allNamesEntered);
    };

    const shuffleTeams = () => {
        setLast(false)
        setRoundNumber(1)
        setNumeroMatch(0)
        setGeneratedNumbers([])
        const shuffledNames = [...teamNames];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }
        setTeamNames(shuffledNames);
        const newMatches = [];

        let number = numeroMatch;
        let round = roundNumber;
        const listaNumeros = [];



        for (let i = 0; i < shuffledNames.length; i += 2) {
            let idRandomA = Math.floor(Math.random() * 100) + 1;
            let idRandomB = Math.floor(Math.random() * 100) + 1;

            if (listaNumeros.includes(idRandomA)) {
                idRandomA = Math.floor(Math.random() * 100) + 1;
            } else {
                listaNumeros.push(idRandomA)
            };
            if (listaNumeros.includes(idRandomB)) {
                idRandomB = Math.floor(Math.random() * 100) + 1;
            } else {
                listaNumeros.push(idRandomB)
            };
            const teamA = shuffledNames[i];
            const teamB = shuffledNames[i + 1];
            const match =
            {
                "id": `match-${number++}`,
                "name": null,
                "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
                "tournamentRoundText": 1, // Text for Round Header
                "startTime": "",
                "state": null, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
                "participants": [
                    {
                        "id": idRandomA, // Unique identifier of any kind
                        "resultText": null, // Any string works
                        "isWinner": false,
                        "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                        "name": teamA
                    },
                    {
                        "id": idRandomB,
                        "resultText": null,
                        "isWinner": false,
                        "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
                        "name": teamB
                    }
                ]
            }

            setNumeroMatch(number)
            newMatches.push(match);

        }
        newMatches[0].tournamentRoundText = round
        setRoundNumber(round)
        setMatches(newMatches);
        setGeneratedNumbers(listaNumeros);
    };
    const addMatch = (teamA, teamB) => {
        let newMatches = [];
        let number = numeroMatch;
        let round = roundNumber;

        const match =
        {
            "id": `match-${number}`,
            "name": null,
            "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
            "tournamentRoundText": null, // Text for Round Header
            "startTime": "",
            "state": null, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
            "participants": [
                {
                    "id": teamA.id, // Unique identifier of any kind
                    "resultText": null, // Any string works
                    "isWinner": false,
                    "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                    "name": teamA.name
                },
                {
                    "id": teamB.id,
                    "resultText": null,
                    "isWinner": false,
                    "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
                    "name": teamB.name
                }
            ]
        }

        setNumeroMatch(number)
        newMatches.push(match);
        round += 1
        newMatches[0].tournamentRoundText = round
        setRoundNumber(round)
        for (let i = 0; i < newMatches.length; i += 1) {
            newMatches[i].id = `match-${number++}`
            setNumeroMatch(number)
        };
        setMatches(prevMatches => [...prevMatches, ...newMatches]);
        listWinners = []

    };

    const winner = (matchId, nameWinner, last = false) => {
        if (last === true) {
            pepe = true
            setLast(pepe)
        }

        if (teamCount === 2 || last === true) {
            matches.map(match => {
                if (matchId === match.id && nameWinner === match.participants[0].name) {
                    return (
                        match.state = "DONE",
                        match.participants[0].resultText = "Won",
                        match.participants[0].isWinner = true,
                        match.participants[1].resultText = "Lost",
                        match.participants[1].isWinner = false)
                }
                if (matchId === match.id && nameWinner === match.participants[1].name) {

                    return (
                        match.state = "DONE",
                        match.participants[1].resultText = "Won",
                        match.participants[1].isWinner = true,
                        match.participants[0].resultText = "Lost",
                        match.participants[0].isWinner = false)
                }
            })
        }
        if (last === false) {
            let number = numeroMatch
            number = number++

            matches.map(match => {
                if (matchId === match.id && nameWinner === match.participants[0].name) {
                    match.state = "DONE"
                    match.participants[0].resultText = "Won"
                    match.participants[0].isWinner = true
                    match.participants[1].resultText = "Lost"
                    match.participants[1].isWinner = false
                    match.nextMatchId = `match-${number}`
                    setNumeroMatch(number)
                    listWinners.push(match.participants[0])


                } else if (matchId === match.id && nameWinner === match.participants[1].name) {
                    match.state = "DONE"
                    match.participants[1].resultText = "Won"
                    match.participants[1].isWinner = true
                    match.participants[0].resultText = "Lost"
                    match.participants[0].isWinner = false
                    match.nextMatchId = `match-${number}`
                    setNumeroMatch(number)
                    listWinners.push(match.participants[1])
                }
            })

            if (listWinners.length > 1) {
                addMatch(listWinners[0], listWinners[1])
            }

        }
    };
    const WhiteTheme = createTheme({
        textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
        matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
        score: {
          background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
          text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
        },
        border: {
          color: '#efdf48',
          highlightedColor: '#da96c6',
        },
        roundHeader: { backgroundColor: '#c7e058', fontColor: 'white    ' },
        connectorColor: '#c7e058',
        connectorColorHighlight: '#da96c6',
        svgBackground: `url(/fondo.jpg)`, // Asegúrate de que la ruta sea correcta
    });
      
 const showGrafic = (last) => {
  return (
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-100px' }}>
      {last && (
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}
          theme={WhiteTheme}
          options={{
            style: {
              roundHeader: {
                backgroundColor: WhiteTheme.roundHeader.backgroundColor,
                fontColor: WhiteTheme.roundHeader.fontColor,
              },
              connectorColor: WhiteTheme.connectorColor,
              connectorColorHighlight: WhiteTheme.connectorColorHighlight,
            },
          }}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer
              background={WhiteTheme.svgBackground}
              SVGBackground={WhiteTheme.svgBackground}
              width={800}
              height={500}
              {...props}
            >
              {children}
            </SVGViewer>
          )}
        />
      )}
    </div>
  );
};
    const generadorEnfrentamientos = () => {

        if (teamCount === 2) {
            const finalMatch = matches[matches.length - 1];
            finalMatch.nextMatchId = null;
            const teamA = finalMatch.participants[0]
            const teamB = finalMatch.participants[1]
            return (
                <div>
                    {matches.length > 0 && last === false && (
                        <div>
                            <h2>Enfrentamiento</h2>
                            <ul>
                                {matches.map(match => (

                                    <li key={match.id}>
                                    <span className="match-description">
                                    {teamA.name} vs. {teamB.name}
                                    </span>
                                    <br></br>
                                    <button className="winner-button" onClick={() => winner(match.id, teamA.name, true)}>
                                    Ganador: {teamA.name}
                                    </button>
                                    <button className="winner-button" onClick={() => winner(match.id, teamB.name, true)}>
                                    Ganador: {teamB.name}
                                    </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showGrafic(last)}

                </div>
            )
        }
        else if (teamCount === 4) {
            const finalMatch = matches[matches.length - 1];

            return (
                <div>
                    {matches.length > 0 && matches.length < 3 && (
                        <div>
                            <h2>Enfrentamiento</h2>
                            <ul>
                                {matches.map(match => (
                                    <li key={match.id}>

                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>

                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {matches.length === 3 && last === false && (
                        <div>

                            <h2>Final</h2>
                            <ul>
                                <li key={finalMatch.id}>
                                    {finalMatch.participants[0].name} vs. {finalMatch.participants[1].name} <br></br>
                                    <button onClick={() => winner(finalMatch.id, finalMatch.participants[0].name, true)}>Ganador: {finalMatch.participants[0].name}</button>
                                    <button onClick={() => winner(finalMatch.id, finalMatch.participants[1].name, true)}>Ganador: {finalMatch.participants[1].name}</button>
                                </li>
                            </ul>

                        </div>
                    )}
                    {showGrafic(last)}

                </div>
            )

        }
        else if (teamCount === 8) {
            const firstFight = matches.slice(0, 4)
            const secondFight = matches.slice(-2);
            const thirdFight = matches.slice(-1);
            return (
                <div>
                    {firstFight.length > 0 && matches.length < 6 && (
                        <div>
                            <h2>Enfrentamiento</h2>
                            <ul>
                                {firstFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length === 6 && (
                        <div>
                            <h2>Enfrentamiento 2</h2>
                            <ul>
                                {secondFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length === 7 && last === false && (
                        <div>
                            <h2>Enfrentamiento 3</h2>
                            <ul>
                                {thirdFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name, true)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name, true)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showGrafic(last)}
                </div>
            )

        } else if (teamCount === 16) {
            const firstFight = matches.slice(0, 8)
            const secondFight = matches.slice(8, 12);
            const thirdFight = matches.slice(12, 14);
            const fourFight = matches.slice(-1);
            return (
                <div>
                    {firstFight.length > 0 && matches.length < 12 && (
                        <div>
                            <h2>Enfrentamiento</h2>
                            <ul>
                                {firstFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length >= 12 && matches.length < 14 && (
                        <div>
                            <h2>Enfrentamiento 2</h2>
                            <ul>
                                {secondFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length >= 14 && matches.length < 15 && (
                        <div>
                            <h2>Enfrentamiento 3</h2>
                            <ul>
                                {thirdFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length === 15 && last === false && (
                        <div>
                            <h2>Enfrentamiento 3</h2>
                            <ul>
                                {fourFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name, true)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name, true)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showGrafic(last)}

                </div>
            )

        }
        else if (teamCount === 32) {

            const firstFight = matches.slice(0, 16)
            const secondFight = matches.slice(16, 24);
            const thirdFight = matches.slice(24, 28);
            const fourFight = matches.slice(28, 30);
            const fiveFight = matches.slice(30,31)
            return (
                <div>
                    {firstFight.length > 0 && matches.length < firstFight.length + 8 && (
                        <div>

                            <h2>Enfrentamiento</h2>
                            <ul>
                                {firstFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length >= 24 && matches.length < 28 && (
                        <div>
                            <h2>Enfrentamiento 2</h2>
                            <ul>
                                {secondFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length >= 28 && matches.length < 30 && (
                        <div>
                            <h2>Enfrentamiento 3</h2>
                            <ul>
                                {thirdFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length === 30 && matches.length < 32 && (
                        <div>
                            <h2>Enfrentamiento 4</h2>
                            <ul>
                                {fourFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {matches.length === 31 && last === false && (
                        <div>
                            <h2 className="round-title">Enfrentamiento 5</h2>
                            <ul>
                                {fiveFight.map(match => (
                                    <li key={match.id}>
                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>
                                        <button onClick={() => winner(match.id, match.participants[0].name, true)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => winner(match.id, match.participants[1].name, true)}>Ganador: {match.participants[1].name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showGrafic(last)}

                </div>
            )
        }

    };
    return (
        <div>
            <h1>Generador de torneos</h1>
            <label>Seleccionar cantidad de equipos: </label>
            <select name="cantidad_equipos" id="cantidad_equipos" onChange={generateNames}>
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
                            onChange={(e) => changeNames(index, e)}
                        />
                    </li>
                ))}
            </ul>

            {randomizeButtonVisible && (
                <button className="randomize-button" onClick={shuffleTeams}>
                    Randomizar enfrentamientos
                </button>
            )}  
            {matches.length > 0 && (
                generadorEnfrentamientos())}


        </div>
    );
};

export default TournamentGenerator;