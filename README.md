# Setup inicial

Este proyecto utiliza **Jekyll** para la generación de sitios estáticos y **Sass** para el preprocesamiento de CSS.  

---

## Requisitos previos

Aseguráte de tener instalados en tu sistema las siguientes dependencias:

- [Ruby](https://www.ruby-lang.org) y [Bundler](https://bundler.io/) (para Jekyll)  
- [Sass](https://sass-lang.com/install) (se recomienda Dart Sass)  
- Git (para control de versiones)  

---

## Comandos recurrentes

### 1. Para correr Jekyll local
bundle exec jekyll serve --watch


### 2. Para compilar CSS utilizando SASS
sass main.scss:main.css --watch
