---
layout: default
title: "Credits"
nav_label: "Credits"
description: "Bitcoin FilmFest crew, collaborators, production partners, and special cameos."
permalink: /credits/
screen: credits
---

<style>
  /* Credits page redesign: larger names, white-only type, centered layout. */
  .credits-page,
  .credits-page .page-masthead,
  .credits-page .credits-roll,
  .credits-page .credits-section,
  .credits-page .credits-section ul {
    text-align: center;
  }

  .credits-page .page-context,
  .credits-page .page-masthead,
  .credits-page .page-masthead h1,
  .credits-page .page-masthead > p,
  .credits-page .credits-section h2,
  .credits-page .credits-section a,
  .credits-page .credits-date {
    color: var(--color-on-dark);
  }

  .credits-page .credits-section a {
    font-size: clamp(var(--text-lg), 3vw, var(--text-2xl));
  }

  .credits-page .credits-section a:hover,
  .credits-page .credits-section a:focus-visible {
    color: var(--color-on-dark);
  }
</style>

<article class="credits-page">
  <header class="page-masthead">
    <p class="page-context">A festival is a collective production</p>
    <h1>Credits</h1>
    <p>People and organizations who have helped bring Bitcoin cinema to the screen.</p>
  </header>

  <div class="credits-roll" data-credits-roll>
    {% for section in site.data.credits.sections %}
      <section class="credits-section">
        <h2>{{ section.name }}</h2>
        <ul>
          {% for entry in section.entries %}
            <li><a href="{{ entry.url }}" target="_blank" rel="noopener noreferrer">{{ entry.name }}</a></li>
          {% endfor %}
        </ul>
      </section>
    {% endfor %}
  </div>

  <p class="credits-date">Collaborations documented through {{ site.data.credits.updated_through }}.</p>
</article>
