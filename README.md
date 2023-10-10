# Looker Embed Application Starterkit

 This repo contains examples of how to embed Looker into a web application. For getting started it circumvents a user login and allows for anonymous users. In a real world application, user permission and authorization would be handled in a more robust way likely involving an IdP and a user database. There are 2 components provided:
 
  * [App-Frontend]( ./App-Frontend/README.md) - A sample React application that uses the Looker [Embed SDK](https://docs.looker.com/reference/embed-sdk/embed-sdk-intro) and [Components](https://docs.looker.com/data-modeling/extension-framework/components)

 * [Node Backend]( ./Backend-Node/README.md) 

 This is intended to be an example application, and shows many different ways of embedding Looker in another site.  It demonstrates several similar ways to include a dashboard or visualization, and all of these techniques are valid.  The examples that this application uses will come from your Looker instance.
 
 ## Getting Started

 1. Install and run the [App-Frontend]( ./App-Frontend/README.md) web app using the integrated development server. 
 2. Install and run either the [Node]( ./Backend-Node/README.md) backend.


The frontend React application serves a static web site.  It relies on a backend server ([node](./Backend-Node/README.md) to communicate securely with Looker.  To show Looker Dashboards or Looks, the frontend server requests a [Signed SSO URL](https://docs.looker.com/reference/embedding/sso-embed) from the backend server.  This URL is then added to an iframe on the site.  Inside the iframe, the dashboard or Look is served directly from the Looker server. 

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer

This project is not an official Google project. It is not supported by Google and Google specifically disclaims all  warranties as to its quality, merchantability, or fitness for a particular purpose.
