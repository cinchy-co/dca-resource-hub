export interface IPpips {
  division: string;
  article: string;
  details: string;
  category: string;
  commentary: string;
  id: number;
}

export interface IOption {
  name: string;
  code: string;
}

export const Legislation: IOption[] = [
  {name: 'PPIPS', code: 'ppips'}/*,
  {name: 'GDPR', code: 'gdpr'}*/
]
