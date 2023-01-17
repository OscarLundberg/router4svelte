# router4svelte

## summary
a client side routing library for svelte projects.

- uses hash-based routing 
- works with browser buttons
- redirects standard paths to hash based equivalent
```diff
- /posts/hello-world
+ /#/posts/hello-world
```

## install

```sh
npm i router4svelte
```


## usage


### Initialize
```html
<!-- App.svelte -->
<script lang="ts">
  import { Router, type RouterConfig} from "router4svelte";
  let config:RouterConfig = {};
</script>

<Router {config} />
```

### Navigation

#### With components
- You can drop the included `Link`-component directly in place of anchor-tags.
```html
<script>
  import { Link } from "router4svelte";
</script>

<a    href="/about" class="btn btn-outline-primary">About</a> 

<Link href="/about" class="btn btn-outline-primary">About</Link>
```

#### With api
- You can use the RouterApi to navigate however you want in your code.
```html
<script>
  import { RouterApi } from "router4svelte";
  
</script>

<button on:click={ () => RouterApi.back() }>⬅</button>
<button on:click={ () => RouterApi.routeTo("/about") }>About</button>
```

## configure

The config object maps the paths to one of the following:
- SvelteComponent
- RouteOptions-object
- Function returning RouteOptions-object

a simple config might look like this 
```ts
  const config = {
    "/": Home,
    "/about": About,
    "/posts/:id": Post,
    DEFAULT: ErrorPage
  }
```

### routes

The routes (keys) of the object are specified as strings, starting with `/` and may declare route parameters prefixed with `:`
> Examples:
> `/`
> `/about`
> `/posts/:category`
> `/posts/:id/edit/:version`

Additionally, a `DEFAULT` entry can be specified as a fallback, which will be applied if no other routes match. 
The DEFAULT-entry path is declared in uppercase letters `DEFAULT` without preceeding `/`. (See example above and on the bottom of the page)

If multiple entries match the requested path, the last entry will take precedence and a warning will be logged in the console.


#### route parameters
A route parameter is prefixed with `:` in the definition, and will by default map to a prop on the target component.
Consider this route config:
```ts
"/posts/:category/:id": MyPostComponent
```
A request to `/posts/news/32` would produce the equivalent of the following output:
```html
<MyPostComponent category="news" id="32" />
```

There are no hard limits on route parameters, but keep in mind that if too many parameters are present, they may interfere with other declared routes.


### advanced config

you can configure your routes with a `RouteOptions`-object for more control. see supported properties below.
Map your route directly to such an object, or declare a function that returns `RouteOptions` and optionally takes `RequestParams`. 
You can mix and match mappings directly to components, to objects or functions as you please.

```ts
type RouteOptions = {
  component: typeof SvelteComponent, // component to render on this route (Required)
  slot?: typeof SvelteComponent, // component to render in the default slot of the main component
  props?: Record<string, any> // props to pass to the rendered components (will merge with and be overriden by conflicting route params)
}

type RequestParams = {
  path: string, // Pathname
  params: Record<string, string>, // route parameters (/:id/) mapped to an object 
  query: Record<string, string> // query parameters (?id=123) mapped to an object
}

const config: RouteConfig = {
  "/posts/:category": {
    component: ListLayout,
    slot: ListOfPosts
  },
  "/posts/:date": ({params}) => {
    try {
      const date = new Date(params.date)
      return { component: ListOfPosts, date }
    } catch(e) {
      return { 
        component: ErrorComponent, 
        props: { error: "Invalid date format" }
      }
    }
  }
}
```



### example App.svelte

```html
<!-- App.svelte -->
<script lang="ts">
  import Nav from "./components/Nav.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Products from "./components/Products.svelte"
  import LayoutComponent from "./components/LayoutComponent.svelte";
  import Home from "./pages/Home.svelte";
  import Error  from "./pages/Error.svelte";
  import Posts from "./pages/Posts.svelte";
  import { Router, type RouterConfig } from "router4svelte";

  const config: RouterConfig = {
    "/": Home,
    "/posts/:id": Posts,
    "/:layoutMode/products": {
      component: LayoutComponent,
      slot: Products
    },
    DEFAULT({path}) {
      return {
        component: Error,
        props: { message: `404 - The requested resource ${path} was not found` },
      };
    },
  };
</script>

<Nav />
<div class="container-fluid">
  <div class="row">
    <div class="col">
      <Sidebar />
    </div>
    <div class="col">
      <Router {config} />
    </div>
  </div>
</div>
```