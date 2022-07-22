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

@Component({
  selector: 'app-collab-details',
  templateUrl: './collab-details.component.html',
  styleUrls: ['./collab-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({height: 0, opacity: 0}),
            animate('200ms ease-out',
              style({height: 300, opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({height: 300, opacity: 1}),
            animate('200ms ease-in',
              style({height: 0, opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class CollabDetailsComponent implements OnInit, OnDestroy {
  collabDetails: ICollab;
  collabs: ICollab[];
  items: MenuItem[];
  currentTab: string = 'overview';
  currentMenuItem: MenuItem;
  activities: IActivity[];
  expansionState: any = {};
  collabMessages: ICollabMessage[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  userDetails: IUser;
  showEditDialog: boolean;
  currentMessage: ICollabMessage;
  currentCommentsParent: ICollabMessage;
  showNewMessage: boolean;
  commentsForMessages: IComments = {};

  constructor(private appStateService: AppStateService, private appApiService: ApiCallsService,
              private router: Router, private changeDetection: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService, private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  async ngOnInit() {
    this.collabDetails = this.appStateService.currentCollab;
    this.setTabItems();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.currentTab = params['tab'] ? params['tab'].toLowerCase() : 'overview';
      this.currentMenuItem = this.items.find(item => item.id === this.currentTab) || this.items[0];
    });

    if (!this.collabDetails?.collabId) {
      this.collabs = await this.appApiService.getHubCollabs().toPromise();
      this.collabDetails = this.collabs.find(collab => `/${collab.collabRoute}` === this.router.url.split('?')[0]) as ICollab;
      this.appStateService.currentCollab = this.collabDetails;
      this.getCollabActivities();
      this.getCollabMessages();
      console.log('1111 CURRENT TAB', this.collabDetails);

    } else {
      this.getCollabActivities();
      this.getCollabMessages();
    }
  }

  getCollabActivities() {
    this.appApiService.getHubCollabActivities(this.collabDetails.collabId).pipe(take(1)).subscribe(activities => {
      this.activities = activities;
      this.changeDetection.detectChanges();
    });
  }

  goToActivity(activity: IActivity) {
    const url = activity.link;
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.open(url, '_blank');
    }
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
          this.collabMessages = this.collabMessages.map(message => {
            return {...message, canUpdateOrDelete: this.userDetails.username === message.username}
          })
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
    const newMessage: ICollabMessage = this.getNewOrUpdatedMessage(formValues, isEdit);
    this.currentMessage = isEdit ? {...this.currentMessage, ...newMessage} : this.currentMessage;
    if (isEdit) {
      this.collabMessages = this.collabMessages.filter(message => message.id !== this.currentMessage.id);
      this.collabMessages.unshift(this.currentMessage);
    } else {
      this.collabMessages.unshift(newMessage);
    }
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
      parentId: isComment ? this.currentCommentsParent.parentId : ''
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
        this.commentsForMessages[this.currentCommentsParent.id] = messageToFilterFrom.filter(item => item.id !== message.id)
      } else {
        this.collabMessages = messageToFilterFrom.filter(item => item.id !== message.id);
      }
      this.successMessage();
      this.changeDetection.detectChanges();
    } catch (e) {
      this.errorMessage();
    }
  }

  async getComments(message: ICollabMessage) {
    this.currentCommentsParent = message;
    this.commentsForMessages[message.id] = await this.appApiService.getHubCollabCommentsPerMessage(message.id).toPromise();
    this.commentsForMessages[message.id] = this.commentsForMessages[message.id].map(comment => {
      return {...comment, canUpdateOrDelete: this.userDetails.username === comment.username}
    })
    console.log('1111 COMMENTS', this.commentsForMessages);
    this.changeDetection.markForCheck();
  }

  commentAdded(formValues: any, isEdit?: boolean) {
    const newComment: ICollabMessage = this.getNewOrUpdatedMessage(formValues, isEdit);
//    this.currentMessage = isEdit ? {...this.currentMessage, ...newComment} : this.currentMessage;
    if (isEdit) {
      this.collabMessages = this.collabMessages.filter(message => message.id !== this.currentMessage.id);
      this.collabMessages.unshift(this.currentMessage);
    } else {
      this.commentsForMessages[this.currentCommentsParent.id].unshift(newComment);
    }
    this.changeDetection.detectChanges();
  }

  closeComments() {
    this.currentCommentsParent = {} as ICollabMessage;
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
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
