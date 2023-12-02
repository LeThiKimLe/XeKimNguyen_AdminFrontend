import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CBadge } from '@coreui/react'
import { useSelector } from 'react-redux'
import { selectCancelRequest } from 'src/feature/cancel-request/request.slice'
export const AppSidebarNav = ({ items }) => {
    const listCancelRequest = useSelector(selectCancelRequest)
    const location = useLocation()
    const navLink = (name, icon, badge) => {
        return (
            <>
                {icon && icon}
                {name && name}
                {badge && (
                    <CBadge color={badge.color} className="ms-auto">
                        {badge.text !== ''
                            ? badge.text
                            : listCancelRequest.filter((req) => req.state === 'Chờ phê duyệt')
                                  .length}
                    </CBadge>
                )}
            </>
        )
    }

    const navItem = (item, index) => {
        const { component, name, badge, icon, ...rest } = item
        const Component = component
        return (
            <Component
                {...(rest.to &&
                    !rest.items && {
                        component: NavLink,
                    })}
                key={index}
                {...rest}
            >
                {navLink(name, icon, badge)}
            </Component>
        )
    }
    const navGroup = (item, index) => {
        const { component, name, icon, to, ...rest } = item
        const Component = component
        return (
            <Component
                idx={String(index)}
                key={index}
                toggler={navLink(name, icon)}
                visible={location.pathname.startsWith(to)}
                {...rest}
            >
                {item.items?.map((item, index) =>
                    item.items ? navGroup(item, index) : navItem(item, index),
                )}
            </Component>
        )
    }

    return (
        <React.Fragment>
            {items &&
                items.map((item, index) =>
                    item.items ? navGroup(item, index) : navItem(item, index),
                )}
        </React.Fragment>
    )
}

AppSidebarNav.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
