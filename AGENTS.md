## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Regola primaria dei datari

In ogni coppia di datari "da / a" (check-in e check-out, dal e al, partenza e rientro...) il calendario della seconda data parte SEMPRE dalla prima data scelta, mai da oggi, e non permette date precedenti. E' applicata a tutto il sito da `src/scripts/collegaDatari.ts` (caricato in `BaseLayout.astro`): i campi si riconoscono dal testo dell'etichetta ("Check-in", "Check-out", "Dal", "Al", "Partenza", "Rientro"...) oppure da due datari affiancati. Ogni nuovo datario deve avere un'etichetta con queste parole. La stessa regola vale nel gestionale (`travelgo/app/src/lib/collegaDatari.js`): tenere allineate le due copie.
