## Head Tags
Sometimes you'll want your components to be able to modify what's in your HTML `head`, such for `title` tags or `meta` descriptions. This can be pretty tricky to pull off, so this functionality comes built into Vitreum.

```jsx
const { Title, Meta, Bulk, Structured } = require('vitreum/headtags');

const Main = React.createClass({
	render: function(){
		return <div className='main'>
			<Title>My Fancy Page</Title>
			<Meta name='description' content='This is a really fancy page.' />
			<Structured data={{
				context: "http://schema.org",
				type: "Organization",
				url: "http://www.example.com",
			}} />
			<Bulk
				title='Overriden Title'
				meta={{
					author : 'John Doe',
					viewport : 'width=device-width, initial-scale=1.0'
				}}
				structuredData={{type:'Organization', logo:'cool.biz/logo.png'}}
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

### Meta
Adds [metatags](https://www.w3schools.com/tags/tag_meta.asp) to your document. Simply copies whatever props you pass into it.

```jsx
	<Meta charset="UTF-8" />
	<Meta name="keywords" content="HTML,CSS,XML,JavaScript">
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

### Bulk
Bulk allows you to add multiple types of head tags in one go. It was designed to easily take a JSON config for the page and simple spread it in as props. The `meta` prop is special because it takes key-value pairs that will map to the props of `name` and `content` meta tags respectively.

```jsx
	const pageConfig = {
		title : 'Page title',
		meta : {
			keywords : "HTML,CSS,XML,JavaScript",
			description : "Really Fancy Page"
		},
		favicon : {
			type : 'image/png',
			href : '/favicon.png'
		},
		structuredData : {
			context: "http://schema.org",
			type: "Organization",
			url: "http://www.example.com",
			name: "Unlimited Ball Bearings Corp.",
			contactPoint: {
				type: "ContactPoint",
				telephone: "+1-401-555-1212",
				contactType: "Customer service"
			}
		}
	};

	<Bulk {...pageConfig} />
```