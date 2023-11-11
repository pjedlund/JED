---
title: Photo 120-R002-F01
filename: '120-R002-F01-S02-E01.jpg'
description: '120-R002-F01-S02-E01 Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Nullam quis risus eget urna mollis ornare vel eu leo. Donec ullamcorper nulla non metus auctor fringilla. Etiam porta sem malesuada magna mollis euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
tags:
  - animals
  - Fridhem
  - Regementsgatan
  - Malmö
publishDate: 2023-11-04
---

<p class="lead">This photo was taken at the crossing of Regementsgatan and Fridhemsvägen in Malmö.</p>

{% image filename, description, "extend" %}

{{ description }} is {{ publishDate }} years old.

{% if tags %}<ul>
{% for tag in tags %}

  <li class="post__tags p-category"><a href="/tags/{{ tag | slugify }}/">{{ tag }}</a></li>
  {% endfor %}</ul>
{% endif %}

Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
