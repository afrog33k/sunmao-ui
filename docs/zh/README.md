<div align="center">
  <a href='https://sunmao-ui.com' target='_blank'>
    <img src="../images/logo.png" alt="logo" width="200"  />
  </a>
</div>
<div align="center">
  <h1>Sunmao</h1>
</div>

<p align="center">
  <img alt="Apache-2.0 License" src="https://img.shields.io/github/license/smartxworks/sunmao-ui"/>
  <a href="https://github.com/smartxworks/sunmao-ui/issues">
    <img src="https://img.shields.io/github/issues/smartxworks/sunmao-ui" alt="GitHub issues">
  </a>
  <img alt="Github Stars" src="https://badgen.net/github/stars/smartxworks/sunmao-ui" />
  <a href="https://join.slack.com/t/sunmao/shared_invite/zt-1cgk81ebm-DyG9p2D5GNFS6vtbQwWj7A">
    <img src="https://img.shields.io/badge/slack-@sunmao-purple.svg?logo=slack" alt="Join the chat at Slack">
  </a>
</p>

Sunmao(榫卯)是一个前端低代码框架。通过 Sunmao，您可以轻松将各种前端 UI 组件库和自己开发的前端组件，封装成低代码组件库，从而搭建您自己的低代码 UI 开发工具，使前端开发变得如榫卯般严丝合缝。

## DEMO

Sunmao 的官网就是由 Sunmao 开发的，可以即刻体验：[Sunmao 官网](https://sunmao-ui.com/dev.html)

我们还提供了一个项目模板，开箱即用：[Sunmao Starter Kit](https://github.com/webzard-io/sunmao-start)

## 为什么选择 Sunmao？

### 响应式的低代码框架

Sunmao 选择了简单易懂且性能优秀的响应式方案，使得 Sunmao 用起来符合直觉，能够快速上手。

### 强大的低代码 GUI 编辑器

Sunmao 内置了低代码工具的 GUI 编辑器，几乎囊括了一个完整的低代码编辑器应该具备的所有能力。

### 强大的可扩展性

无论是 UI 组件库本身，还是低代码编辑器，都支持自定义扩展。开发者可以注册各类复杂、适用于特定领域的组件，以此覆盖应用需求以及延续已有的视觉设计体系。

### 类型安全

无论是在开发 Sunmao 组件时，还是在使用 Sunmao 编辑器时，你都处于类型安全之中。Sunmao 重度使用 Typescript 与 JSON schema 来实现极佳的类型系统。

更多详情，请见 [Sunmao：一个真正可扩展的低代码 UI 框架](./what-is-sunmao.md)

## 教程

Sunmao 的用户分为两种角色，一种是开发者，一种是使用者。

开发者的职责和寻常的前端开发者类似，负责开发 UI 组件，并且把普通的 UI 组件封装为 Sunmao 的组件。开发者需要通过写代码来实现组件的逻辑。

使用者的职责是利用开发者封装好的 Sunmao 组件，在 Sunmao 低代码编辑器中搭建前端应用。使用者不需要前端知识和编程能力，仅通过 UI 交互就可以完成应用搭建。

为此，我们准备了两份教程，分别面向不同的角色。使用者仅需阅读使用者的教程，但开发者则要先阅读使用者教程，再阅读开发者教程。

- [使用者的教程](./user.md)
- [开发者的教程](./developer.md)

## 本地开发

### 启动项目

```sh
yarn
cd packages/editor
yarn dev
```

### 测试

```shell
yarn test:ci
```

### 构建

```shell
yarn
```

> 当你本地运行 runtime 或 editor 时，如果你修改了别的包的代码，必须重新构建被修改的包，否则 runtime 和 editor 中运行的依旧是旧代码。

## 许可证

Apache-2.0
