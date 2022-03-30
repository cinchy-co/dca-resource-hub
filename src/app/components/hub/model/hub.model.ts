export interface IHubSidebarItems {
  icon: string;
  label: string;
  route: string;
}

export const HubSidebarOptions: IHubSidebarItems[] = [
  {icon: 'pi-home', label: 'Home', route: '/'},
  {icon: 'pi-compass', label: 'Tools', route: '/tools'},
  {icon: 'pi-table', label: 'Tables', route: '/tables'},
  {icon: 'pi-comments', label: 'Suggestions', route: '/suggestions'},
  {icon: 'pi-star', label: 'Bookmarks', route: '/bookmarks'},
]
