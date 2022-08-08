import {SafeUrl} from "@angular/platform-browser";

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

  [key: string | number]: any;
}

export interface IGettingStarted {
  page: string;
  sectionName: string;
  sequence: number;
  details: string;
  image: string;
  tableQueryDomain: string;
  tableQueryName: string;
  sidebarRoute: string;
  id: string;
  tableDetails?: any
  video: string;
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

export type IToolSearch = 'App' | 'Description' | 'Id' | 'Tags'  | 'Title'  | 'Type' | 'TotalActionLinks' | 'Button-Label'
  | 'Route';

export type ToolSearchAction = {
  [key in IToolSearch | any]: any;
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

export type CalendarEvents = {
  [key in Calendar]: CalendarEvent;
};

export type CalendarEvent = {
  [key in any]: SafeUrl;
}

export type Calendar = 'google' | 'apple'

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
  duration: number;
  addToCalendar: string;
  id: string;
}

export interface IBookmark {
  link: string;
  fullLink: string;
  title: string;
  desc: string;
  table: string;
  domain: string;
  buttonLabel: string;
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

export interface ICollabMessage {
  creatorName: string;
  date: string;
  title: string;
  description: string;
  modifiedDate?: string;
  id: string;
  edited?: boolean;
  username: string;
  canUpdateOrDelete: boolean;
  numberComments?: number;
  parentId?: string;
}

export type IComments = {
  [key in any]: ICollabMessage[] | undefined;
}

export type IActivity = {
  collabId: string;
  desc: string;
  image: string;
  link: string;
  steps: string;
  tags: string;
  title: string;
  videoLink: string;
  cinchyId: number;
  buttonLabel: string;
}
