// simple id generator without extra deps
export const nanoid = () => Math.random().toString(36).slice(2, 10);
