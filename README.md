# ff-scroll

## Installation

To install this library, run:

```bash
$ npm install ff-scroll --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ff-scroll
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { FFScrollModule } from 'ff-scroll';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    FFScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its directive in your Angular application:

```xml
<!-- You can now use your library directive in app.component.html -->
<h1>
  {{title}}
</h1>
<div ffScroll></div>
```

You also can use Options Object. You just use attr ffOptions and some object with options:

```xml
<h1>
  {{title}}
</h1>
<div ffScroll [ffOptions]={key:value}></div>
```

### Default properties which you can change : ###

```typescript
{
      offsetTop: 50,
      offsetLeft: 50,
      offsetRight: 50,
      offsetBottom: 50,
      beforeView: 'beforeView',
      inView: 'inView',
      afterView: 'afterView',
      animationClass: 'ff-animation',
      animationDuration: 500
}
```


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Frontend Freelancer](mailto:marat@frontend-freelancer.com)
