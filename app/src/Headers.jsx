/*
 * Helmet-based HTML header content
 */

import React from "react";
import { Helmet } from "react-helmet";

import settings from "./settings";

const { title } = settings;
const public_url = process.env.PUBLIC_URL;

export default function Headers(_) {

  return <Helmet>
    <html lang="en"/>
    <meta charSet="utf-8"/>
    <title>{title}</title>
    <link rel="shortcut icon" type="image/ico"
          sizes="32x32" href={public_url + "/favicon.ico"}/>
    <link rel="manifest" href={public_url + "/manifest.json"}/>
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json"/>
    <link async rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700"/>
    <link rel="stylesheet"
          href="https://unpkg.com/react-instantsearch-theme-algolia@4.0.0/style.min.css"/>
    <link async rel="stylesheet" crossOrigin=""
          href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
          integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
  </Helmet>;
}
