---
layout: default
title: "Site map"
nav_label: ""
description: "Browse every public Bitcoin FilmFest page, film, company, Reel story and press-room article, plus the status of legacy routes."
permalink: /sitemap/
screen: paper
---

{% comment %}
  Generated index, not a hand-maintained URL list: current routes come from Jekyll pages
  and collections, so reviewed content is added automatically. Redirects are listed
  separately; migration rows come from _data/sitemap.json, the reconciliation source.
  Keep /sitemap/ out of the primary nav; the shared footer links here.
{% endcomment %}
<article class="reel-page sitemap-page">
  <a class="cinema-back" href="{{ '/' | relative_url }}">← Bitcoin FilmFest</a>
  <header class="page-masthead">
    <p class="page-context">Find your way around</p>
    <h1>Site map</h1>
    <p>Every public page in one place. New reviewed pages appear here automatically; legacy routes show where their content lives now.</p>
  </header>
  <div class="route-key" aria-label="Route status key">
    <span><i class="route-dot route-dot--live" aria-hidden="true"></i>Live page</span>
    <span><i class="route-dot route-dot--redirect" aria-hidden="true"></i>Redirect</span>
    <span><i class="route-dot" aria-hidden="true"></i>Migration plan</span>
  </div>
  <div class="sitemap-index">
    <section class="sitemap-group" aria-labelledby="sitemap-pages-heading">
      <h2 id="sitemap-pages-heading">Pages &amp; festival editions</h2>
      <ol>
        {% assign sitemap_pages = site.pages | sort: 'url' %}
        {% for page in sitemap_pages %}
          {% assign is_press_room = page.url | slice: 0, 10 %}
          {% if page.url != '/sitemap/' and page.url != '/404.html' and page.url != '/robots.txt' and page.url != '/site.webmanifest' and page.url != '/sitemap.xml' and page.redirect_to == nil and page.sitemap != false and page.robots != 'noindex, nofollow' and page.robots != 'noindex, follow' and is_press_room != '/26/press/' and page.url contains '/' %}
            {% unless page.url contains '/assets/' or page.url contains '/lab/' %}
            {% unless page.url contains '.css' or page.url contains '.txt' or page.url contains '.xml' or page.url contains '.webmanifest' or page.url contains '.json' %}
            <li>
              <a href="{{ page.url | relative_url }}"><span>{{ page.title | default: page.url | escape }}</span><code>{{ page.url | escape }}</code></a>
              <span class="route-state route-state--implemented"><i class="route-dot route-dot--live" aria-hidden="true"></i>Live</span>
            </li>
            {% endunless %}
            {% endunless %}
          {% endif %}
        {% endfor %}
      </ol>
    </section>
    <section class="sitemap-group" aria-labelledby="sitemap-films-heading">
      <h2 id="sitemap-films-heading">Films</h2>
      <ol>
        {% assign sitemap_films = site.films | sort: 'title' %}
        {% for film in sitemap_films %}
          {% if film.sitemap != false and film.robots != 'noindex, nofollow' and film.robots != 'noindex, follow' %}
            <li><a href="{{ film.url | relative_url }}"><span>{{ film.title | escape }}</span><code>{{ film.url | escape }}</code></a><span class="route-state route-state--implemented"><i class="route-dot route-dot--live" aria-hidden="true"></i>Film</span></li>
          {% endif %}
        {% endfor %}
      </ol>
    </section>
    <section class="sitemap-group" aria-labelledby="sitemap-companies-heading">
      <h2 id="sitemap-companies-heading">Companies</h2>
      <ol>
        {% assign sitemap_companies = site.companies | sort: 'title' %}
        {% for company in sitemap_companies %}
          {% if company.sitemap != false and company.robots != 'noindex, nofollow' and company.robots != 'noindex, follow' %}
            <li><a href="{{ company.url | relative_url }}"><span>{{ company.title | escape }}</span><code>{{ company.url | escape }}</code></a><span class="route-state route-state--implemented"><i class="route-dot route-dot--live" aria-hidden="true"></i>Company</span></li>
          {% endif %}
        {% endfor %}
      </ol>
    </section>
    <section class="sitemap-group" aria-labelledby="sitemap-reel-heading">
      <h2 id="sitemap-reel-heading">Reel</h2>
      <ol>
        {% assign sitemap_reel = site.reel | sort: 'date' | reverse %}
        {% for entry in sitemap_reel %}
          {% if entry.sitemap != false and entry.robots != 'noindex, nofollow' and entry.robots != 'noindex, follow' %}
            <li><a href="{{ entry.url | relative_url }}"><span>{{ entry.title | escape }}</span><code>{{ entry.url | escape }}</code></a><span class="route-state route-state--implemented"><i class="route-dot route-dot--live" aria-hidden="true"></i>Story</span></li>
          {% endif %}
        {% endfor %}
      </ol>
    </section>
    <section class="sitemap-group" aria-labelledby="sitemap-press-heading">
      <h2 id="sitemap-press-heading">BFF’26 press room</h2>
      <ol>
        {% assign sitemap_press = site.static_files | sort: 'path' %}
        {% for press_file in sitemap_press %}
          {% if press_file.extname == '.html' and press_file.path contains '/26/press/' %}
            <li><a href="{{ press_file.path | relative_url }}"><span>{{ press_file.path | escape }}</span><code>{{ press_file.path | escape }}</code></a><span class="route-state route-state--implemented"><i class="route-dot route-dot--live" aria-hidden="true"></i>Press</span></li>
          {% endif %}
        {% endfor %}
      </ol>
    </section>
  </div>
  <section class="sitemap-exclusions" aria-labelledby="sitemap-legacy-heading">
    <h2 id="sitemap-legacy-heading">Legacy routes &amp; migration</h2>
    <p>Old public URLs are preserved where a redirect is in place. Other historic routes are mapped to the current page or collection; private source material is not listed.</p>
    {% assign redirect_pages = site.pages | sort: 'url' %}
    <h3>Redirects</h3>
    <ol class="sitemap-redirects">
      {% for page in redirect_pages %}
        {% if page.redirect_to %}
          <li><code>{{ page.url | escape }}</code><span class="route-state route-state--redirect-candidate"><i class="route-dot route-dot--redirect" aria-hidden="true"></i>Redirects to</span><a href="{{ page.redirect_to | relative_url }}">{{ page.redirect_to | escape }}</a></li>
        {% endif %}
      {% endfor %}
    </ol>
    <h3>Folded into current pages</h3>
    <ol class="sitemap-planned">
      {% for item in site.data.sitemap.legacy_reconciliation.fold_into_existing_hubs_or_editions %}
        <li><span class="route-planned"><span>{{ item.routes | join: ', ' | escape }}</span></span><span class="route-state">{{ item.action | escape }}</span><span class="sitemap-destination">{{ item.destination | escape }}</span></li>
      {% endfor %}
    </ol>
    <h3>Still to review</h3>
    <ol class="sitemap-planned">
      {% for item in site.data.sitemap.legacy_reconciliation.separate_pages_worth_migrating %}
        <li><span class="route-planned"><span>{{ item.routes | join: ', ' | escape }}</span></span><span class="route-state">{{ item.action | escape }}</span><span class="sitemap-destination">{{ item.destination | escape }}</span></li>
      {% endfor %}
    </ol>
    <p class="sitemap-source-note">Route inventory: <a href="https://github.com/itstomekk/bitcoinfilmfest-com/blob/main/SITEMAP-PLAN.md">SITEMAP-PLAN.md</a>. This page lists generated public content, not private working notes or builder tools.</p>
  </section>
</article>
