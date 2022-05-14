# [Prototype] Async Poller

This is a prototype of making an async poller.

# TL;DR

Build a service where a user can instantiate from a webapp, leave the webapp, and later get notified when service is complete.

## Purpose

From a webapp, initiate an external job that will poll an API, and notify the user when some target data is found. The idea is so that a user can “set and forget” until being notified with results.

## Flow

1. User initiates job from webapp
2. User can leave the page
3. Job is instantiated
    1. Polls API
    2. Processes data
    3. Sends user email upon completion

## Possible Solutions

[**BeaconAPI**](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API)

> The Beacon API is used to send an asynchronous and non-blocking request to a web server. The request does not expect a response. Unlike requests made using XMLHttpRequest or the Fetch API, the browser guarantees to initiate beacon requests before the page is unloaded and to run them to completion.

[StackOverflow Reference](https://stackoverflow.com/questions/6162188/javascript-browsers-window-close-send-an-ajax-request-or-run-a-script-on-win)
This would integrate with a regular API end point

**Async Server**
Not sure how to implement an Async Tier.
Questions:

-   Calling an API endpoint would not complete if the user exits the browser/page
    -   Would the API need to call/create a separate service that would then be the “Async Tier”?

This approach would allow the polling process be independent on the browser after instantiated.
CronJobs would be used to handle this.

## Implementation

**Poller**

-   `axios` to call external library
-   `nodemailer` to send email
    -   Already have working implementations that can port over

**Calling Async API**
If the BeaconAPI is as simple as the docs say, then can simply use that instead of `fetch` and API should complete despite user closing window.
