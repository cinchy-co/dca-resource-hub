import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {AppStateService} from "../../../services/app-state.service";
import {IActivity, ICollab, ICollabMessage, IComments} from "../model/hub.model";
import {ApiCallsService} from "../../../services/api-calls.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem, MessageService} from "primeng/api";
import {ReplaySubject, take, takeUntil} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {WindowRefService} from "../../../services/window-ref.service";
import {animate, style, transition, trigger} from '@angular/animations';
import {IUser} from "../../../models/common.model";
import {ContextMenu} from "primeng/contextmenu";
import {TieredMenu} from "primeng/tieredmenu";

@Component({
  selector: 'app-collab-details',
  templateUrl: './collab-details.component.html',
  styleUrls: ['./collab-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollabDetailsComponent implements OnInit, OnDestroy {
  collabDetails: ICollab;
  collabs: ICollab[];
  items: MenuItem[];
  currentTab: string = 'overview';
  currentMenuItem: MenuItem;
  activities: any;
  openActivities: any;
  filteredActivities: any;
  myActivities: any;
  expansionState: any = {};
  collabMessages: ICollabMessage[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  userDetails: IUser;
  showEditDialog: boolean;
  currentMessage: ICollabMessage;
  currentCommentsParent: ICollabMessage;
  showNewMessage: boolean;
  commentsForMessages: IComments = {};
  currentComment: ICollabMessage;
  showEditCommentDialog: boolean;
  showEditEndDate: boolean;
  actionItems: MenuItem[];
  commentClicked: boolean;
  doAutoFocus: boolean;
  allAssignedTo: any;
  endDateValue: any;
  currentRow: any;
  members: any;
  isAllowedMessages: boolean;

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private changeDetection: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  async ngOnInit() {
    this.collabDetails = this.appStateService.currentCollab;
    this.setTabItems();
    this.setActionItems();
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      this.currentTab = params['tab'] ? params['tab'] : 'overview';
      this.currentMenuItem = this.items.find(item => item.id?.toLowerCase() === this.currentTab?.toLowerCase()) || this.items[0];
      console.log('1111 CURRENT TAB', this.currentTab)
    });

    if (!this.collabDetails?.collabId) {
      this.collabs = await this.appApiService.getHubCollabs().toPromise();
      this.collabDetails = this.collabs.find(collab => `/${collab.collabRoute}` === this.router.url.split('?')[0]) as ICollab;
      this.appStateService.currentCollab = this.collabDetails;
      this.getCollabActivities();
      this.getCollabMessages();
    } else {
      this.getCollabActivities();
      this.getCollabMessages();
    }
  }

  getCollabActivities() {
    this.appApiService.getHubCollabActivities(this.collabDetails.collabId).pipe(take(1)).subscribe(activities => {
      this.openActivities = activities;
      this.filteredActivities = activities;
      this.setAssigneeValues();
      this.changeDetection.detectChanges();
    });
  }

  getCollabMembers() {
    this.appApiService.getCollabMembers(this.collabDetails.collabId).pipe(take(1)).subscribe(members => {
      this.members = members;
      this.isAllowedMessages = this.members?.find((member: any) => member.username === this.userDetails.username)
    })
  }

  setAssigneeValues() {
    this.allAssignedTo = this.openActivities?.map((item: { [x: string]: any; }) => item['Assigned To']);
    this.allAssignedTo = this.allAssignedTo?.filter((item: { [x: string]: any; }) => item);
    this.allAssignedTo = [...new Set(this.allAssignedTo)];
  }

  onAssigneeChange(e: any, columnName: string) {
    if (!e.value?.length) {
      this.filteredActivities = this.openActivities;
    }
    this.filteredActivities = this.openActivities.filter((item: { [x: string]: any; }) => e.value.includes(item[columnName]));
    this.filteredActivities = this.filteredActivities?.length ? this.filteredActivities : this.openActivities;
    this.changeDetection.detectChanges();
  }

  getMyCollabActivities() {
    this.appApiService.getMyCollabActivities(this.collabDetails.collabId, this.userDetails.username)
      .pipe(take(1)).subscribe(activities => {
      this.myActivities = activities;
      this.changeDetection.detectChanges();
    });
  }

  getCols(tableFirstRow: any): string[] {
    return Object.keys(tableFirstRow).filter(key => key !== 'Id');
  }

  openEditDateModal(row: any) {
    this.currentRow = row;
    this.showEditEndDate = true;
  }

  async updateEndDate(activity: any) {
    try {
      await this.appApiService.updateEndDate(this.endDateValue.toISOString(), activity.Id).toPromise();
      this.showEditEndDate = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Update Successful',
        detail: 'End date has been updated'
      });
      this.getCollabActivities();
    } catch (e) {
      this.messageService.add({
        severity: 'error',
        summary: 'Network error',
        detail: 'Please try again after other time'
      });
    }
  }

  goToActivity(activity: IActivity) {
    const url = activity.link;
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
  }

  goToCommunity() {
    this.router.navigate(['/data-collaboration'], {
      queryParams: {
        scrollToId: 'CommunityGuidelines'
      }
    });
  }

  joinCollab() {
    this.currentMenuItem = this.items.find(item => item.id?.toLowerCase() === 'overview') || this.items[0];
    this.tabClicked('overview');
    this.changeDetection.detectChanges();
  }

  toggleExpansions(activity: IActivity) {
    this.expansionState[activity.cinchyId] = !this.expansionState[activity.cinchyId];
  }

  async getCollabMessages() {
    this.appApiService.getHubCollabMessages(this.collabDetails.collabId).pipe(take(1)).subscribe(collabMessages => {
      this.collabMessages = collabMessages.reverse();
      this.appStateService.getUserDetailsSub().pipe(takeUntil(this.destroyed$))
        .subscribe(async (userDetails: IUser) => {
          this.userDetails = userDetails;
          this.getCollabMembers();
          //  this.getMyCollabActivities();
          this.collabMessages = this.collabMessages.map(message => {
            return {...message, canUpdateOrDelete: this.userDetails.username === message.username}
          });
          this.changeDetection.detectChanges();
        })
    });
  }

  getMessageWithLinks(messageDesc: string) {
    return messageDesc.replace(
      /(https?:\/\/)([^ ]+)/g,
      '<a target="_blank" class="link-color" href="$&">$2</a>'
    );
  }

  showNewMessageForm() {
    this.showNewMessage = !this.showNewMessage;
  }

  messageAdded(formValues: any, isEdit?: boolean) {
    this.getCollabMessages();
  }

  getNewOrUpdatedMessage(formValues: any, isEdit?: boolean, isComment?: boolean): ICollabMessage {
    return {
      date: new Date().toDateString(),
      title: formValues.title,
      description: formValues.message,
      creatorName: this.userDetails.name,
      id: isEdit ? formValues.id : Math.random().toString(),
      edited: !!isEdit,
      canUpdateOrDelete: true,
      username: this.userDetails.username,
      numberComments: 0,
      parentId: isComment ? this.currentComment.parentId : ''
    }
  }

  editMessage(message: ICollabMessage) {
    this.showEditDialog = true;
    this.currentMessage = message;
  }

  async deleteMessage(message: ICollabMessage, isComment?: boolean) {
    try {
      await this.appApiService.deleteMessage(message.id).toPromise();
      const messageToFilterFrom = isComment ? this.commentsForMessages[this.currentCommentsParent.id] : this.collabMessages;
      if (isComment) {
        this.commentsForMessages[this.currentCommentsParent.id] = messageToFilterFrom?.filter(item => item.id !== message.id);
        const currentCommentsTotal = this.currentCommentsParent.numberComments;
        this.currentCommentsParent.numberComments = currentCommentsTotal ? currentCommentsTotal - 1 : 0;
      } else {
        this.collabMessages = messageToFilterFrom?.filter(item => item.id !== message.id) as ICollabMessage[];
      }
      this.successMessage();
      this.changeDetection.detectChanges();
    } catch (e) {
      this.errorMessage();
    }
  }

  async getComments(message: ICollabMessage, numberComments?: boolean) {
    this.currentCommentsParent = message;
    this.doAutoFocus = !numberComments;
    this.commentsForMessages[message.id] = await this.appApiService.getHubCollabCommentsPerMessage(message.id).toPromise();
    this.commentsForMessages[message.id] = this.commentsForMessages[message.id]?.map(comment => {
      return {...comment, canUpdateOrDelete: this.userDetails.username === comment.username}
    })
    this.changeDetection.markForCheck();
  }

  commentAdded(formValues: any, isEdit?: boolean) {
    this.currentCommentsParent = this.collabMessages.find(message => message.id === formValues.msgId) as ICollabMessage;
    this.getComments(this.currentCommentsParent)
    const newComment: ICollabMessage = this.getNewOrUpdatedMessage(formValues, isEdit);
    this.currentComment = isEdit ? {...this.currentComment, ...newComment} : this.currentComment;
    const currentCommentsTotal = this.currentCommentsParent.numberComments;
    this.currentCommentsParent.numberComments = isEdit ? currentCommentsTotal : currentCommentsTotal ? currentCommentsTotal + 1 : 1;
  }

  editComment(comment: ICollabMessage) {
    this.showEditCommentDialog = true;
    this.currentComment = comment;
  }

  closeComments(message: ICollabMessage) {
    // this.currentCommentsParent = {} as ICollabMessage;
    this.commentsForMessages[message.id] = undefined;
  }

  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Delete Successful',
      detail: 'Your message has been deleted'
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Network error',
      detail: 'Please try again after other time'
    });
  }

  setTabItems() {
    this.items = [
      {
        label: 'Overview', id: 'overview', icon: 'pi pi-fw pi-home',
        command: () => {
          this.tabClicked('overview');
        }
      },
      {
        label: 'Activities', id: 'activities', icon: 'pi pi-fw pi-cog',
        command: () => {
          this.tabClicked('activities');
        }
      },
      {
        label: 'Messages', id: 'messages', icon: 'pi pi-comments',
        command: () => {
          this.tabClicked('messages');
        }
      }
    ];
  }

  tabClicked(tabId: string) {
    this.currentTab = tabId;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tab: tabId
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
    });
  }

  showContext(cm: TieredMenu, event: MouseEvent, message: ICollabMessage, isComment?: boolean) {
    this.commentClicked = !!isComment;
    if (isComment) {
      this.currentCommentsParent = (this.collabMessages.find(parent => parent.id == message.parentId)) as ICollabMessage;
      this.currentComment = message;
    } else {
      this.currentMessage = message;
    }
    cm.toggle(event);
    event.stopPropagation();
  }

  setActionItems() {
    this.actionItems = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          if (this.commentClicked) {
            this.editComment(this.currentComment);
          } else {
            this.editMessage(this.currentMessage);
          }
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: (event) => {
          const messageToDelete = this.commentClicked ? this.currentComment : this.currentMessage;
          this.deleteMessage(messageToDelete, this.commentClicked);
        }
      }
    ];
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
