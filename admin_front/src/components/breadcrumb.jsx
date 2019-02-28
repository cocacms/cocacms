import React from "react";
import { Breadcrumb } from "antd";
import Link from "umi/link";
import { getBreadcrumbs } from "react-router-breadcrumbs-hoc";
import { Icon } from "antd";

const BreadcrumbBox = props => {
  const { style, routes, location } = props;
  return (
    <Breadcrumb style={style}>
      {getBreadcrumbs({
        routes: routes.filter(route => route.path),
        location
      }).map((breadcrumb, index) => {
        if (!breadcrumb.props.title) return null;
        return (
          <Breadcrumb.Item key={breadcrumb.key}>
            <Link to={breadcrumb.props.match.url}>
              {breadcrumb.props.icon && (
                <Icon type={breadcrumb.props.icon} style={{ marginRight: 5 }} />
              )}
              {breadcrumb.props.title}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbBox;
