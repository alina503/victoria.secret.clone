export const ROUTES = {
  home: 'index.html',
  cart: 'cos-de-cumparaturi.html',
  login: 'login.html',
  register: 'inregistrare.html',
  pink: 'pink.html',
  beauty: 'vs-beauty.html',
  nou: 'nou.html',
  sutiene: 'sutiene.html',
  chiloti: 'chiloti.html',
  lenjerie: 'lenjerie.html',
  pijama: 'pijama.html',
  haineSport: 'haine-sport.html',
  accesorii: 'accesorii.html',
  swim: 'swim.html',
  vsNow: 'vs-now.html',
} as const;

export type RouteKey = keyof typeof ROUTES;
