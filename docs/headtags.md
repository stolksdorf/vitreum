## Head Tags
Sometimes you'll want your components to be able to modify what's in your HTML `head`, such for `title` tags or `meta` descriptions. This can be pretty tricky to pull off, so this functionality comes built into Vitreum.

```jsx
const { Title, Meta, Description, Structured } = require('vitreum/headtags');

const Main = React.createClass({
	render: function(){
		return <div className='main'>
			<Title>My Fancy Page</Title>
			<Description>This is a really fancy page.</Description>
			<Meta property='og:whatever' content='Cool page' />
			<Structured data={{
				context: "http://schema.org",
				type: "Organization",
				url: "http://www.example.com",
			}} />
			<Meta
				bulk={{
					author : 'John Doe',
					viewport : 'width=device-width, initial-scale=1.0'
				}}
			/>
			Hello Headtags!
		</div>;
	}
});
```

Since each `headtag` is populated using `componentWillMount` only the deepest tag in the component structure for each type will render, eg. an app with several components using the `Title` will only having the title set to whatever the deepest reference.

Each of the `headtags` also render to `null`, so they are simply present to indictate to Vitreum what tags you want rendered into the head when generating that page.


### Title
Sets the title of the document. If this is rendered _after_ the page has already loaded, it will dynamically update the document's title on `componentDidMount`. It just takes a single string child to render.

```jsx
	<Title>This is my document title</Title>
```

### Description
Sets the metatag for the description to the head of the document.

```jsx
	<Description>This is my document description</Description>
```

renders to `<meta name='description' content='This is my document description' />`


### Meta
Adds [metatags](https://www.w3schools.com/tags/tag_meta.asp) to your document. Simply copies whatever props you pass into it.

```jsx
	<Meta charset="UTF-8" />
	<Meta name="keywords" content="HTML,CSS,XML,JavaScript">
```

If you pass an object as the `bulk` prop instead, it will loop through and create many metatags, with the key being the `property` and the value being the `content`

```jsx
	<Meta charset="UTF-8" />
	<Meta bulk={{
		'og:title' : 'My Page',
		'twitter:url' : 'http://og.gg',
	}} />

	// renders to

	<meta property='og:title' content='My Page' />
	<meta property='twitter:url' content='http://og.gg' />
```


### Noscript
Adds [noscript](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript) to your document. Simply concatenates whatever children you pass into it.

```jsx
	<Noscript>
		{`<style>
			body{
				background-color : red !important;
			}
		</style>`}`
	</Noscript>
```


### Script
Adds `<script />` to your document. Can pass an `id`, `src`, and/or code as children to the component.

```jsx
	<Script id='remote-code' src='https://mycode.biz/widget.js' />

	<Script>
		console.log('Oh hello.');
	</Script>
```


### Favicon
Adds a favicon into the head with a `type` and `href` prop.

```jsx
	<Favicon href="/favicon.ico" type="image/x-icon" />
```

### StructuredData
Adds a [Structured Data](https://developers.google.com/search/docs/guides/intro-structured-data) script tag to the page's `<head>`. It will automatically change any `context` or `type` keys to `@context` and `@type`.

```jsx
	<Structured data={{
		context: "http://schema.org",
		type: "Organization",
		url: "http://www.example.com",
		name: "Unlimited Ball Bearings Corp.",
		contactPoint: {
			type: "ContactPoint",
			telephone: "+1-401-555-1212",
			contactType: "Customer service"
		}
	}}/>
```
