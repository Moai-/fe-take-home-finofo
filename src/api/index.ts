import { Fruit } from "../types";

export const getFruit: () => Promise<Array<Fruit>> = () => new Promise<Array<Fruit>>(async (resolve, reject) => {

  const fruitData = await fetch('https://fruits-proxy.sv-gmyria.workers.dev');
  if (fruitData.ok) {
    resolve(await fruitData.json());
  } else {
    reject(`Could not get fruit (status ${fruitData.status})`)
  }

}) 