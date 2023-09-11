# Custom Figma to React Component

---

### Installation

---

##### Download the [Figma Desktop App](https://www.figma.com/downloads/)

Plugins can only be accessed through the desktop app.

##### Clone this repository

```shell
git clone https://github.com/kristenprescott/figma-to-react.git
```

##### Install dependencies and run the plugin locally

```shell
yarn install
yarn dev
```

##### Add the plugin to Figma

In the Figma app, go to `Plugins` > `Development` > `Import plugin from manifest` and select the `manifest.json` file from your local clone of this repository.

### Use

---

##### Select components

Select a component or group of components in Figma.
**Note**: not too many at once or you may overload the plugin and the code will be harder to decipher.

##### Run the plugin

Go to `Plugins` > `Development` and select `Figma to React Component`.
**Note**: Code export is currently a work in progess, but copy code functionality is useful in the meantime.

### Develop

---

This repo is a fork from [kazuyaseki/figma-to-react](https://github.com/kazuyaseki/figma-to-react) where you can find more information on further customizing this plugin. The `buildTagTree` method is a good place to start. Here is an excerpt from the README:

<!-- The [repo this was forked from](https://github.com/kazuyaseki/figma-to-react) has plenty of information on where to get started customizing this plugin for your own needs. Especially the `buildTagTree` method is a good place to start.

Here is an excerpt: -->

Feel free to folk this repository, create and publish your own Figma to Vue, Flutter, SwiftUI or whatsoever!

`buildTagTree` method would be useful for such case.
`buildTagTree` method outputs a `tag` object in the following format which is independent from how the final outcome is structured.

```ts
export type Tag = {
  name: string
  isText: boolean
  textCharacters: string | null
  isImg: boolean
  properties: Property[]
  css: CSSData
  children: Tag[]
}
```
