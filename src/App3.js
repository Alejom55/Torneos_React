import React from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

const matches = [
  {
    "id": 2,
    "name": "Semifinal",
    "nextMatchId": 4,
    "tournamentRoundText": "1",
    "startTime": "2023-10-30",
    "state": "DONE",
    "participants": [
      {
        "id": "participant-3",
        "resultText": "WON",
        "isWinner": false,
        "status": "PLAYED",
        "name": "Player C"
      },
      {
        "id": "participant-4",
        "resultText": null,
        "isWinner": true,
        "status": "PLAYED",
        "name": "Player D"
      }
    ]
  },
  {
    "id": 3,
    "name": "Semifinal",
    "nextMatchId": 4,
    "tournamentRoundText": "2",
    "startTime": "2023-11-01",
    "state": "DONE",
    "participants": [
      {
        "id": "participant-5",
        "resultText": null,
        "isWinner": false,
        "status": "PLAYED",
        "name": "Player A"
      },
      {
        "id": "participant-6",
        "resultText": "WON",
        "isWinner": true,
        "status": "PLAYED",
        "name": "Player B"
      }
    ]
  },
  {
    "id": 4,
    "name": "Final",
    "nextMatchId": null,
    "tournamentRoundText": "3",
    "startTime": "2023-11-03",
    "state": "DONE",
    "participants": [
      {
        "id": "participant-6",
        "resultText": "WON",
        "isWinner": false,
        "status": "PLAYED",
        "name": "Player C"
      },
      {
        "id": "participant-2",
        "resultText": null,
        "isWinner": true,
        "status": "PLAYED",
        "name": "Player B"
      }
    ]
  }
];

const App = () => (
  <div>
    <h1>Single Elimination Bracket</h1>
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
);

export default App;