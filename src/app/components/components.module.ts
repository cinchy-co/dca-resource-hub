import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from 'primeng/paginator';
import {CardModule} from 'primeng/card';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import {ChipModule} from 'primeng/chip';
import {ShareModule} from 'ngx-sharebuttons'
import {ShareIconsModule} from "ngx-sharebuttons/icons";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import {DcaCommonModule} from "../dca-common/dca-common.module";
import {RadioButtonModule} from 'primeng/radiobutton';
import {EllipsisModule} from 'ngx-ellipsis';

import {HeaderComponent} from './header/header.component';
import {AvatarsComponent} from "./avatars/avatars.component";
import {FooterComponent} from './footer/footer.component';
import {PipesModule} from "../pipes/pipes.module";
import {ProfileComponent} from './profile/profile.component';
import {SidebarModule} from "primeng/sidebar";
import {DividerModule} from "primeng/divider";
import {ProfileFormComponent} from './profile-form/profile-form.component';
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {MultiSelectModule} from "primeng/multiselect";
import {InputTextareaModule} from "primeng/inputtextarea";
import { ProfilePreferencesComponent } from './profile-preferences/profile-preferences.component';


@NgModule({
  declarations: [
    HeaderComponent,
    AvatarsComponent,
    FooterComponent,
    ProfileComponent,
    ProfileFormComponent,
    ProfilePreferencesComponent,
  ],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    CardModule,
    SelectButtonModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    AccordionModule,
    ProgressSpinnerModule,
    CarouselModule,
    ChipModule,
    ShareModule,
    ShareIconsModule,
    ShareButtonsModule,
    DcaCommonModule,
    RadioButtonModule,
    EllipsisModule,
    PipesModule,
    SidebarModule,
    DividerModule,
    ToastModule,
    InputTextModule,
    CheckboxModule,
    MultiSelectModule,
    InputTextareaModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    AvatarsComponent
  ]
})
export class ComponentsModule {
}
