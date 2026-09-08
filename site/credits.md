---
layout: default
title: "Credits"
nav_label: "Credits"
description: "Bitcoin FilmFest crew, collaborators, production partners, and special cameos."
permalink: /credits/
screen: credits
---

<style>
  .credits-page {
    width: min(100%, 52rem);
    margin-inline: auto;
    text-align: center;
    color: #fff;
  }

  .credits-page .page-masthead,
  .credits-page .page-context,
  .credits-page h1,
  .credits-page p,
  .credits-page .credits-roll,
  .credits-page .credits-section,
  .credits-page .credits-section li,
  .credits-page .credits-date {
    text-align: center;
    color: #fff !important;
  }

  .credits-page .page-masthead {
    max-width: none;
    margin-inline: auto;
  }

  .credits-roll {
    display: grid;
    gap: 3rem;
  }

  .credits-section {
    margin: 0;
  }

  .credits-section h2 {
    margin: 0 0 1rem;
    color: #fff !important;
    font-size: clamp(2rem, 5vw, 3.25rem);
    line-height: 1;
    text-align: center;
  }

  .credits-section ul {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
    width: 100%;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    text-align: center;
  }

  .credits-section li {
    margin: 0;
  }

  .credits-section a {
    display: block;
    color: #fff !important;
    font-family: var(--font-display);
    font-size: clamp(1rem, 2vw, 1.35rem);
    line-height: 1.4;
    text-align: center;
    text-decoration-color: rgba(255, 255, 255, 0.28);
  }

  .credits-date {
    margin-top: 3rem;
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
