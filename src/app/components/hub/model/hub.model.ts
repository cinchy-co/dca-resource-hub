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
  toolLogoLink:  string;
  toolName:  string;
  toolRoute:  string;
  toolTags:  string;
}

export interface IEvents {
  title: string;
  date: string;
  time: string;
  timezone: string;
  image:  string;
  logo:  string;
  description:  string;
  rsvpLink:  string;
  zoomLink:  string;
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
