import React, { useState } from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

const TournamentGenerator = () => {
    const [teamCount, setTeamCount] = useState("");
    const [teamNames, setTeamNames] = useState([]);
    const [randomizeButtonVisible, setRandomizeButtonVisible] = useState(false);
    const [matches, setMatches] = useState([]);
    const [generatedNumbers, setGeneratedNumbers] = useState([]);
    const [numeroMatch, setNumeroMatch] = useState(0);
    const [listWinners, setListWinners] = useState([]);
    const [botonesVisibles, setBotonesVisibles] = useState(true); // Estado para controlar la visibilidad de los botones

    let hola = []

    const generateNames = (event) => {
        const count = parseInt(event.target.value, 10);
        setTeamCount(count);
        setTeamNames(Array(count).fill(''));
        setRandomizeButtonVisible(false);
        setMatches([]); // Limpiar los enfrentamientos al cambiar la cantidad de equipos
    };

    const changeNames = (index, event) => {
        const updatedNames = [...teamNames];
        updatedNames[index] = event.target.value;
        setTeamNames(updatedNames);
        const allNamesEntered = updatedNames.every(name => name.trim() !== '');
        setRandomizeButtonVisible(allNamesEntered);
    };

    const shuffleTeams = () => {
        const shuffledNames = [...teamNames];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }
        setTeamNames(shuffledNames);
        const newMatches = [];

        let number = 0;
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
                "tournamentRoundText": "4", // Text for Round Header
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

        setMatches(newMatches);
        setGeneratedNumbers(listaNumeros);
    };
    const addMatch = (teamA, teamB) => {
        const newMatches = [];
        let number = numeroMatch;
        const match =
        {
            "id": `match-${number}`,
            "name": null,
            "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
            "tournamentRoundText": "4", // Text for Round Header
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
        setMatches(prevMatches => [...prevMatches, ...newMatches]);
        hola = []

    };


    const ganador = (matchId, nameWinner) => {
        const newListWinners = []
        if (teamCount === 2) {
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
        } else {
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
                    //console.log(match)
                    hola.push(match.participants[0])
                    //setListWinners(prevListWinners => [...prevListWinners, ...newListWinners])

                }else if (matchId === match.id && nameWinner === match.participants[1].name) {
                    match.state = "DONE"
                    match.participants[1].resultText = "Won"
                    match.participants[1].isWinner = true
                    match.participants[0].resultText = "Lost"
                    match.participants[0].isWinner = false
                    match.nextMatchId = `match-${number}`
                    setNumeroMatch(number)
                    //console.log(newListWinners)
                    hola.push(match.participants[1])
                    //setListWinners(prevListWinners => [...prevListWinners, ...newListWinners])
                }
            })

            if(hola.length > 1){
                addMatch(hola[0],hola[1])
            }

        }
        //console.log(matches)
    };

    //console.log(matches)

    const generadorEnfrentamientos = () => {
        if (teamCount === 2) {
            const finalMatch = matches[matches.length - 1];
            finalMatch.nextMatchId = null;
            const teamA = finalMatch.participants[0]
            const teamB = finalMatch.participants[1]
            return (
                <div>
                    {matches.length > 0 && (
                        <div>
                            <h2>Enfrentamientos</h2>
                            <ul>
                                {matches.map(match => (

                                    <li key={match.id}>
                                        {teamA.name} vs. {teamB.name} <br></br>
                                        {!match.state && (

                                            <button onClick={() => ganador(match.id, teamA.name)}>Ganador: {teamA.name} </button>
                                        )}
                                        {!match.state && (
                                            <button onClick={() => ganador(match.id, teamB.name)}>Ganador: {teamB.name}</button>

                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <SingleEliminationBracket
                        matches={matches}
                        matchComponent={Match}
                        svgWrapper={({ children, ...props }) => (
                            <SVGViewer width={800} height={500} {...props}>
                                {children}
                            </SVGViewer>
                        )}
                    />
                </div>
            )
        }
        else if (teamCount === 4) {
            const finalMatch = matches[matches.length - 1];
            console.log(finalMatch)
            return (
                <div>
                    {matches.length > 0 && matches.length < 3 &&(
                        <div>
                            <h2>Enfrentamientos</h2>
                            <ul>
                                {matches.map(match => (
                                    <li key={match.id}>

                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>

                                        <button onClick={() => ganador(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => ganador(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {console.log(matches.length)}
                    {matches.length === 3  &&(

                        <div>
                            
                            <h2>Final</h2>
                            <ul>
                                <li>
                                
                                {finalMatch.participants[0].name} vs. {finalMatch.participants[1].name} <br></br>
                                <button onClick={() => ganador(finalMatch.id, finalMatch.participants[0].name)}>Ganador: {finalMatch.participants[0].name}</button>
                                <button onClick={() => ganador(finalMatch.id, finalMatch.participants[1].name)}>Ganador: {finalMatch.participants[1].name}</button>
                                
                                </li>

                            </ul>
                        </div>
                    )}
                
                <SingleEliminationBracket
                    
                    matches={matches}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={800} height={500} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />

                </div>
            )

        }
        else if (teamCount === 8) {
            const finalMatch = matches[matches.length];
            console.log(finalMatch)
            return (
                <div>
                    {matches.length > 0 && matches.length < 7 &&(
                        <div>
                            <h2>Enfrentamientos</h2>
                            <ul>
                                {matches.map(match =>(
                                    <li>

                                        {match.participants[0].name} vs. {match.participants[1].name} <br></br>

                                        <button onClick={() => ganador(match.id, match.participants[0].name)}>Ganador: {match.participants[0].name}</button>
                                        <button onClick={() => ganador(match.id, match.participants[1].name)}>Ganador: {match.participants[1].name}</button>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {console.log(matches.length)}   
                    {matches.length > 2 && matches.length < 10 &&(
                        <div>
                            <h2>Enfrentamientos 2</h2>
                            <ul>
                            {finalMatch.participants[0].name} vs. {finalMatch.participants[1].name} <br></br>
                                <li>
                                <button onClick={() => ganador(finalMatch.id, finalMatch.participants[0].name)}>Ganador: {finalMatch.participants[0].name}</button>
                                <button onClick={() => ganador(finalMatch.id, finalMatch.participants[1].name)}>Ganador: {finalMatch.participants[1].name}</button>
                                </li>

                            </ul>
                        </div>
                    )}
                
                <SingleEliminationBracket
                    
                    matches={matches}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={800} height={500} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />

                </div>
            )

        }
        else {
            console.log(matches)
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
                <button onClick={shuffleTeams}>Randomizar enfrentamientos</button>
            )}
            {matches.length > 0 && (
                generadorEnfrentamientos())}






        </div>
    );
};

export default TournamentGenerator;
