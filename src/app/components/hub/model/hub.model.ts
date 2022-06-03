export interface INewsFeed {
  creatorName: string;
  date: string;
  description: string;
  photo: string;
  title: string;
  type: string;
  link1: string;
  link1AnchorText: string;
  link2: string;
  link2AnchorText: string;
  tags: string;
  category: string;
  linksCount: number;
  [key: string|number]: any;
}

export interface INewsFeedFilter {
  filterTag: string;
  filterGroup: string;
  labelKey: string;
  id: string;
  isFeatured?: number;
}

export interface INewsSelectedFilter {
  filter: ISelectedFilter;
  labelKey: string;
}

export interface ISelectedFilter {
  name: string;
  id: string;
  isFeatured?: number;
}

export type IFeatures = {
  sequence: number;
  title: string;
  description: string;
  action: string;
  redirectRoute: string;
  image: string;
  logo: string;
}


export interface ITools {
  toolDesc: string;
  toolImage: string;
  toolLink: string;
  toolLogo: string;
  toolLogoLink: string;
  toolName: string;
  toolRoute: string;
  toolTags: string;
  videoLink: string;
  toolSequence?: number;
  title?: string;
}

export interface IToolSection {
  sectionName: string;
  format: string;
  queryDomain: string;
  queryName: string;
  sectionValue: string;
  details?: any;
}

export const FormatAndToolOverviewMap = {
  'No Header Video': {keyName: 'videoLink'},
  'No Header Text': {keyName: 'sectionValue', keyText: 'sectionText'},
  'Image and Title': {keyName: 'name', imageKey: 'logoImage', imageLinkKey: 'logoLink'},
  'Paragraph': {keyName: 'toolDesc'},
  'Table Query': {keyName: ''},
  'Paragraph and Cards': {
    keyName: 'sectionDesc', tableDescKey: 'tableDesc',
    tableImageKey: 'tableImage', tableLinkKey: 'tableLink', tableNameKey: 'tableName'
  },
  'Tags': {keyName: 'toolTags'},
}

export interface IToolDetails {
  'privacy-law-navigator': ITools;
  'privacy-legislation-navigator': ITools;
  'privacy-newsfeed': ITools;
  'privacy-regulator-navigator': ITools;
}

export type IToolsOverview = {
  [key in ToolIds]: any;
};


export type ToolIds =
  'privacy-law-navigator'
  | 'privacy-legislation-navigator'
  | 'privacy-newsfeed'
  | 'privacy-regulator-navigator' | 'collab-privacy-laws';

export type IdTypes = 'tool' | 'collab';

export interface IEvents {
  title: string;
  date: string;
  time: string;
  timezone: string;
  image: string;
  logo: string;
  description: string;
  rsvpLink: string;
  zoomLink: string;
}

export interface IBookmark {
  link: string;
  fullLink: string;
  title: string;
  desc: string;
  table: string;
  domain: string;
}

export interface ITables {
  tableName: string;
  tableDesc: string;
  tableLink: string;
  tableImage: string;
  tableTags: string;
}


export interface ICollab {
  link: string;
  resourceLink: string;
  title: string;
  desc: string;
  image: string;
  tags: string;
  collabRoute: string;
  collabId: string;
  toolName?: string; // only for hero anner
}
