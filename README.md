# template-ts-npm-package

![CircleCI](https://img.shields.io/circleci/build/gh/justKD/template-ts-npm-package/master?token=5d76eb51f1f5547eb2c610645c07272cbb149f58&style=for-the-badge&logo=circleci)

<https://github.com/justKD/template-ts-npm-package>

## Use

- Clone the template to create a new GitHub repo.
- Configure your project. Instructions are below.
- `cd` into the project directory and run `nvm use` to switch to the configured `node` version found in `.nvmrc`.
- `yarn` or `npm i` to install node modules.
- Start building your module in `src`.

## Setup your package config

### Fields you may need to update in `package.json`

```(json)
{
  "name",
  "author",
  "version",
  "license",
  "description",
  "keywords",
  "repository: {
    "url"
  }
}
```

### Other files that may need attention

- `.nvmrc`
  - Set to the target `node` version your project will use.
- `CONTRIBUTING.md`
- `LICENSE`
  - Name and date for copyright notice.
  - Or replace with new license matching type you put in `package.json`.
- `README.md`
  - Replace this sucker with your own project readme.
  - Update CLCI badge link:  
    `https://img.shields.io/circleci/build/gh/GH_USERNAME/REPO_NAME/BRANCH_NAME?token=API_TOKEN&style=for-the-badge&logo=circleci`
    | Script        | Example                           | Description
    | :------------ | :-------------------------------- | :----------
    | _GH_USERNAME_ | eg. justKD                        | Your GitHub username.
    | _REPO_NAME_   | eg. template-ts-npm-package       | The name you gave your repo on GitHub.
    | _BRANCH_NAME_ | eg. master                        | The name of the branch being targeted.
    | _API_TOKEN_   | eg. blahBlah91blah12081238951Blah | The individual project `Status` level API token from CLCI.

## Included package scripts

| Script               | Description
| :------------------- | :----------
| `npm run test`       | Run tests on demand.
| `npm run watch`      | Run tests on change.
| `npm run build`      | Shortcut to run both `build:lib` and `build:docs`.
| `npm run build:lib` | Build module (replaces files in `./lib`).
| `npm run build:docs` | Build the documentation using [TypeDoc](http://typedoc.org) and [TypeDoc Markdown](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/typedoc-plugin-markdown) (replaces files in `./docs`).
| `npm run publish`    | I know. Just let me be thorough ok? Publish the contents of the `./lib` folder and `./README.md` to NPM.

## (optional) Setting up GitHub Pages and CircleCI

### GitHub Pages

Set up a GitHub Pages site for your package as a _project site_ with the following steps:

1. Follow the instructions in the [GitHub Pages Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) to set up Pages on your GitHub account or organisation if not already configured.
1. Go to your repository for this package on GitHub and click `Settings`
1. Click `Pages`
1. Configure the branch as `main` (or `master`) and the directory to `./docs`
1. Configure the remaining settings as per your own preferences

### CircleCI

A basic [CircleCI](https://circleci.com) config is included in this template.

1. Login to [CircleCI](https://circleci.com) with GitHub
1. Click "Projects"
1. Click "Set up project" for this repository and follow the instructions

Also consider setting up branch protection and requiring passing checks from CircleCI for pull requests.
