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


export interface IWebsiteDetails {
  route: string;
  routeId: string;
  metaTitle: string;
  metaDesc: string;
  metaImg: string;
  metaAuthor: string;
  heroHeader: string;
  heroDesc: string;
  heroLinkLabel: string;
  heroLinkUrl: string;
  heroVideo: string;
  insideSectionButton?: string;
}

export interface IUser {
  displayName: string;
  name: string;
  username: string;
  photo: string;
  joinedDate: string;
}

export interface IFooter {
  sequence: number;
  footerTitle: string;
  footerLink: string;
}


export interface ISocialMedia {
  socialSequence: number;
  socialTitle: string;
  socialIcon: string;
  socialLink: string;
}
