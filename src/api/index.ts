import { Fruit } from "../types";

export const getFruit: () => Promise<Array<Fruit>> = () => new Promise<Array<Fruit>>(async (resolve, reject) => {

  const fruitData = await fetch('https://fruity-proxy.vercel.app/api/fruits', {
    headers: {
      'x-api-key': 'fruit-api-challenge-2025'
    }
  });
  if (fruitData.ok) {
    resolve(await fruitData.json());
  } else {
    reject(`Could not get fruit (status ${fruitData.status})`)
  }

}) 