export interface ILegislation {
  Law: string;
  Passed: string;
  'Class': string;
  'Scope': string;
  'Sector': string;
  'Type Of Law': string;
  'Targeted Info': string;
  'Protects Who': string;
  'Regulates Who': string;
  'Summary': string;
  'Enforce Orgs': string;
  'City': string;
  'Country': string;
  'Region': string;
  'Supra': string;
  'Law Url': string;
}

export interface IOption {
  name: string;
  code: string;
}


export interface IAvatar {
  name: string;
  linkedinUrl: string;
  image: string;
}


export interface IDropdownClick {
  dropdownStr: string,
  countrySelected: string
}
