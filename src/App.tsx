import * as React from "react";
import "./App.css";

import logo from "./logo.svg";

export enum MoneyType {
  Note,
  Coin
}
export type money = {
  type: MoneyType;
  amount: number;
  value: number;
  size?: 50 | 40 | 30 | 20 | 10;
};

export type appState = {
  amountInput: number;
  cash: money[];
  payoutBoxes: {
    largeCoins: money[];
    smallCoins: money[];
    notes: money[];
  };
};

const initialCash: money[] = [
  {
    type: MoneyType.Note,
    amount: 100,
    value: 1000
  },
  {
    type: MoneyType.Note,
    amount: 100,
    value: 500
  },
  {
    type: MoneyType.Note,
    amount: 100,
    value: 200
  },
  {
    type: MoneyType.Note,
    amount: 100,
    value: 100
  },
  {
    type: MoneyType.Note,
    amount: 100,
    value: 50
  },
  {
    type: MoneyType.Coin,
    amount: 100,
    value: 20,
    size: 40
  },
  {
    type: MoneyType.Coin,
    amount: 100,
    value: 10,
    size: 20
  },
  {
    type: MoneyType.Coin,
    amount: 100,
    value: 5,
    size: 50
  },
  {
    type: MoneyType.Coin,
    amount: 100,
    value: 2,
    size: 30
  },
  {
    type: MoneyType.Coin,
    amount: 100,
    value: 1,
    size: 10
  }
];
export const defaultState = {
  amountInput: 0,
  cash: initialCash,
  payoutBoxes: {
    notes: [],
    largeCoins: [],
    smallCoins: []
  }
};

export const withdraw = (state: appState) => {
  // Payout boxes
  const cash: money[] = [];
  const notes: money[] = [];
  const smallCoins: money[] = [];
  const largeCoins: money[] = [];
  let remainder = state.amountInput; /* Amount left to be payed out */
  // For each money type withdraw the closest amount that is a multiple of the value.
  state.cash.forEach(money => {
    const payout = { ...money, amount: Math.floor(remainder / money.value) };

    remainder = remainder - payout.value * payout.amount; // Remove the amout withdrawn from the ramainder
    cash.push({ ...money, amount: money.amount - payout.amount });

    if (payout.amount === 0) return; // if no payout is being made for this coin/note ignore the remaining steps

    if (payout.type == MoneyType.Note) {
      notes.push(payout);
    } else if (payout.size && payout.size > 20) {
      largeCoins.push(payout);
    } else {
      smallCoins.push(payout);
    }
  });
  return { ...state, cash, payoutBoxes: { notes, smallCoins, largeCoins } };
};

class App extends React.Component {
  state: appState;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <input
            type="text"
            value={this.state.amountInput}
            onChange={e =>
              this.setState({ amountInput: Number(e.target.value) })
            }
          />
          <button onClick={() => this.setState(withdraw)}> "withDraw" </button>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
