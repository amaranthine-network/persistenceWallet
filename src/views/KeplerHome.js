import React, {useEffect, useState} from "react";
import "../utils/kepler";
import KeplerWallet from "../utils/kepler";
import {useHistory , NavLink} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import ModalFaq from "../containers/Faq";

const KeplerHome = (props) => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [showFaq, setShowFaq] = useState(false);
    const [address, setAddress] = useState("");
    useEffect(() => {
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            const address = localStorage.getItem("address");
            setAddress(address);
        }).catch(err => {
            setErrorMessage(err.message)
        });
    }, []);
    const handleKepler = () => {
        setErrorMessage("")
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            const address = localStorage.getItem("address");
            setAddress(address);
        }).catch(err => {
            setErrorMessage(err.message)
        });
    };

    const handleRoute = () => {
        localStorage.setItem('loginMode', 'kepler');
        localStorage.setItem('loginToken', 'loggedIn');
        history.push('/dashboard/wallet');
    };

    const handleHelp = () => {
        setShowFaq(true)
    };

    return (
        <div className="kepler-section">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><NavLink to="/">
                        <img src={logo} alt="logo"/>
                    </NavLink></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <a className="nav-link" href="https://persistence.one/" target="_blank"
                               rel="noopener noreferrer">Learn More</a>
                            <a className="nav-link" onClick={handleHelp} target="_blank"
                                     rel="noopener noreferrer">Help</a>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="kepler-container">
                <div className="info">
                    <h3>Use Keplr Browser Extension</h3>
                    {errorMessage !== "" ?
                        <>
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleKepler()}>Connect
                                </button>
                            </div>
                            <div className="text">
                                <p>There was an error connecting to the Keplr extension:</p>
                                <p className="form-error">{errorMessage}</p>
                            </div>
                        </>
                        :
                        <>

                            <p>Below account we've received from the Keplr browser extension.</p>
                            <div className="buttons-list">
                                <p>{address}</p>
                                {props.location.state !== undefined ? props.location.state.currentPath !== "importWallet"  ?
                                    <button className="button button-primary" onClick={() => handleRoute()}>Use
                                    </button>
                                    : null
                                    : <button className="button button-primary" onClick={() => handleRoute()}>Use
                                    </button>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>
    )
};
export default KeplerHome;