# router4svelte

## summary
a client side routing library for svelte projects.
this library intends to provide a very simple workflow suitable for smaller projects, 
without being too limiting as requirements change.

## install

```sh
npm i router4svelte
```


## usage

```html
<!-- App.svelte -->
<script lang="ts">
  import { Router, type RouterConfig} from "router4svelte";
  let config:RouterConfig = {};
</script>

<Router {config} />
```


## config 

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
The DEFAULT-entry path is declared in uppercase letters `DEFAULT` without preceeding `/`. 
See more in the examples on this page.


### route parameters
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


### examples
- Basic route:
  `"/": MyHomePage`

- Basic route, with route params: 
  `"/posts/:category/:id": MyPostComponent`

#### advanced config

you can configure your routes with a `RouteOptions`-object for more control. see supported options below.
Map your route directly to such an object, or declare a function that returns `RouteOptions` and optionally takes `RequestParams`. 

```ts
type RouteOptions = {
  component: typeof SvelteComponent, // component to render on this route (Required)
  slot?: typeof SvelteComponent, // component to render in the default slot of the main component
  props?: Record<string, any> // props to pass to the rendered components (will merge with and potentially be overriden by route params)
}

type RequestParams = {
  path: string, // Full route
  params: Record<string, string>, // route parameters (/:id/) mapped to an object 
  query: Record<string, string> // query parameters (?id=123) mapped to an object
}
```

> note slot components will receive the same props as the component.


> ```ts  
> const config: RouteConfig = {
>   "/posts/:category": {
>     component: ListLayout,
>     slot: ListOfPosts
>   },
>   "/posts/:date": ({params}) => {
>     try {
>       const date = new Date(params.date)
>       return { component: ListOfPosts, date }
>     } catch(e) {
>       return { 
>         component: ErrorComponent, 
>         props: { error: "Invalid date format" }
>       }
>     }
>   }
> }
>```



### example App.svelte

```html
<!-- App.svelte -->
<script lang="ts">
  import Nav from "./components/Nav.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Error  from "./pages/Error.svelte";
  import Posts from "./pages/Posts.svelte";
  import { Router, type RouterConfig } from "router4svelte";

  const config: RouterConfig = {
    "/posts/:id": {
      component: Posts
    },
    DEFAULT() {
      return {
      component: Error,
        props: { message: `404 - The requested resource was not found` },
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