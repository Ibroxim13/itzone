import { Link, useLocation } from 'react-router-dom'

function PageController() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const currentLink = [];

    const crumbs = location.pathname.split("/")
        .filter((crumb) => crumb !== "")
        .map((crumb) => {
            currentLink.push(`${crumb}`)
            return (
                <div key={crumb}>
                    <Link>{crumb}</Link>
                </div>
            )
        })
    return (
        <div className='page-contrloller'>
            <span><Link to={localUser.role ? "/home" : "/"} >Home / </Link></span>
            <span style={{"display":"flex"}}>{crumbs}</span>
        </div>
    )
}

export default PageController