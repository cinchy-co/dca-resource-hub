import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

export enum TwitterCard {
  LargeImage = 'summary_large_image',
  Player = 'player'
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {


  constructor(private title: Title, private meta: Meta) {
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({property: 'og:url', content: url});
  }

  updateOgImage(imageUrl: string) {
    this.meta.updateTag({property: 'og:image', content: imageUrl});
    this.meta.updateTag({property: 'twitter:image', content: imageUrl});
  }

  updateOgTitle(desc: string) {
    this.meta.updateTag({property: 'og:title', content: desc});
    this.meta.updateTag({property: 'twitter:title', content: desc});
  }

  updateOgDescription(desc: string) {
    this.meta.updateTag({property: 'og:description', content: desc});
    this.meta.updateTag({property: 'twitter:description', content: desc});
  }

  updateTwitterCardType(cardType: TwitterCard) {
    this.meta.updateTag({property: 'twitter:card', content: cardType});
  }

  updateTwitterPlayerUrl(url: string) {
    this.meta.updateTag({property: 'twitter:player', content: url});
    this.meta.updateTag({property: 'twitter:player:width', content: '1280'});
    this.meta.updateTag({property: 'twitter:player:height', content: '720'});
  }

  setDefaultsOgs() {
    //this.meta.updateTag({property: 'og:url', content: window.location.href});
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://cinchy.tv/assets/share-img.png'
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Discover New Video Content from Cinchy and Data Fabric Video Content on cinchy.tv'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Visit Cinchy.tv to watch on-demand learning sessions, demos, and other exciting content from Cinchy'
    });

    this.updateTwitterCardType(TwitterCard.LargeImage);
    this.meta.updateTag({
      property: 'twitter:player',
      content: 'null'
    });
    this.meta.updateTag({
      property: 'twitter:image',
      content: 'https://cinchy.tv/assets/share-img.png'
    });
    this.meta.updateTag({
      property: 'twitter:site',
      content: '@itscinchy'
    });
    this.meta.updateTag({
      property: 'twitter:title',
      content: 'Discover New Video Content from Cinchy and Data Fabric Video Content on cinchy.tv'
    });
    this.meta.updateTag({
      property: 'twitter:description',
      content: 'Visit Cinchy.tv to watch on-demand learning sessions, demos, and other exciting content from Cinchy'
    });
  }
}
