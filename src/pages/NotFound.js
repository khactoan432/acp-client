import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const NotFound = () => {
    return (_jsxs("div", { style: styles.container, children: [_jsx("h1", { style: styles.title, children: "404" }), _jsx("p", { style: styles.subtitle, children: "Oops! The page you\u2019re looking for doesn\u2019t exist." }), _jsx(Link, { to: "/", style: styles.link, children: "Go back to Home" })] }));
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        color: '#212529',
    },
    title: {
        fontSize: '8rem',
        fontWeight: 'bold',
        margin: 0,
    },
    subtitle: {
        fontSize: '1.5rem',
        margin: '1rem 0',
    },
    link: {
        fontSize: '1.25rem',
        color: '#007bff',
        textDecoration: 'none',
    },
};
export default NotFound;
