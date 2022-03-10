export interface ILaw {
  level2: string;
  level2Title: string;
  level3: string;
  label: string;
  desc: string;
  recitals: string;
  title: string;
  articleNumber: number;
  lawId: number;
  id: number;
  tags: string;
  tagsArr: string[];
  isLevel3?: boolean;
}

export interface IOption extends ILawOption{
  code: string;
}

/*
export const Legislation: IOption[] = [
  {name: 'PPIPS', code: 'ppips'},
  {name: 'GDPR', code: 'gdpr'}
]
*/

export interface ILawOption {
  law: string;
  name: string;
  lawDesc: string;
  id: number
}

export interface IKeyIssues {
  title: string;
  desc: string;
  law: string;
  lawId: number
  id: number;
  keyIssueDesc: string;
}
