export interface INewsFeed {
  creatorName: string;
  date: string;
  description: string;
  photo: string;
  title: string;
  type: string;
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

export type ToolIds =
  'privacy-law-navigator'
  | 'privacy-legislation-navigator'
  | 'privacy-newsfeed'
  | 'privacy-regulator-navigator';

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
}
