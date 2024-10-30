# data-extractor-3000

Input example:

```JSON
{
"url": "https://www.example.com",
"selectors": {
"title": "h1:first-child",
"firstParagraph": "p:second-child",
"somethingElse": "h2:second-child"
}
}
```

```JSON
Output:
{
"title": "Example Domain",
"firstParagraph": "More information...",
"somethingElse": null
}
```
