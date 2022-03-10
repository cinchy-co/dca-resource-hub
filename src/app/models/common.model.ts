export interface ILegislation {
  Law: string;
  Passed: string;
  'Class': string;
  'Scope': string;
  'Sector': string;
  'Type': string;
  'Information': string;
  'Protects': string;
  'Regulates': string;
  'Summary': string;
  'Enforcers': string;
  'City': string;
  'Country': string;
  'Combine Country': string;
  'Region': string;
  'Supra': string;
  'Law Url': string;
  'Edit': string;
  'Tags': string;
  'Full Citation': string;
  tags: any;
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
  countrySelected?: string
}

export interface ITag {
  label: string;
  group: string;
}
