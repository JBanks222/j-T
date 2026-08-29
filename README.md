# j-T
.
## Change Images

Edit [assets/images.json](assets/images.json) to change the image used by any visual container. Each key matches a `data-image` value in `index.html`; set its `src` to an image path relative to the project root and update `alt` text as needed.

```json
"featuredRooftopParty": {
	"src": "assets/events/rooftop-party.jpg",
	"alt": "Rooftop party in Brooklyn"
}
```

Leave `src` empty to keep the existing placeholder styling. The page loads this file when served through a local web server.