##### This design document focuses on the following - 
1. Separate entry points for node and browser.
2. Specifying the browser field in package.json
3. Changes in the bundling process

##### Terms -

bundler - Module bundlers are tools frontend developers used to bundle JavaScript modules into a single JavaScript files that can be executed in the browser.

package.json fields - 
* main - The main field is a module ID that is the primary entry point to your program. Points to the CJS modules.

* module - The module field is not an official npm feature but a common convention among bundlers to designate how to import an ESM version of a library. Points to the ES modules.

* browser - If your module is meant to be used client-side the browser field should be used instead of the main field.

##### Current set up -

1. 
                        TypeScript Source Code
                                / \
                      Transpiles into JavaScript 
                               /   \
                     CJS module     ES modules
2. main - `lib/src/index.js`
   module - `lib/src/es/index.js`

3. Rollup bundling output
* graph-js-sdk.js - IIFE bundled minified file. This file can be directly used in the browser with a `<script>` tag.
* graph-es-sdk.js - ES bundled file.
4. Entry point for rollup - `lib/es/browser/index.js`.

##### Difference between src/index.js and src/browser/index.js
1. src/browser/index.js does not export  'RedirectHandler' and 'RedirectHandlerOptions'. Redirection is handled by the browser.
2.  src/index.js  exports-> src/ImplicitMsalProvider and src/browser/index.js exports src/browser/ImplicitMsalProvider.
3. Only difference in the implementation is that src/browser/ImplicitMsalProvider does not import or require 'msal' dependency.

Presently, some browser applications importing the npm package like Graph Explorer use lib/es/src/index.js and not the browser/index.js.

##### Upcoming changes - 

1. Use the browser field for the following -

* We currently have two entry files, src/index.ts and src/browser/index.ts.
Use the browser field to indicate the browser entry point.
Example -
"browser":
{ "lib/es/index.node.js": "lib/es/index.browser.js" }
Currently, we have the main and "module field in the package.json. This will remain the same.
2. Better way to handle environment specific implementation. For example, using the browser field we can indicate as follows -
"browser":
{ "stream": "stream-browserify" } 
3. Maintain a separate entry point for the rollup process. 
4. Continue rolling up the src/browser/ImplicitMsalProvider as we currently do and not introduce breaking changes here as we are planning to deprecate this.
5. Bundle the authproviders separately as they are optional.
