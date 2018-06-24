import { defaultState, MoneyType, withdraw } from "./App";

it("withdraw returns the correct combination of coins and notes", () => {
  const state = { ...defaultState, amountInput: 522 };
  const newState = withdraw(state);
  expect(newState.payoutBoxes.notes).toEqual([
    {
      type: MoneyType.Note,
      value: 500,
      amount: 1
    }
  ]);
  expect(newState.payoutBoxes.largeCoins).toEqual([
    {
      type: MoneyType.Coin,
      value: 20,
      amount: 1,
      size: 40
    },
    {
      type: MoneyType.Coin,
      value: 2,
      amount: 1,
      size: 30
    }
  ]);
  expect(newState.payoutBoxes.smallCoins).toEqual([]);

  const totalCashBerfore = state.cash.reduce(
    (sum, { amount, value }) => sum + amount * value,
    0
  );
  const totalCashAfter = newState.cash.reduce(
    (sum, { amount, value }) => sum + amount * value,
    0
  );
  expect(totalCashBerfore - totalCashAfter).toBe(522);
  expect(newState === state).toBe(false); // verify that state has not been mutated
});

it("withdraw one of each type for 1888", () => {
  const state = { ...defaultState, amountInput: 1888 };
  const newState = withdraw(state);
  expect(newState.payoutBoxes.notes).toEqual([
    {
      type: MoneyType.Note,
      amount: 1,
      value: 1000
    },
    {
      type: MoneyType.Note,
      amount: 1,
      value: 500
    },
    {
      type: MoneyType.Note,
      amount: 1,
      value: 200
    },
    {
      type: MoneyType.Note,
      amount: 1,
      value: 100
    },
    {
      type: MoneyType.Note,
      amount: 1,
      value: 50
    }
  ]);
  expect(newState.payoutBoxes.largeCoins).toEqual([
    {
      type: MoneyType.Coin,
      amount: 1,
      value: 20,
      size: 40
    },
    {
      type: MoneyType.Coin,
      amount: 1,
      value: 5,
      size: 50
    },
    {
      type: MoneyType.Coin,
      amount: 1,
      value: 2,
      size: 30
    }
  ]);
  expect(newState.payoutBoxes.smallCoins).toEqual([
    {
      type: MoneyType.Coin,
      amount: 1,
      value: 10,
      size: 20
    },
    {
      type: MoneyType.Coin,
      amount: 1,
      value: 1,
      size: 10
    }
  ]);
  const totalCashBerfore = state.cash.reduce(
    (sum, { amount, value }) => sum + amount * value,
    0
  );
  const totalCashAfter = newState.cash.reduce(
    (sum, { amount, value }) => sum + amount * value,
    0
  );
  expect(totalCashBerfore - totalCashAfter).toBe(1888);
});
