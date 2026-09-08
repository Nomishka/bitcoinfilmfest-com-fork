---
layout: default
title: "Credits"
nav_label: "Credits"
description: "Bitcoin FilmFest crew, collaborators, production partners, and special cameos."
permalink: /credits/
screen: credits
---

<article class="credits-page" style="width: min(100%, 52rem); margin-inline: auto; text-align: center; color: #fff;">
  <header class="page-masthead" style="max-width: none; margin-inline: auto; text-align: center; color: #fff;">
    <p class="page-context" style="color: #fff !important; text-align: center;">A festival is a collective production</p>
    <h1 style="color: #fff !important; text-align: center;">Credits</h1>
    <p style="color: #fff !important; text-align: center;">People and organizations who have helped bring Bitcoin cinema to the screen.</p>
  </header>

  <div class="credits-roll" data-credits-roll style="text-align: center;">
    {% for section in site.data.credits.sections %}
      <section class="credits-section" style="text-align: center;">
        <h2 style="margin: 0; color: #fff !important; font-size: clamp(1.25rem, 3vw, 2rem); text-align: center;">{{ section.name }}</h2>
        <ul style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.75rem; margin: 0; padding: 0; list-style: none; text-align: center;">
          {% for entry in section.entries %}
            <li style="margin: 0; text-align: center;"><a href="{{ entry.url }}" target="_blank" rel="noopener noreferrer" style="display: block; color: #fff !important; font-family: var(--font-display); font-size: clamp(1.5rem, 4vw, 3rem); line-height: 1.2; text-align: center; text-decoration-color: rgba(255,255,255,.28);">{{ entry.name }}</a></li>
          {% endfor %}
        </ul>
      </section>
    {% endfor %}
  </div>

  <p class="credits-date" style="color: #fff !important; text-align: center;">Collaborations documented through {{ site.data.credits.updated_through }}.</p>
</article>
