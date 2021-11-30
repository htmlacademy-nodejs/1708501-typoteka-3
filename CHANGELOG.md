# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.10.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.9.0...v1.10.0) (2021-11-29)


### Features

* сделал пагинацию на main странице ([189e2ae](https://github.com/YoginAlex/1708501-typoteka-3/commit/189e2aecfefeda26dcf1e24b2d05a2ceb259420d))


### Bug Fixes

* убрал лишние console.log ([51be9b5](https://github.com/YoginAlex/1708501-typoteka-3/commit/51be9b5cefdeec34caa79c742c63a53d037a96e0))
* убрал лишние коментарии ([3ea3753](https://github.com/YoginAlex/1708501-typoteka-3/commit/3ea37530647d7a2d7222cb7f3eb64a8735c80c34))

## [1.9.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.8.0...v1.9.0) (2021-11-28)


### Features

* добавил sql схемы транзакций ([efb8e81](https://github.com/YoginAlex/1708501-typoteka-3/commit/efb8e8180d3480600d83d735b044a144c6431b88))
* добавил генератор SQL файла для заполнения базы ([7a91168](https://github.com/YoginAlex/1708501-typoteka-3/commit/7a9116810510d77a47955fb98cfc7b7bd83a15a2))
* добавил файл с запросами к БД ([1eecddd](https://github.com/YoginAlex/1708501-typoteka-3/commit/1eecddd691537c585414edcbc48ce724a0208d92))
* оживил filldb ([1655b25](https://github.com/YoginAlex/1708501-typoteka-3/commit/1655b25018144b23b7b80d5882bd7c8c667d15b3))
* поправил отображение категорий и отдельной публикации ([0744ebd](https://github.com/YoginAlex/1708501-typoteka-3/commit/0744ebd31604656755989630bdfffb95fae3d55d))
* привёл в порядок API и проверил на api.http ([0c328ab](https://github.com/YoginAlex/1708501-typoteka-3/commit/0c328ab056ae263882ded56d0654f9cf21967919))
* ссылки на публикации теперь работают ([3bca27a](https://github.com/YoginAlex/1708501-typoteka-3/commit/3bca27adf0097f96d8da5993de141d6adb8830fc))
* тесты ([b5ec469](https://github.com/YoginAlex/1708501-typoteka-3/commit/b5ec469cff7fa41626040da5b93a2ec2889200f6))
* устанавливаем подключение к PostgreSQL БД ([2bb5e54](https://github.com/YoginAlex/1708501-typoteka-3/commit/2bb5e549f8c509a3cacbf82c89a10056c3c6bdb2))


### Bug Fixes

* добавил правила в gitignore ([8d97ad8](https://github.com/YoginAlex/1708501-typoteka-3/commit/8d97ad841c30977a795dc82ae86e038770a88460))
* зафиксировал upload папку в git ([b0ae21b](https://github.com/YoginAlex/1708501-typoteka-3/commit/b0ae21b933ae8165cf56135e0c647a7cd229c591))
* починил добавление категорий, при создании публикации ([462835b](https://github.com/YoginAlex/1708501-typoteka-3/commit/462835be4a2ba20ca69ec4c0c2c62f3af7cff0bb))
* правки после ревью ([df066f2](https://github.com/YoginAlex/1708501-typoteka-3/commit/df066f244615bc648eb28ab7768a4a4926f3f766))

## [1.8.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.7.0...v1.8.0) (2021-10-08)


### Features

* базово добавл логгер ([c5f5b0e](https://github.com/YoginAlex/1708501-typoteka-3/commit/c5f5b0e6323512ceb7cc5919244d0d629d8bd5a0))
* базово привязал данные в шаблон списка публикаций ([cd77897](https://github.com/YoginAlex/1708501-typoteka-3/commit/cd7789761dec1f93c36de8198dc94c7b2bbf97c3))
* дабавил настройку LOG_LEVEL через cross-env ([231935d](https://github.com/YoginAlex/1708501-typoteka-3/commit/231935d6beff83fda1ba4571cca98bf0a44357e5))
* добавил генерацию комментариев ([fe09efc](https://github.com/YoginAlex/1708501-typoteka-3/commit/fe09efcb90087be6296065e0813259052acc8c25))
* добавил картинки к публикациям ([faeed32](https://github.com/YoginAlex/1708501-typoteka-3/commit/faeed322d1cd7b972abdb21927cd683d5462e0a3))
* добавил логгер в мидлвары express ([3bfd8e4](https://github.com/YoginAlex/1708501-typoteka-3/commit/3bfd8e40e264b79f0e0edcdbdcc6e3007c9268bf))
* добавил настройки тестов ([1002dee](https://github.com/YoginAlex/1708501-typoteka-3/commit/1002dee4731bf482b5a5dc77bae96d067e55f91d))
* добавил разные уровни логирования ([7a357d8](https://github.com/YoginAlex/1708501-typoteka-3/commit/7a357d8df2dcb3b6d80b19afb83e3218cffe171c))
* добавил тесты для категорий ([360e58c](https://github.com/YoginAlex/1708501-typoteka-3/commit/360e58ca4bdb7ba38ff447ff3e78bca20643d8af))
* добавил тесты для поиска ([5bba51f](https://github.com/YoginAlex/1708501-typoteka-3/commit/5bba51fa3928ee75aafd27b3ff467d76d61ae48c))
* добавил тесты для публикаций и комментариев ([977f1a9](https://github.com/YoginAlex/1708501-typoteka-3/commit/977f1a98e8289d86d8c0076697decdb6e193205b))
* оживил поиск ([a98864f](https://github.com/YoginAlex/1708501-typoteka-3/commit/a98864f70c2c8a9c2dd7b14fa3e55f88bf15007a))
* передал данные в шаблоны ([23bf63c](https://github.com/YoginAlex/1708501-typoteka-3/commit/23bf63c44b77eebfeb0704a619acdc7e5390cf1a))
* публикация новой статьи ([2ddf9a9](https://github.com/YoginAlex/1708501-typoteka-3/commit/2ddf9a974466c45446aeeb03b6c254cf6a4b166f))
* реализовал REST API ([7450a06](https://github.com/YoginAlex/1708501-typoteka-3/commit/7450a0634e8c69caee1d0e37743f068ecfbab69c))


### Bug Fixes

* remove console.log ([9e703a1](https://github.com/YoginAlex/1708501-typoteka-3/commit/9e703a1b40bd0b25eb225b0ff4165f71a8143a0f))
* some prettier fixes ([5b4c550](https://github.com/YoginAlex/1708501-typoteka-3/commit/5b4c550ba1ba6405f78dd15a95f00351794cc2a0))
* вынес логи в корень приложения ([e0c3697](https://github.com/YoginAlex/1708501-typoteka-3/commit/e0c3697c567dae422a2ff18196eb41c47f51be61))
* добавил недостающие тесты для публикации ([ff19002](https://github.com/YoginAlex/1708501-typoteka-3/commit/ff19002b1ecd140a6135377c4c4c5dcffe1db8f0))
* зафиксировал версии npm пакетов ([2b4a9e4](https://github.com/YoginAlex/1708501-typoteka-3/commit/2b4a9e49810698914a544e4fa231580669e78114))
* поправил замечания после ревью ([ce9ed3e](https://github.com/YoginAlex/1708501-typoteka-3/commit/ce9ed3e0102d8edd1a557540a7c6ada1a1f1b461))
* поправил функцию читающую моки ([2a1f346](https://github.com/YoginAlex/1708501-typoteka-3/commit/2a1f34640cae204a788613765edee96b60adf14d))

## [1.7.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.6.0...v1.7.0) (2021-04-12)


### Features

* переход на express сервер ([8c10053](https://github.com/YoginAlex/1708501-typoteka-3/commit/8c100538fc4c865fa847bbde43374aef8251d653))

## [1.6.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.5.0...v1.6.0) (2021-04-12)


### Features

* добавил набор статичных pug-шаблонов ([4710d32](https://github.com/YoginAlex/1708501-typoteka-3/commit/4710d32c2276b1f2bff25b862c432173f9d4466d))

## [1.5.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.4.0...v1.5.0) (2021-03-26)


### Features

* blank for routing ([4128c5d](https://github.com/YoginAlex/1708501-typoteka-3/commit/4128c5d28570968e9772fc011f720e0601c1c1fe))

## [1.4.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.3.1...v1.4.0) (2021-03-01)


### Features

* реализован базовый http-сервер ([b48528f](https://github.com/YoginAlex/1708501-typoteka-3/commit/b48528f9db8b053a042333bd225e7155b8f9f666))

### [1.3.1](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.3.0...v1.3.1) (2021-03-01)

## [1.3.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.2.1...v1.3.0) (2021-02-28)


### Features

* перенёс моковые данные в файлы ([cf138c0](https://github.com/YoginAlex/1708501-typoteka-3/commit/cf138c0160cbe4a58435318b5bdeb3fd6db874dd))

### [1.2.1](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.2.0...v1.2.1) (2021-02-27)

## [1.2.0](https://github.com/YoginAlex/1708501-typoteka-3/compare/v1.1.0...v1.2.0) (2021-02-27)


### Features

* раскраска и async/await ([d2f476d](https://github.com/YoginAlex/1708501-typoteka-3/commit/d2f476d095daadf238cc3ebda3fb7a44621d036b))

## 1.1.0 (2021-02-07)


### Features

* генератор публикаций ([292bcb2](https://github.com/YoginAlex/1708501-typoteka-3/commit/292bcb2cd2a86b38d268cdee69e5925412355d26))
* стартовая настройка node-проекта ([6a4ffde](https://github.com/YoginAlex/1708501-typoteka-3/commit/6a4ffde5707519f4bb0e966b2f0e2da5897fb0d5))


### Bug Fixes

* package.json description ([fde9469](https://github.com/YoginAlex/1708501-typoteka-3/commit/fde9469b906cf1ce74487959518a526a5ddbf423))
* Указан наставник в readme ([934f1ae](https://github.com/YoginAlex/1708501-typoteka-3/commit/934f1ae8fe7103e7864e12124f80d66e7e8ae501))
