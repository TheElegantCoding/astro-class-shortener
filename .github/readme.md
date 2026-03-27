<img src="./asset/illustration/wave_header.svg" width="100%" align="center"/>

<h1 id="top" align="center">
  <img src="./asset/icon/astro.svg" width="32px" align="center" />
  Astro class name shortener
</h1>

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<pre align="center">
  <a href="#installation">📦 SETUP</a> • <a href="#configuration">⚙️ CONFIGURATION</a> • <a href="#features">️️️🛰️ FEATURES</a>
</pre>

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<br />
<img src="./asset/illustration/cover.svg" width="100%" align="center" />

<br />

<div align="center">
  <img src="./asset/illustration/astro_badget.svg" height="28px" />&nbsp;&nbsp;&nbsp;
  <img src="./asset/illustration/bun_badget.svg" height="28px" />&nbsp;&nbsp;&nbsp;
  <img src="./asset/illustration/node_badget.svg" height="28px" />&nbsp;&nbsp;&nbsp;
  <img src="./asset/illustration/typescript_badget.svg" height="28px" />&nbsp;&nbsp;&nbsp;
  <img src="./asset/illustration/npm_badget.svg" height="28px" />&nbsp;&nbsp;&nbsp;
  <img src="./asset/illustration/git_badget.svg" height="28px" />
</div>

<br />

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<h2 id="about">
  <img src="./asset/icon/information.svg" width="24px" align="center"/>
  About
</h2>

<table border="0">
<tr>
<td>
  An Astro integration to minify and mangle CSS class names across HTML, CSS, and JS files. Boost performance by reducing payload size and obfuscate your source code structure.
</td>
</tr>
</table>

<br />

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<h2 id="table-of-content">
  <img src="./asset/icon/book.svg" width="24px" align="center"/>
  Table of content
</h2>

- [<img src="./asset/icon/information.svg" width="20px" align="center" /> About](#about)
- [<img src="./asset/icon/thunder.svg" width="20px" align="center" /> Requirements](#requirements)
- [<img src="./asset/icon/package.svg" width="20px" align="center" /> Installation](#installation)
- [<img src="./asset/icon/rocket.svg" width="20px" align="center" /> Usage](#usage)
- [<img src="./asset/icon/gear.svg" width="20px" align="center" /> Configuration](#configuration)

<br />

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<h2 id="requirements">
  <img src="./asset/icon/thunder.svg" width="24px" align="center" />
  Requirements
</h2>

- <img src="./asset/icon/node.svg" width="20px" align="center" /> node >= **22.17.0**
- <img src="./asset/icon/bun.svg" width="20px" align="center" /> bun >= **1.1.0**

<br />

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />

<h2 id="installation">
  <img src="./asset/icon/package.svg" width="24px" align="center" />
  Installation
</h2>

<h3><img src="./asset/icon/bun.svg" width="24px" align="center" /> Bun</h3>

```bash
bun i -D astro-class-shortener
```

<h3><img src="./asset/icon/npm.svg" width="24px" align="center" /> Npm</h3>

```bash
npm i -D astro-class-shortener
```

<h3><img src="./asset/icon/pnpm.svg" width="24px" align="center" /> Pnpm</h3>

```bash
pnpm i -D astro-class-shortener
```

<h3><img src="./asset/icon/yarn.svg" width="24px" align="center" /> Yarn</h3>

```bash
yarn i -D astro-class-shortener
```

<br />

<img 
  src="./asset/illustration/divider.svg" 
  alt="divider" 
  width="100%" 
  align="center"
/>

<h2 id="usage">
  <img src="./asset/icon/rocket.svg" width="24px" align="center" />
  Usage
</h2>

In your `astro.config.ts` file add the following code in integrations:

```ts
  import { defineConfig } from 'astro/config';
  import { classShortener } from 'astro-class-shortener'; 

  export default defineConfig({
    integrations: [ classShortener() ]
  });
```

<br />

<img src="./asset/illustration/divider.svg" alt="divider" width="100%" align="center" />


<h2 id="configuration">
  <img src="./asset/icon/gear.svg" width="24px" align="center" />
  Configuration
</h2>

Extra settings that can be added.

```ts
  import { defineConfig } from 'astro/config';
  import { classShortener } from 'astro-class-shortener'; 

  export default defineConfig({
    integrations: [ 
      classShortener({
        // Exclude some classes to be renamed and shorted
        exclude: [ 'is-active' ]
      }) 
    ]
  });
```

<br />

<img 
  src="./asset/illustration/divider.svg" 
  alt="divider" 
  width="100%" 
  align="center"
/>

<pre align="center">
  <a href="#top">BACK TO TOP</a>
</pre>

<img 
  src="./asset/illustration/divider.svg" 
  alt="divider" 
  width="100%" 
  align="center"
/>

<pre align="center">
  Copyright © All rights reserved
  developed by LuisdaByte and
</pre>
<div align="center">
  <img src="./asset/illustration/astralys_logo.svg" width="120px" align="center" />
</div>

<img src="./asset/illustration/wave_footer.svg" width="100%" align="center" />