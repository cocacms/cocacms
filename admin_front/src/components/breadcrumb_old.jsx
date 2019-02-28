import React, { Component } from "react";
import { Breadcrumb } from "antd";
import Link from "umi/link";
import { matchPath } from "react-router";

const DEFAULT_MATCH_OPTIONS = { exact: true };
const NO_BREADCRUMB = null;

/**
 * ↓↓↓↓↓ adjust from https://github.com/icd2k3/react-router-breadcrumbs-hoc/blob/master/src/index.js
 */

const flattenRoutes = routes =>
  routes.reduce((arr, route) => {
    if (!route.path || !route.component || !route.component.bradcrumb) {
      return arr;
    }

    route.breadcrumb = route.component.bradcrumb;
    if (route.routes) {
      return arr.concat([route, ...flattenRoutes(route.routes)]);
    }
    return arr.concat(route);
  }, []);

const getBreadcrumb = ({
  currentSection,
  disableDefaults,
  excludePaths,
  location,
  pathSection,
  routes
}) => {
  let breadcrumb;

  // check the optional `exludePaths` option in `options` to see if the
  // current path should not include a breadcrumb
  if (excludePaths && excludePaths.includes(pathSection)) {
    return NO_BREADCRUMB;
  }

  // loop through the route array and see if the user has provided a custom breadcrumb
  routes.some(({ breadcrumb: userProvidedBreadcrumb, matchOptions, path }) => {
    if (!path) {
      throw new Error(
        "withBreadcrumbs: `path` must be provided in every route object"
      );
    }

    const match = matchPath(pathSection, {
      ...(matchOptions || DEFAULT_MATCH_OPTIONS),
      path
    });

    // if user passed breadcrumb: null OR custom match options to suppress a breadcrumb
    // we need to know NOT to add it to the matches array
    // see: `if (breadcrumb !== NO_BREADCRUMB)` below
    if (
      (match && userProvidedBreadcrumb === null) ||
      (!match && matchOptions)
    ) {
      breadcrumb = NO_BREADCRUMB;
      return true;
    }

    if (match) {
      // this covers the case where a user may be extending their react-router route
      // config with breadcrumbs, but also does not want default breadcrumbs to be
      // automatically generated (opt-in)
      if (!userProvidedBreadcrumb && disableDefaults) {
        breadcrumb = NO_BREADCRUMB;
        return true;
      }

      breadcrumb = (
        <Breadcrumb.Item key={`${match.url}.${userProvidedBreadcrumb.name}`}>
          {userProvidedBreadcrumb.link ? (
            <Link to={match.url}>
              {userProvidedBreadcrumb.icon}
              <span>{userProvidedBreadcrumb.name}</span>
            </Link>
          ) : (
            <span>
              {userProvidedBreadcrumb.icon} {userProvidedBreadcrumb.name}
            </span>
          )}
        </Breadcrumb.Item>
      );

      return true;
    }
    return false;
  });

  if (breadcrumb) {
    // user provided a breadcrumb prop, or we generated one via humanizeString above ~L75
    return breadcrumb;
  } else if (disableDefaults) {
    // if there was no breadcrumb provided and user has disableDefaults turned on
    return NO_BREADCRUMB;
  }

  // if the above conditionals don't fire, generate a default breadcrumb based on the path
  return NO_BREADCRUMB;
};

const getBreadcrumbs = ({ routes, location, options = {} }) => {
  const matches = [];
  const { pathname } = location;

  pathname
    .split("?")[0]
    // remove trailing slash "/" from pathname
    .replace(/\/$/, "")
    // split pathname into sections
    .split("/")
    // reduce over the sections and find matches from `routes` prop
    .reduce((previousSection, currentSection) => {
      // combine the last route section with the currentSection
      // ex `pathname = /1/2/3 results in match checks for
      // `/1`, `/1/2`, `/1/2/3`
      const pathSection = !currentSection
        ? "/"
        : `${previousSection}/${currentSection}`;

      const breadcrumb = getBreadcrumb({
        currentSection,
        location,
        pathSection,
        routes,
        ...options
      });

      // add the breadcrumb to the matches array
      // unless the user has explicitly passed { path: x, breadcrumb: null } to disable
      if (breadcrumb !== NO_BREADCRUMB) {
        matches.push(breadcrumb);
      }

      return pathSection === "/" ? "" : pathSection;
    }, null);

  return matches;
};

/**
 * ↑↑↑↑↑ adjust from https://github.com/icd2k3/react-router-breadcrumbs-hoc/blob/master/src/index.js
 */

class BreadCrumbs extends Component {
  state = {};
  render() {
    const breadcrumbsData = getBreadcrumbs({
      routes: flattenRoutes(this.props.routes),
      location: this.props.location,
      options: {}
    });

    return <Breadcrumb style={this.props.style}>{breadcrumbsData}</Breadcrumb>;
  }
}

export default BreadCrumbs;
