export interface IEnv {
  "authority": string;
  "cinchyRootUrl": string;
  "clientId": string;
  "redirectUri": string;
  "version": string;
}

export interface ILanding {
  gifLink: string;
  header: string;
  headerText: string;
  subHeader: string;
  subText: string;
  videoLink: string;
  textUnderSignIn: string;
  signInButton: string;
  footerText: string;
  copyrightText: string;
  privacyRoute: string;
  subText3: string;
  subText4: string;
  subText5: string;
  videoImage: string;
  videoLogo: string;
  videoHeader: string;
  videoButtonText: string;
  cardSetionHeader: string;
  logo: string;
  collabImage: string;
  collabHeader: string;
  button1Text: string;
  button1Link: string;
}

export interface ILandingFooter {
  sequence: number;
  footerTitle: string;
  footerLink: string;
  footerRoute: string;
  footerGroup: string;
}

export interface ILandingNav {
  page: string;
  sequence: number;
  customIconLanding: string;
  cardText: string;
  linkText: string;
  redirectRoute: string;
  redirectLink: string;
}

export interface ITestimonial {
  sequence: number;
  image: string;
  quote: string;
  title: string;
}

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
  'Enforcers-Id': string;
  'City': string;
  'Country': string;
  'Combine Country': string;
  'Region': string;
  'Supra': string;
  'Law Url': string;
  'Edit': string;
  'Tags': string;
  'Full Citation': string;
  Pending: string;
  tags: any;
  Bookmark: string;
  Share: string;
  Id: string
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
  Group?: string;
  Tags: string;
  TopTags?: string;
}


export interface IFilter {
  Labels: string;
}

export interface ISponsor {
  logoImage: string;
  logoLink: string;
  name: string;
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

export interface IField {
  description?: string;
  title: string;
  label: string;
  isMultiple: string;
  isCheckbox: string;
  isDisabled: string;
  width: number;
  isTextArea: string;
  isHidden?: string;
  isTextOnly: string;
}

export interface IFormField {
  description?: string;
  label: string;
  type?: FieldTypes;
  options?: any[];
  isMultiple: boolean;
  isCheckbox: boolean;
  isDisabled: boolean;
  id: string;
  width?: number;
  isTextArea?: boolean;
  isHidden?: boolean;
  isTextOnly?: boolean;
}

export interface IFooter {
  sequence: number;
  footerTitle: string;
  footerLink: string;
  footerRoute: string;
}


export interface ISocialMedia {
  socialSequence: number;
  socialTitle: string;
  socialIcon: string;
  socialLink: string;
}


export type FieldTypes = 'input' | 'link';
