import * as React from "react";
import {range} from 'ramda';
import "./App.css";

const COIN_SCALE = 1.5; 

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
  error: string | null;

};

const initialCash: money[] = [
  {
    type: MoneyType.Note,
    amount: 10,
    value: 1000
  },
  {
    type: MoneyType.Note,
    amount: 10,
    value: 500
  },
  {
    type: MoneyType.Note,
    amount: 10,
    value: 200
  },
  {
    type: MoneyType.Note,
    amount: 10,
    value: 100
  },
  {
    type: MoneyType.Note,
    amount: 10,
    value: 50
  },
  {
    type: MoneyType.Coin,
    amount: 10,
    value: 20,
    size: 40
  },
  {
    type: MoneyType.Coin,
    amount: 10,
    value: 10,
    size: 20
  },
  {
    type: MoneyType.Coin,
    amount: 10,
    value: 5,
    size: 50
  },
  {
    type: MoneyType.Coin,
    amount: 10,
    value: 2,
    size: 30
  },
  {
    type: MoneyType.Coin,
    amount: 10,
    value: 1,
    size: 10
  }
];
// Singe app state 
export const defaultState = {
  amountInput: 0,
  cash: initialCash,
  payoutBoxes: {
    notes: [],
    largeCoins: [],
    smallCoins: []
  },
  error: null
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
    const payout = { ...money, amount: Math.min(Math.floor(remainder / money.value), money.amount) };

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

  // If there is still a remainder we cannot payout the correct amount. Return an error instead and return to the previous state.
  if (remainder > 0) return {...state, error: "Not enough money to process your transaction", payoutBoxes: {largeCoins: [], smallCoins: [], notes: []}}
  return { ...state, cash, payoutBoxes: { notes, smallCoins, largeCoins }, error: null };
};


const renderNote = (money:money, i:number) => 
  <div key={`${money.value}_${i}`} className="note">
    <span className="value">
      {money.value}
    </span>
  </div>

const renderCoin = (money:money, i:number) => {
  let size = money.size ? money.size * COIN_SCALE : 20;
  return (
    <div key={`${money.value}_${i}`} className="coin" style={{width:size, height: size}}>
      <span className="value">
        {money.value}
      </span>
    </div>
  )
}

const renderMoney = (money:money, i:number) => 
  money.type == MoneyType.Note ? renderNote(money, i) : renderCoin(money, i) 

// expand money so each entry has an amount of 1 then render each entry
const renderBox =(money: money[]) =>
  money.map((m) => 
    range(0, m.amount)
      .map(i=> renderMoney({...m, amount: 1}, i))
  )

class App extends React.Component {
  state: appState;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }
  public render() {
    const onSubmit = (e:React.FormEvent) => {
      e.preventDefault();
      this.setState(withdraw)
    }
    return (
      <div className="atm">
        <header className="header">
          <h1 className="title">Free Money ATM!</h1>
        </header>
        <form onSubmit={onSubmit} className="form">
          <input
            className="amountInput"
            type="text"
            autoFocus
            value={this.state.amountInput}
            onChange={e =>
              this.setState({ amountInput: Number(e.target.value) })
            }
          />
          <button type="submit" className="withdraw-button"> withDraw </button>
          <p className="error-message"> {this.state.error} </p>
        </form>
        <div className="payoutBoxes">
          <div className="payoutBox">
            {renderBox(this.state.payoutBoxes.notes)}
          </div>
          <div className="payoutBox">
            {renderBox(this.state.payoutBoxes.largeCoins)}
          </div>
          <div className="payoutBox">
            {renderBox(this.state.payoutBoxes.smallCoins)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
