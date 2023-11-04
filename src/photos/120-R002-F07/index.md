---
title: Photo 120-R002-F07
filename: '120-R002-F07-S02-E01-fi.jpeg' 
description: 'Medium format photoooooooooooo'
tags:
  - medium
  - animals
publishDate: 2023-10-24
lastUpdated: 2023-11-24
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
